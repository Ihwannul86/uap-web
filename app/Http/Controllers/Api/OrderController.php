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
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class OrderController extends Controller
{
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

    public function store(Request $request)
    {
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
            $order = Order::create([
                'user_id' => $user->id,
                'customer_name' => $request->customer_name,
                'phone' => $request->phone,
                'address' => $request->address,
                'total_amount' => 0,
            ]);

            $totalAmount = 0;

            foreach ($request->items as $item) {
                $product = Product::where('uuid', $item['product_uuid'])->first();

                if (!$product) {
                    throw new \Exception("Product tidak ditemukan");
                }

                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Stok {$product->product_name} tidak cukup. Tersisa: {$product->stock}");
                }

                $subtotal = $product->price * $item['quantity'];

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => $subtotal,
                ]);

                $product->decrement('stock', $item['quantity']);
                $totalAmount += $subtotal;
            }

            $order->update(['total_amount' => $totalAmount]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => new OrderResource($order->load('orderItems.product'))
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function show(Order $order)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if ($order->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
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

    public function update(Request $request, Order $order)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if ($order->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

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

            $order->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Order updated successfully',
                'data' => new OrderResource($order->load('orderItems.product'))
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }
    }

    public function destroy(Order $order)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if ($order->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            DB::beginTransaction();
            try {
                foreach ($order->orderItems as $item) {
                    $item->product->increment('stock', $item->quantity);
                }

                $order->delete();
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Order deleted successfully and stock restored'
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
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
