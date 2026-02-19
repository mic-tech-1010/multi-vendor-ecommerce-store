import { Product, Section } from "@/types";
import ProductCard from "./ProductCard";
import { Link } from "@inertiajs/react";
import ProductController from "@/actions/App/Http/Controllers/ProductController";

export default function ProductGridSection({ section }: { section: Section }) {

    const gridClasses = getGridClasses(section.layout);

    return (
        <ProductCard section={section} >
            <ProductCardGrid className={gridClasses} products={section.products} layout={section.layout} />
        </ProductCard>

    );
}

function ProductCardGrid({ layout, products, className = "" }: { products: Product[], className: string, layout: string }) {
    return (
        <ul className={`flex-1 ${className}`}>
            {products ? products.map(product => (
                <li key={product.id} className="">
                    <Link href={ProductController.show(product.slug)} className="block h-full">
                        <img src={product.image} alt={product.slug} className="aspect-square h-full max-h-full w-full" />
                        {layout === 'single-grid' ? null : (<p className="text-sm truncate">{product.name}</p>)}
                    </Link>
                </li>
            )) : null}
        </ul>
    )
}

function getGridClasses(layout: string): string {

    switch (layout) {

        case 'two-by-two-grid':
            return "grid grid-cols-2 auto-rows-fr gap-x-2 gap-y-8";

        case 'three-by-one-grid':
            return "grid grid-cols-3 [&>li:first-child]:col-span-3 [&>li:first-child]:aspect-[3/2] [&>*:not(:first-child)]:aspect-square gap-x-2 gap-y-1";

        case 'single-grid':
            return "grid grid-cols-1 gap-3";

        default:
            return "";
    }
}
