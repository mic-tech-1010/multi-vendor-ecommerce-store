import Carousel from "@/components/custom/ProductDetailCarousel"
import PageLayout from "@/layouts/app-layout"
import { PaginationProps, Product, ProductAttributeValue } from "@/types";
import { useMemo, useState } from "react";

function Show({ product }: { product: Product }) {

    const [selectedOptions, setSelectedOptions] = useState<Record<number, ProductAttributeValue>>([]);

    const images = useMemo(() => {

        for (let typeId in selectedOptions) {
            const option = selectedOptions[typeId];
            if (option.images.length > 0) return option.images;
        }
        return product.data.images;

    }, [product, selectedOptions]);

    return (
        <main className="container mx-auto p-8">
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">
                <div className="col-span-7">
                    <Carousel images={images} />
                </div>
                <div className="col-span-5">
                    <h1 className="text-2xl mb-8">{product.data.title}</h1>

                    <b className="text-xl">About the Item</b>
                    <div className="ck-content-output" dangerouslySetInnerHTML={{ __html: product.data.description }} />

                </div>
            </div>
        </main>

    )
}

Show.layout = (page: React.ReactNode) => (
    <PageLayout children={page} />
)

export default Show
