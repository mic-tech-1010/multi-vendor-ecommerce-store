<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductSku;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProductSkuGenerator
{
    public function generate(Product $product): void
{
    // ─────────────────────────────────────────────
    // STEP 0 — DOMAIN GUARDS (NEW)
    // ─────────────────────────────────────────────

    if (! $product->has_variations) {
        // Product switched to simple → remove all SKUs
        $product->skus()->delete();
        return;
    }

    $product->load('productAttributes.options');

    // 🚨 IMPORTANT: at least 2 attributes are required
    if ($product->productAttributes->count() < 2) {
        // Not a variable product yet → clean slate
        $product->skus()->delete();
        return;
    }

    // ─────────────────────────────────────────────
    // STEP 1 — BUILD ATTRIBUTE MATRIX (UNCHANGED)
    // ─────────────────────────────────────────────

    $attributeValueSets = $product->productAttributes->map(function ($attribute) {
        if ($attribute->options->isEmpty()) {
            throw ValidationException::withMessages([
                'attributes' => "Attribute '{$attribute->name}' has no values.",
            ]);
        }

        return $attribute->options->pluck('id')->all();
    })->all();

    // ─────────────────────────────────────────────
    // STEP 2 — CARTESIAN PRODUCT (UNCHANGED)
    // ─────────────────────────────────────────────

    $combinations = $this->cartesianProduct($attributeValueSets);

    // Normalize desired combinations
    $desiredCombinations = collect($combinations)
        ->map(fn ($combo) => collect($combo)->sort()->values()->all());

    // ─────────────────────────────────────────────
    // STEP 3 — SYNC SKUs (NEW LOGIC)
    // ─────────────────────────────────────────────

    DB::transaction(function () use ($product, $desiredCombinations) {

        // 3A — DELETE INVALID SKUs (NEW)
        $product->skus()->with('attributeValues')->get()->each(function ($sku) use ($desiredCombinations) {
            $skuCombination = $sku->attributeValues
                ->pluck('id')
                ->sort()
                ->values()
                ->all();

            if (! $desiredCombinations->contains($skuCombination)) {
                $sku->delete();
            }
        });

        // 3B — CREATE MISSING SKUs (REFINED)
        $existingCombinations = $product->skus()
            ->with('attributeValues:id')
            ->get()
            ->map(fn ($sku) =>
                $sku->attributeValues->pluck('id')->sort()->values()->all()
            );


        foreach ($desiredCombinations as $combination) {
            if ($existingCombinations->contains($combination)) {
                continue;
            }

            $sku = ProductSku::create([
                'product_id' => $product->id,
                'sku'        => $this->generateSkuCode($product, $combination),
                'price'      => $product->price,
                'quantity'   => 0,
            ]);

            $sku->attributeValues()->attach($combination);
        }
    });
}

    /**
     * Generate cartesian product
     */
    private function cartesianProduct(array $sets): array
    {
        $result = [[]];

        foreach ($sets as $set) {
            $result = collect($result)
                ->flatMap(
                    fn($product) =>
                    collect($set)->map(fn($value) => array_merge($product, [$value]))
                )
                ->all();
        }

        return $result;
    }

    /**
     * SKU code generator
     */
    private function generateSkuCode(Product $product, array $attributeValueIds): string
    {
        return 'P' . $product->id . '-' . implode('-', $attributeValueIds);
    }
}
