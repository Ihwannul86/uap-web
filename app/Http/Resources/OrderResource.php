<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'customer_name' => $this->customer_name,
            'phone' => $this->phone,
            'address' => $this->address,
            'total_amount' => (float) $this->total_amount,
            'status' => $this->status,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'order_items' => OrderItemResource::collection($this->whenLoaded('orderItems')),
        ];
    }
}
