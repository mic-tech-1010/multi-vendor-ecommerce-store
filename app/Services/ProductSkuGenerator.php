<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductSku;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProductSkuGenerator
{
    public function generate(Product $product): void
    {
        // ─────────────────────────────────────────────
        // STEP 0 — DOMAIN GUARDS
        // ─────────────────────────────────────────────

        $product->load('productAttributes.options');

        // Product switched to simple → remove all SKUs
        if (! $product->has_variations) {
            $product->skus()->delete();
            return;
        }

        if ($product->productAttributes->count() === 0) {
            $product->skus()->delete();
            return;
        }

        // ─────────────────────────────────────────────
        // STEP 1 — BUILD ATTRIBUTE MATRIX
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
        // STEP 2 — CARTESIAN PRODUCT
        // ─────────────────────────────────────────────

        $combinations = $this->cartesianProduct($attributeValueSets);

        // Normalize desired combinations
        $desiredCombinations = collect($combinations)
            ->map(fn($combo) => collect($combo)->sort()->values()->all());

        // ─────────────────────────────────────────────
        // STEP 3 — SYNC SKUs
        // ─────────────────────────────────────────────

        DB::transaction(function () use ($product, $desiredCombinations) {

            // 3A — DELETE INVALID SKUs
            $attributeCount = $product->productAttributes->count();

            $product->skus()
                ->with('attributeValues:id')
                ->get()
                ->each(function ($sku) use ($attributeCount) {

                    if ($sku->attributeValues->count() !== $attributeCount) {
                        $sku->delete();
                    }
                });

            // 3B — CREATE MISSING SKUs
            $existingCombinations = $product->skus()
                ->with('attributeValues:id')
                ->get()
                ->map(
                    fn($sku) =>
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
        if (count($sets) === 0) {
            return [];
        }

        $base = array_shift($sets);

        return collect($base)
            ->crossJoin(...$sets)
            ->all();
    }

    /**
     * SKU code generator
     */
    private function generateSkuCode(Product $product, array $attributeValueIds): string
    {
        return 'P' . $product->id . '-' . implode('-', $attributeValueIds);
    }
}
