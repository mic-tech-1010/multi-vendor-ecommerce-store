<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'quantity' => $this->quantity,
            'image' => $this->getFirstMediaUrl('images', 'small'),
            'images' => $this->getMedia('images')->map(function ($media) {
                return [
                    'id' => $media->id,
                    'thumb' => $media->getUrl('thumb'),
                    'small' => $media->getUrl('small'),
                    'large' => $media->getUrl('large'),
                ];
            }),
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'department' => [
                'id' => $this->department->id,
                'name' => $this->department->name,
            ],
            'productAttributes' => $this->productAttributes->map(function ($attribute) {
                return [
                    'id' => $attribute->id,
                    'name' => $attribute->name,
                    'type' => $attribute->type,
                    'options' => $attribute->options->map(function ($option) {
                        return [
                            'id' => $option->id,
                            'value' => $option->value,
                            'images' => $option->getMedia('images')->map(function ($media) {
                                return [
                                    'id' => $media->id,
                                    'thumb' => $media->getUrl('thumb'),
                                    'small' => $media->getUrl('small'),
                                    'large' => $media->getUrl('large'),
                                ];
                            }),
                        ];
                    }),
                ];
            }),
            'skus' => $this->skus->map(function ($sku) {
                return [
                    'id' => $sku->id,
                    'sku' => $sku->sku,
                    'price' => $sku->price,
                    'quantity' => $sku->quantity,
                ];
            }),
        ];
    }
}
