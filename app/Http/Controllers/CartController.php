<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Services\CartService;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(CartService $cartService)
    {
        return Inertia::render('cart/index', [
            'cartItems' => $cartService->getCartItemsGrouped(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product, CartService $cartService)
    {
        $request->validate([
            'quantity' => ['integer', 'min:1'],
        ]);

        $skuId = $request->input('product_sku_id') ?: null;
        $quantity = $request->input('quantity');

        $cartService->updateItemQuantity($product->id, $quantity, $skuId);

        return back()->with('success', 'Quantity was updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Product $product, CartService $cartService)
    {
        $skuId = $request->input('product_sku_id') ?: null;

        $cartService->removeItemFromCart($product->id, $skuId);

        return back()->with('success', 'product was removed from cart.');
    }

    public function checkOut() {}
}
