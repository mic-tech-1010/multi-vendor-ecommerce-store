<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Services\CartService;

class CartController extends Controller
{
    public function index()
    {
        //
    }

    public function store(Request $request, Product $product, CartService $cartService)
    {
        $request->mergeIfMissing([
            'quantity' => 1
        ]);

        $data = $request->validate([
            'sku_id' => ['nullable'],
            'quantity' => ['required', 'integer', 'min:1']
        ]);

        $cartService->addItemToCart(
            $product,
            $data['quantity'],
            $data['sku_id'] ?: null
        );

        return back()->with('success', 'Product added to cart sccessfully!');
    }
}
