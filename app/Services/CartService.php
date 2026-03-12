<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductAttributeValue;
use App\Models\ProductSku;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CartService
{

    private ?array $cachedCartItems = null;

    protected const COOKIE_NAME = 'cartItems';

    protected const COOKIE_LIFETIME = 60 * 24 * 365; //  1 year

    public function addItemToCart(Product $product, int $quantity = 1, $skuId = null)
    {
        if ($product->skus->isNotEmpty()) {
            if ($skuId === null) {
                $skuId =  $product->skus[0]->id;
            }
        }

        $price = $product->getPriceForOptions($skuId);

        if (Auth::check()) {
            $this->saveItemToDatabase($product->id, $quantity, $price, $skuId);
        } else {
            $this->saveItemToCookies($product->id, $quantity, $price, $skuId);
        }
    }

    public function updateItemQuantity(int $productId, int $quantity, int|null $skuId)
    {
        if (Auth::check()) {
            $this->updateItemQuantityInDatabase($productId, $quantity, $skuId);
        } else {
            $this->updateItemQuantityInCookies($productId, $quantity, $skuId);
        }
    }

    public function removeItemFromCart(int $productId, int|null $skuId)
    {
        if (Auth::check()) {
            $this->removeItemFromDatabase($productId, $skuId);
        } else {
            $this->removeItemFromCookies($productId, $skuId);
        }
    }

    protected function saveItemToDatabase(int $productId, int $quantity, float|int $price, int|null $skuId)
    {
        $userId = Auth::id();

        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('product_sku_id', $skuId)
            ->first();

        if ($cartItem) {
            $cartItem->update([
                'quantity' => DB::raw('quantity + ' . $quantity),
            ]);
        } else {
            CartItem::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $price,
                'product_sku_id' => $skuId
            ]);
        }
    }

    protected function saveItemToCookies(int $productId, int $quantity, float|int $price, int|null $skuId)
    {
        $cartItems = $this->getCartItemsFromCookies();

        $itemKey = $productId . '_' . $skuId;

        if (isset($cartItems[$itemKey])) {
            $cartItems[$itemKey]['quantity'] += $quantity;
            $cartItems[$itemKey]['price'] = $price;
        } else {
            $cartItems[$itemKey] = [
                'id' => Str::uuid(),
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $price,
                'product_sku_id' => $skuId,
            ];
        }

        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIFETIME);
    }

    protected function updateItemQuantityInDatabase(int $productId, int $quantity, int|null $skuId)
    {
        $userId = Auth::id();

        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('product_sku_id', $skuId)
            ->first();

        if (!$cartItem) {
            throw new \Exception("Cart item not found");
        }

        $cartItem->update(['quantity' => $quantity]);
    }

    protected function updateItemQuantityInCookies(int $productId, int $quantity, int|null $skuId)
    {
        $cartItems = $this->getCartItemsFromCookies();

        $itemKey = $productId . '_' . $skuId;

        if (!isset($cartItems[$itemKey])) {
            throw new \Exception("Cart item not found in cookies");
        }

        $cartItems[$itemKey]['quantity'] = $quantity;

        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIFETIME);
    }

    protected function removeItemFromDatabase($productId, $skuId)
    {
        $userId = Auth::id();

        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('product_sku_id', $skuId)
            ->first();

        if (!$cartItem) {
            throw new \Exception("Cart item not found");
        }

        $cartItem->delete();
    }

    protected function removeItemFromCookies($productId, $skuId)
    {
        $cartItems = $this->getCartItemsFromCookies();

        $itemKey = $productId . '_' . $skuId;

        if (!isset($cartItems[$itemKey])) {
            throw new \Exception("Cart item not found in cookies");
        }

        // Remove the item from the cart
        unset($cartItems[$itemKey]);

        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIFETIME);
    }

    public function clearCart()
    {
        if (Auth::check()) {
            CartItem::where('user_id', Auth::id())->delete();
        } else {
            Cookie::queue(Cookie::forget(self::COOKIE_NAME));
        }
    }

    public function getTotalQuantity(): int
    {
        $cartItems = $this->getCartItems();

        return collect($cartItems)->sum('quantity');
    }

    public function getTotalPrice(): float
    {
        $cartItems = $this->getCartItems();

        return collect($cartItems)->sum(fn($item) => $item['price'] * $item['quantity']);
    }

    protected function getCartItemsFromDatabase()
    {
        $userId = Auth::id();

        $cartItems = CartItem::where('user_id', $userId)
            ->get()
            ->map(function ($cartItem) {
                return [
                    'id' => $cartItem->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->price,
                    'product_sku_id' => $cartItem->product_sku_id,
                ];
            })
            ->toArray();

        return $cartItems;
    }

    protected function getCartItemsFromCookies()
    {
        $cartItems = json_decode(Cookie::get(self::COOKIE_NAME, '[]'), true);

        return $cartItems;
    }

    public function getCartItems(): array
    {
        try {
            if ($this->cachedCartItems === null) {
                // if the user is authenticated
                if (Auth::check()) {
                    $cartItems = $this->getCartItemsFromDatabase();
                } else {
                    // if the user is a guest, retrieve from cookies
                    $cartItems = $this->getCartItemsFromCookies();
                }

                $productIds = collect($cartItems)->map(fn($item) => $item['product_id']);

                $products = Product::whereIn('id', $productIds)
                    ->with('user.vendor')
                    ->forWebsite()
                    ->get()
                    ->keyBy('id');

                $cartItemData  = [];
                foreach ($cartItems as $key => $cartItem) {
                    $product = data_get($products, $cartItem['product_id']);
                    if (!$product) continue;

                    $optionInfo = [];
                    $imageUrl = null;

                    if ($cartItem['product_sku_id']) {
                        $sku = ProductSku::with('attributeValues.productAttribute')
                            ->find($cartItem['product_sku_id']);

                        if ($sku) {
                            foreach ($sku->attributeValues as $option) {

                                if (!$imageUrl) {
                                    $imageUrl = $option->getFirstMediaUrl('images', 'small');
                                }

                                $optionInfo[] = [
                                    'id' => $option->id,
                                    'value' => $option->value,
                                    'type' => [
                                        'id' => $option->product_attribute_id,
                                        'name' => $option->productAttribute->name,
                                    ],
                                ];
                            }
                        }
                    }

                    $cartItemData[] = [
                        'id' => $cartItem['id'],
                        'product_id' => $product->id,
                        'title' => $product->title,
                        'slug' => $product->slug,
                        'price' => $cartItem['price'],
                        'quantity' => $cartItem['quantity'],
                        'product_sku_id' => $cartItem['product_sku_id'],
                        'options' => $optionInfo,
                        'image' => $imageUrl ?: $product->getFirstMediaUrl('images', 'small'),
                        'user' => [
                            'id' => $product->created_by,
                            'name' => $product->user->vendor->store_name,
                        ],
                    ];
                }

                $this->cachedCartItems = $cartItemData;
            }

            return $this->cachedCartItems;
        } catch (\Exception $e) {
            Log::error($e->getMessage() . PHP_EOL . $e->getTraceAsString());
        }

        return [];
    }


    public function getCartItemsGrouped(): array
    {
        $cartItems = $this->getCartItems();

        return collect($cartItems)
            ->groupBy(fn($item) => $item['user']['id'])
            ->map(fn($items, $userId) => [
                'user' => $items->first()['user'],
                'items' => $items->toArray(),
                'totalQuantity' => $items->sum('quantity'),
                'totalPrice' => $items->sum(fn($item) => $item['price'] * $item['quantity']),
            ])
            ->toArray();
    }

    public function moveCartItemsToDatabaseFromCookies($userId): void
    {
        //Get the cart items from the cookie
        $cartItems = $this->getCartItemsFromCookies();

        //Loop through the cart items and insert them into the database
        foreach ($cartItems as $itemKey => $cartItem) {
            // check if the cart item already exists for the user

            $existingItem = CartItem::where('user_id', $userId)
                ->where('product_id', $cartItem['product_id'])
                ->where('product_sku_id', $cartItem['product_sku_id'])
                ->first();

            if ($existingItem) {
                // if the item exists, update the quantity
                $existingItem->update([
                    'quantity' => $existingItem->quantity + $cartItem['quantity'],
                    'price' => $cartItem['price'],

                ]);
            } else {
                // if the item doesn't exist, create a new record
                CartItem::create([
                    'user_id' => $userId,
                    'product_id' => $cartItem['product_id'],
                    'quantity' => $cartItem['quantity'],
                    'price' => $cartItem['price'],
                    'product_sku_id' => $cartItem['product_sku_id'] ?: null,
                ]);
            }
        }

        //after transferring the items, delete the cart from the cokoies
        Cookie::queue(self::COOKIE_NAME, '', -1); //Delete cookies
    }
}
