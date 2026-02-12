<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;

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


    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true);

    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_section_product')
            ->withPivot('position')
            ->orderBy('product_section_product.position');
    }
}
