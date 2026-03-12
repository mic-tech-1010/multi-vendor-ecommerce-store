<?php

namespace App\Http\Resources;

use App\Http\Resources\VendorUserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


class OrderViewResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'total_price' => $this->total_price,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'vendorUser' => new VendorUserResource($this->vendorUser),
            'orderItems' => $this->orderItems->map(fn($item) => [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'product_sku_id' => $item->product_sku_id,
                'product' => [
                    'id' => $item->product->id,
                    'title' => $item->product->title,
                    'slug' => $item->product->slug,
                    'description' => $item->product->description,
                    'image' =>$item->product->getImageForOptions($item->variation_type_option_ids ?: []),
                ]
            ])
        ];
    }
}