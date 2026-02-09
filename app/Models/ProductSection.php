<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ProductSection extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'layout',
        'type',
        'active',
        'sort_order',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_section_product')
            ->withPivot('position')
            ->orderBy('product_section_product.position');
    }
}
