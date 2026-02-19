<?php

use App\Enum\RolesEnum;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;


Route::get('/', [ProductController::class, 'index'])->name('home');

Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

Route::middleware(['auth', 'verified'])->group(function () {

});

require __DIR__ . '/settings.php';
