<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class OrderController extends Controller
{
    /**
     * GET /api/orders
     * Get all orders for authenticated user
     */
    public function index()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $orders = Order::with(['orderItems.product', 'user'])
                ->where('user_id', $user->id)
                ->latest()
                ->get();

            return response()->json([
                'success' => true,
                'data' => OrderResource::collection($orders)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }
    }

    /**
     * POST /api/orders
     * Create new order with auto stock update
     */
    public function store(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_uuid' => 'required|exists:products,uuid',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Authenticate user
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        DB::beginTransaction();
        try {
            // ✅ VALIDASI STOK TERLEBIH DAHULU
            $orderItemsData = [];
            $totalAmount = 0;

            foreach ($request->items as $item) {
                $product = Product::where('uuid', $item['product_uuid'])->first();

                if (!$product) {
                    throw new \Exception("Produk dengan UUID {$item['product_uuid']} tidak ditemukan");
                }

                // ⭐ CEK STOK TERSEDIA
                if ($product->stock < $item['quantity']) {
                    throw new \Exception(
                        "Stok produk '{$product->product_name}' tidak cukup! " .
                        "Tersedia: {$product->stock} unit, Diminta: {$item['quantity']} unit"
                    );
                }

                $subtotal = $product->price * $item['quantity'];
                $totalAmount += $subtotal;

                $orderItemsData[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'subtotal' => $subtotal,
                ];
            }

            // Create order dengan status PENDING (default)
            $order = Order::create([
                'user_id' => $user->id,
                'customer_name' => $request->customer_name,
                'phone' => $request->phone,
                'address' => $request->address,
                'total_amount' => $totalAmount,
                'status' => 'pending', // ⭐ STATUS AWAL
            ]);

            // ✅ CREATE ORDER ITEMS & AUTO UPDATE STOK
            foreach ($orderItemsData as $itemData) {
                // Create order item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $itemData['product']->id,
                    'quantity' => $itemData['quantity'],
                    'price' => $itemData['product']->price,
                    'subtotal' => $itemData['subtotal'],
                ]);

                // ⭐ KURANGI STOK OTOMATIS
                $itemData['product']->decrement('stock', $itemData['quantity']);

                // Log untuk debugging
                Log::info("✅ Order #{$order->order_number}: Stock reduced for '{$itemData['product']->product_name}' by {$itemData['quantity']} units. New stock: {$itemData['product']->fresh()->stock}");
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pesanan berhasil dibuat! Stok produk telah diperbarui.',
                'data' => new OrderResource($order->load('orderItems.product'))
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error("❌ Order creation failed: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * GET /api/orders/{order}
     * Get single order detail
     */
    public function show(Order $order)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            // Authorization check
            if ($order->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki akses ke pesanan ini'
                ], 403);
            }

            $order->load(['orderItems.product', 'user']);

            return response()->json([
                'success' => true,
                'data' => new OrderResource($order)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }
    }

    /**
     * PUT /api/orders/{order}
     * Update order (status, customer info, etc)
     * ⭐ AUTO RETURN STOCK saat status = cancelled
     */
    public function update(Request $request, Order $order)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            // Authorization check
            if ($order->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki akses ke pesanan ini'
                ], 403);
            }

            // Validasi input
            $validator = Validator::make($request->all(), [
                'customer_name' => 'sometimes|required|string|max:255',
                'phone' => 'sometimes|required|string|max:20',
                'address' => 'sometimes|required|string',
                'status' => 'sometimes|required|in:pending,processing,completed,cancelled',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();
            try {
                $oldStatus = $order->status; // Simpan status lama

                // ⭐ LOGIC 1: JIKA STATUS BERUBAH KE CANCELLED, KEMBALIKAN STOK
                if (isset($request->status) && $request->status === 'cancelled' && $oldStatus !== 'cancelled') {
                    Log::info("🔄 Order #{$order->order_number} is being cancelled. Returning stock...");

                    foreach ($order->orderItems as $item) {
                        $product = Product::find($item->product_id);
                        if ($product) {
                            $oldStock = $product->stock;
                            $product->increment('stock', $item->quantity);
                            $newStock = $product->fresh()->stock;

                            Log::info("✅ Stock returned: '{$product->product_name}' +{$item->quantity} units (Old: {$oldStock}, New: {$newStock})");
                        }
                    }
                }

                // ⭐ LOGIC 2: JIKA STATUS DIKEMBALIKAN DARI CANCELLED, KURANGI STOK LAGI
                if (isset($request->status) && $oldStatus === 'cancelled' && $request->status !== 'cancelled') {
                    Log::info("🔄 Order #{$order->order_number} is being reactivated from cancelled. Reducing stock again...");

                    foreach ($order->orderItems as $item) {
                        $product = Product::find($item->product_id);
                        if ($product) {
                            // ✅ CEK STOK CUKUP ATAU TIDAK
                            if ($product->stock < $item->quantity) {
                                throw new \Exception(
                                    "Tidak dapat mengaktifkan kembali pesanan! " .
                                    "Stok '{$product->product_name}' tidak cukup. " .
                                    "Tersedia: {$product->stock} unit, Dibutuhkan: {$item->quantity} unit"
                                );
                            }

                            $oldStock = $product->stock;
                            $product->decrement('stock', $item->quantity);
                            $newStock = $product->fresh()->stock;

                            Log::info("✅ Stock reduced: '{$product->product_name}' -{$item->quantity} units (Old: {$oldStock}, New: {$newStock})");
                        }
                    }
                }

                // Update order data
                $order->update($request->all());

                DB::commit();

                Log::info("✅ Order #{$order->order_number} updated successfully. Status: {$oldStatus} → {$order->status}");

                return response()->json([
                    'success' => true,
                    'message' => 'Pesanan berhasil diupdate!',
                    'data' => new OrderResource($order->load('orderItems.product'))
                ]);

            } catch (\Exception $e) {
                DB::rollBack();

                Log::error("❌ Order update failed: " . $e->getMessage());

                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ], 400);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }
    }

    /**
     * DELETE /api/orders/{order}
     * Delete order and restore stock
     */
    public function destroy(Order $order)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            // Authorization check
            if ($order->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki akses ke pesanan ini'
                ], 403);
            }

            DB::beginTransaction();
            try {
                Log::info("🗑️ Deleting Order #{$order->order_number}. Returning stock...");

                // ⭐ KEMBALIKAN STOK JIKA ORDER BELUM CANCELLED
                if ($order->status !== 'cancelled') {
                    foreach ($order->orderItems as $item) {
                        $product = Product::find($item->product_id);
                        if ($product) {
                            $oldStock = $product->stock;
                            $product->increment('stock', $item->quantity);
                            $newStock = $product->fresh()->stock;

                            Log::info("✅ Stock returned (deleted): '{$product->product_name}' +{$item->quantity} units (Old: {$oldStock}, New: {$newStock})");
                        }
                    }
                } else {
                    Log::info("ℹ️ Order already cancelled. Stock was already returned.");
                }

                $order->delete();
                DB::commit();

                Log::info("✅ Order #{$order->order_number} deleted successfully!");

                return response()->json([
                    'success' => true,
                    'message' => 'Pesanan berhasil dihapus dan stok dikembalikan!'
                ]);

            } catch (\Exception $e) {
                DB::rollBack();

                Log::error("❌ Order deletion failed: " . $e->getMessage());

                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }
    }
}
