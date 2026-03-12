<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CheckOutController;


Route::get('/', [ProductController::class, 'index'])->name('home');

Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

Route::controller(CartController::class)->group(function () {
    Route::get('/cart', 'index')->name('cart.index');
    Route::post('/cart/add/{product}', 'store')->name('cart.store');
    Route::put('/cart/{product}', 'update')->name('cart.update');
    Route::delete('/cart/{product}', 'destroy')->name('cart.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {

    Route::post('/cart/checkout', [CheckOutController::class, 'checkout'])
        ->name('cart.checkout');

    Route::get('stripe/success', [CheckOutController::class, 'success'])
        ->name('stripe.success');

    Route::get('stripe/failure', [CheckOutController::class, 'failure'])
        ->name('stripe.failure');
});

require __DIR__ . '/settings.php';
