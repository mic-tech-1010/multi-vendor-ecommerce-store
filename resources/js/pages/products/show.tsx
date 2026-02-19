import { ProductDetailBreadcrumb } from "@/components/custom/ProductDetailBreadcrumb";
import Carousel from "@/components/custom/ProductDetailCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageLayout from "@/layouts/app-layout";
import { PaginationProps, Product, ProductAttributeValue, Image } from "@/types";
import { useMemo, useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";

function Show({ product }: { product: Product }) {

    const { url } = usePage();
    const [selectedOptions, setSelectedOptions] = useState<Record<number, ProductAttributeValue>>([]);
    const [previewImages, setPreviewImages] = useState<Image[] | null>(null);

    const getOptionIdsMap = (newOptions: object) => {
        return Object.fromEntries(
            Object.entries(newOptions).map(([a, b]) => [a, b.id])
        )
    }

    const chooseOption = (
        typeId: number,
        option: ProductAttributeValue,
        updateRouter: boolean = true
    ) => {

        setPreviewImages(null);

        setSelectedOptions((prevSelectedOptions) => {
            const newOptions = {
                ...prevSelectedOptions,
                [typeId]: option
            }

            if (updateRouter) {
                router.get(url, {
                    options: getOptionIdsMap(newOptions)
                }, {
                    preserveScroll: true,
                    preserveState: true
                })
            }

            return newOptions
        })
    }

    const previewOption = (option: ProductAttributeValue) => {
        if (option.images?.length) {
            setPreviewImages(option.images);
        }
    };

    const images = useMemo(() => {

        if (previewImages) return previewImages;

        for (let typeId in selectedOptions) {
            const option = selectedOptions[typeId];
            if (option.images?.length > 0) return option.images;
        }

        return product.data.images;
    }, [product, selectedOptions, previewImages]);


    const renderProductVariationTypes = () => {
        return (
            product.data.productAttributes.map((type, i: number) => (
                <div key={type.id}>
                    <b>{type.name}</b>
                    {type.type === 'Image' &&
                        <div className="flex gap-2 mb-4">
                            {type.options.map(option => (
                                <div
                                    key={option.id}
                                    onClick={() => chooseOption(type.id, option)}
                                    onMouseEnter={() => previewOption(option)}
                                    onMouseLeave={() => setPreviewImages(null)}
                                >
                                    {option?.images && <img src={option?.images[0]?.thumb} alt=""
                                        className={'w-12.5 cursor-pointer ' + (
                                            selectedOptions[type.id]?.id === option.id ?
                                                'outline-4 outline-primary' : ''
                                        )} />}
                                </div>
                            ))}
                        </div>
                    }
                    {type.type === 'Radio' &&
                        <div className="flex mb-4">
                            {type.options.map(option => {
                                const isChecked =
                                    selectedOptions[type.id]?.id === option.id
                                return (
                                    <Button variant={"default"} key={option.id} tabIndex={0} className={`relative rounded-none border
                                        ${isChecked
                                            ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-500"
                                            : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
                                        }`}>
                                        {option.value}
                                        <Input onChange={() => chooseOption(type.id, option)}
                                            className="absolute opacity-0 h-full w-full"
                                            value={option.id}
                                            type="radio"
                                            checked={selectedOptions[type.id]?.id === option.id}
                                            name={'variation_type_' + type.id}
                                            aria-label={option.value}
                                        />
                                    </Button>
                                )
                            })}

                        </div>}
                </div>
            ))
        )
    }

    return (
        <main className="container mx-auto p-8">
            <ProductDetailBreadcrumb product={product} />
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-12 pt-8">
                <div className="col-span-7">
                    <Carousel images={images} thumbNails={product.data.images} />
                </div>
                <div className="col-span-5">
                    <h1 className="text-3xl font-semibold mb-2">{product.data.name}</h1>

                    {renderProductVariationTypes()}

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
