// import { ProductDetailBreadcrumb } from "@/components/custom/ProductDetailBreadcrumb";
// import Carousel from "@/components/custom/ProductDetailCarousel";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import PageLayout from "@/layouts/app-layout";
// import { PaginationProps, Product, ProductAttributeValue, Image } from "@/types";
// import { useMemo, useState, useEffect } from "react";
// import { router, useForm, usePage } from "@inertiajs/react";

// function Show({ product }: { product: Product }) {

//     const { url } = usePage();
//     const [selectedOptions, setSelectedOptions] = useState<Record<number, ProductAttributeValue>>([]);
//     const [previewImages, setPreviewImages] = useState<Image[] | null>(null);

//     const form = useForm<{
//         sku_id: number | null;
//         quantity: number;
//         price: number | null;
//     }>({
//         sku_id: null,
//         quantity: 1,
//         price: null
//     })

//     const getOptionIdsMap = (newOptions: object) => {
//         return Object.fromEntries(
//             Object.entries(newOptions).map(([a, b]) => [a, b.id])
//         )
//     }

//     const chooseOption = (
//         typeId: number,
//         option: ProductAttributeValue,
//         updateRouter: boolean = true
//     ) => {

//         setPreviewImages(null);

//         setSelectedOptions((prevSelectedOptions) => {
//             const newOptions = {
//                 ...prevSelectedOptions,
//                 [typeId]: option
//             }

//             if (updateRouter) {
//                 router.get(url, {
//                     options: getOptionIdsMap(newOptions)
//                 }, {
//                     preserveScroll: true,
//                     preserveState: true
//                 })
//             }

//             return newOptions
//         })
//     }

//     const previewOption = (option: ProductAttributeValue) => {
//         if (option.images?.length) {
//             setPreviewImages(option.images);
//         }
//     };

//     const selectedSku = useMemo(() => {
//         const selectedIds = Object.values(selectedOptions)
//             .map(op => op.id)
//             .sort();

//         for (const sku of product.data.skus) {
//             const skuOptionIds = sku.attribute_value_ids?.slice().sort();

//             if (
//                 skuOptionIds &&
//                 selectedIds.length === skuOptionIds.length &&
//                 selectedIds.every((id, i) => id === skuOptionIds[i])
//             ) {
//                 return sku;
//             }
//         }

//         return null;
//     }, [selectedOptions, product]);

//     const images = useMemo(() => {

//         if (previewImages) return previewImages;

//         for (let typeId in selectedOptions) {
//             const option = selectedOptions[typeId];
//             if (option.images?.length > 0) return option.images;
//         }

//         return product.data.images;
//     }, [product, selectedOptions, previewImages]);

//     const thumbNails = useMemo(() => {

//         return product.data.images;
//     }, [product, selectedOptions]);


//     useEffect(() => {
//         form.setData('sku_id', selectedSku?.id ?? null);
//     }, [selectedSku]);

//     const renderProductVariationTypes = () => {
//         return (
//             product.data.productAttributes.map((attribute, i: number) => (
//                 <div key={attribute.id}>
//                     <b>{attribute.name}</b>
//                     {attribute.type === 'Image' &&
//                         <div className="flex gap-2 mb-4">
//                             {attribute.options.map(option => (
//                                 <div
//                                     key={option.id}
//                                     onClick={() => chooseOption(attribute.id, option)}
//                                     onMouseEnter={() => previewOption(option)}
//                                     onMouseLeave={() => setPreviewImages(null)}
//                                 >
//                                     {option?.images && <img src={option?.images[0]?.thumb} alt=""
//                                         className={'w-12.5 cursor-pointer ' + (
//                                             selectedOptions[attribute.id]?.id === option.id ?
//                                                 'outline-4 outline-primary' : ''
//                                         )} />}
//                                 </div>
//                             ))}
//                         </div>
//                     }
//                     {attribute.type === 'Radio' &&
//                         <div className="flex mb-4">
//                             {attribute.options.map(option => {
//                                 const isChecked =
//                                     selectedOptions[attribute.id]?.id === option.id
//                                 return (
//                                     <Button variant={"default"} key={option.id} tabIndex={0} className={`relative rounded-none border
//                                         ${isChecked
//                                             ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-500"
//                                             : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
//                                         }`}>
//                                         {option.value}
//                                         <Input onChange={() => chooseOption(attribute.id, option)}
//                                             className="absolute opacity-0 h-full w-full"
//                                             value={option.id}
//                                             type="radio"
//                                             checked={selectedOptions[attribute.id]?.id === option.id}
//                                             name={'variation_type_' + attribute.id}
//                                             aria-label={option.value}
//                                         />
//                                     </Button>
//                                 )
//                             })}

//                         </div>}
//                 </div>
//             ))
//         )
//     }

//     return (
//         <main className="container mx-auto p-8">
//             <ProductDetailBreadcrumb product={product} />
//             <div className="grid gap-8 grid-cols-1 lg:grid-cols-12 pt-8">
//                 <div className="col-span-7">
//                     <Carousel images={images} thumbNails={thumbNails} />
//                 </div>
//                 <div className="col-span-5">
//                     <h1 className="text-3xl font-semibold mb-2">{product.data.name}</h1>

//                     {renderProductVariationTypes()}

//                     <b className="text-xl">About the Item</b>
//                     <div className="ck-content-output" dangerouslySetInnerHTML={{ __html: product.data.description }} />

//                     <div className="mt-4 p-3 bg-gray-100 text-xs">
//                         {/* <pre>{JSON.stringify(selectedOptions, null, 2)}</pre> */}
//                         <pre>{JSON.stringify(selectedSku, null, 2)}</pre>
//                     </div>

//                 </div>

//             </div>

//         </main>
//     )
// }

// Show.layout = (page: React.ReactNode) => (
//     <PageLayout children={page} />
// )

// export default Show

import { ProductDetailBreadcrumb } from "@/components/custom/ProductDetailBreadcrumb";
import Carousel from "@/components/custom/ProductDetailCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageLayout from "@/layouts/app-layout";
import { Product, ProductAttributeValue, Image } from "@/types";
import { useMemo, useState, useEffect } from "react";
import { router, useForm, usePage } from "@inertiajs/react";

function Show({ product }: { product: Product }) {
    const { url } = usePage();

    // ✅ FIX: correct initial type
    const [selectedOptions, setSelectedOptions] = useState<
        Record<number, ProductAttributeValue>
    >({});

    const [previewImages, setPreviewImages] = useState<Image[] | null>(null);

    const form = useForm<{
        sku_id: number | null;
        quantity: number;
        price: number | null;
    }>({
        sku_id: null,
        quantity: 1,
        price: null,
    });

    // ======================================================
    // ✅ AUTO-SELECT FIRST OPTIONS (AMAZON STYLE)
    // ======================================================
    useEffect(() => {
        if (!product?.data?.productAttributes?.length) return;

        setSelectedOptions((prev) => {
            // don't override if already selected
            if (Object.keys(prev).length > 0) return prev;

            const defaults: Record<number, ProductAttributeValue> = {};

            product.data.productAttributes.forEach((attr) => {
                if (attr.options?.length) {
                    defaults[attr.id] = attr.options[0];
                }
            });

            return defaults;
        });
    }, [product]);

    // ======================================================
    const getOptionIdsMap = (newOptions: object) => {
        return Object.fromEntries(
            Object.entries(newOptions).map(([a, b]: any) => [a, b.id])
        );
    };

    // ======================================================
    const chooseOption = (
        typeId: number,
        option: ProductAttributeValue,
        updateRouter: boolean = true
    ) => {
        setPreviewImages(null); // ✅ FIX stuck preview bug

        setSelectedOptions((prevSelectedOptions) => {
            const newOptions = {
                ...prevSelectedOptions,
                [typeId]: option,
            };

            if (updateRouter) {
                router.get(
                    url,
                    {
                        options: getOptionIdsMap(newOptions),
                    },
                    {
                        preserveScroll: true,
                        preserveState: true,
                    }
                );
            }

            return newOptions;
        });
    };

    // ======================================================
    const previewOption = (option: ProductAttributeValue) => {
        if (option.images?.length) {
            setPreviewImages(option.images);
        }
    };

    // ======================================================
    const selectedSku = useMemo(() => {
        const selectedIds = Object.values(selectedOptions)
            .map((op) => op.id)
            .sort();

        for (const sku of product.data.skus) {
            const skuOptionIds = sku.attribute_value_ids?.slice().sort();

            if (
                skuOptionIds &&
                selectedIds.length === skuOptionIds.length &&
                selectedIds.every((id, i) => id === skuOptionIds[i])
            ) {
                return sku;
            }
        }

        return null;
    }, [selectedOptions, product]);

    // ======================================================
    // 🔥 AMAZON-STYLE IMAGE RESOLUTION
    // ======================================================
    const activeOptionImages = useMemo(() => {
        for (const typeId in selectedOptions) {
            const option = selectedOptions[typeId];
            if (option.images?.length) {
                return option.images;
            }
        }
        return null;
    }, [selectedOptions]);

    const images = useMemo(() => {
        // 1️⃣ hover preview wins
        if (previewImages) return previewImages;

        // 2️⃣ selected option images
        if (activeOptionImages) return activeOptionImages;

        // 3️⃣ fallback to product images
        return product.data.images;
    }, [product, previewImages, activeOptionImages]);

    // ✅ thumbnails must match main images source
    const thumbNails = useMemo(() => {
        if (activeOptionImages) return activeOptionImages;
        return product.data.images;
    }, [product, activeOptionImages]);

    // ======================================================
    useEffect(() => {
        form.setData("sku_id", selectedSku?.id ?? null);
    }, [selectedSku]);

    // ======================================================
    const renderProductVariationTypes = () => {
        return product.data.productAttributes.map((attribute) => (
            <div key={attribute.id}>
                <b>{attribute.name}</b>

                {/* ================= IMAGE TYPE ================= */}
                {attribute.type === "Image" && (
                    <div className="flex gap-2 mb-4">
                        {attribute.options.map((option) => {
                            const isActive =
                                selectedOptions[attribute.id]?.id === option.id;

                            return (
                                <div
                                    key={option.id}
                                    onClick={() =>
                                        chooseOption(attribute.id, option)
                                    }
                                    onMouseEnter={() => previewOption(option)}
                                    onMouseLeave={() =>
                                        setPreviewImages(null)
                                    }
                                >
                                    {option?.images && (
                                        <img
                                            src={option.images[0]?.thumb}
                                            alt=""
                                            className={
                                                "w-14.5 cursor-pointer border-2 transition ring-offset-8" +
                                                (isActive
                                                    ? "border-link-color ring-2 ring-link-color"
                                                    : "border-gray-500 hover:border-gray-500")
                                            }
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ================= RADIO TYPE ================= */}
                {attribute.type === "Radio" && (
                    <div className="flex mb-4">
                        {attribute.options.map((option) => {
                            const isChecked =
                                selectedOptions[attribute.id]?.id === option.id;

                            return (
                                <Button
                                    variant={"default"}
                                    key={option.id}
                                    tabIndex={0}
                                    className={`relative rounded-none border
                                    ${
                                        isChecked
                                            ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-500"
                                            : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
                                    }`}
                                >
                                    {option.value}
                                    <Input
                                        onChange={() =>
                                            chooseOption(attribute.id, option)
                                        }
                                        className="absolute opacity-0 h-full w-full"
                                        value={option.id}
                                        type="radio"
                                        checked={isChecked}
                                        name={"variation_type_" + attribute.id}
                                        aria-label={option.value}
                                    />
                                </Button>
                            );
                        })}
                    </div>
                )}
            </div>
        ));
    };

    // ======================================================
    return (
        <main className="container mx-auto p-8">
            <ProductDetailBreadcrumb product={product} />

            <div className="grid gap-8 grid-cols-1 lg:grid-cols-12 pt-8">
                <div className="col-span-7">
                    <Carousel images={images} thumbNails={thumbNails} />
                </div>

                <div className="col-span-5">
                    <h1 className="text-3xl font-semibold mb-2">
                        {product.data.name}
                    </h1>

                    {renderProductVariationTypes()}

                    <b className="text-xl">About the Item</b>
                    <div
                        className="ck-content-output"
                        dangerouslySetInnerHTML={{
                            __html: product.data.description,
                        }}
                    />

                    <div className="mt-4 p-3 bg-gray-100 text-xs">
                        <pre>{JSON.stringify(selectedSku, null, 2)}</pre>
                    </div>
                </div>
            </div>
        </main>
    );
}

Show.layout = (page: React.ReactNode) => (
    <PageLayout children={page} />
);

export default Show;

