<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductSectionResource;
use App\Models\ProductSection;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class ProductController extends Controller
{
    public function index()
    {
        $sections = ProductSection::query()
            ->active()
            ->orderBy('sort_order')
            ->with([
                'products' => function ($query) {
                    $query
                        ->forWebsite()
                        ->orderBy('product_section_product.position')
                        ->take(12);
                }
            ])
            ->get();

        return Inertia::render('home', [
            'canRegister' => Features::enabled(Features::registration()),
            'sections' => ProductSectionResource::collection($sections)
        ]);
    }
}
