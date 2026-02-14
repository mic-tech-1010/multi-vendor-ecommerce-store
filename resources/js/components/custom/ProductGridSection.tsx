import { Product, Section } from "@/types";
import ProductCard from "./ProductCard";
import { Link } from "@inertiajs/react";

export default function ProductGridSection({ section }: { section: Section }) {

    const gridClasses = getGridClasses(section.layout);

    return (

        <div className="mb-8">
            <ProductCard section={section} >
               <ProductCardGrid className={gridClasses} products={section.products} />
            </ProductCard>
        </div>

    );
}

function ProductCardGrid({ products, className = "" }: { products: Product[], className: string }) {
    return (
        <ul className={`auto-rows-fr gap-6 ${className}`}>
           { products ? products.map(product => (
            <li key={product.id} className="">
                <Link href="" className="grid">
                    <img src={product.image} alt={product.slug} className="aspect-square h-full max-h-full"/>
                    <p className="text-sm truncate">{product.name}</p>
                </Link>
            </li>
            )) : null}
        </ul>
    )
}

function getGridClasses(layout: string): string {

    switch (layout) {

        case 'two-by-two-grid':
            return "grid grid-cols-2 gap-x-4 gap-y-1.5";

        case 'three-by-one-grid':
            return "grid grid-cols-3 [&>li:first-child]:col-span-3 [&>*:not(:first-child)]:aspect-square gap-x-2 gap-y-1.5";

        case 'single-grid':
            return "grid grid-cols-1 gap-3";

        default:
            return "";
    }
}
