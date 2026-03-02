import { ProductDetailBreadcrumb } from "@/components/custom/ProductDetailBreadcrumb";
import Carousel from "@/components/custom/ProductDetailCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageLayout from "@/layouts/app-layout";
import { Product, ProductAttributeValue, Image } from "@/types";
import { useMemo, useState, useEffect } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import CurrencyFormatter from "@/components/app/currency-formatter";
import { Select } from "@/components/ui/select";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { ChevronDownIcon } from "lucide-react";
import CartController from "@/actions/App/Http/Controllers/CartController";

function Show({ product }: { product: Product }) {

    const { url } = usePage();

    const [selectedOptions, setSelectedOptions] = useState<
        Record<number, ProductAttributeValue>
    >({});

    const [previewImages, setPreviewImages] = useState<Image[] | null>(null);

    const form = useForm<{
        sku_id: number | null;
        quantity: number;
    }>({
        sku_id: null,
        quantity: 1,
    });

    // ======================================================
    // AUTO-SELECT FIRST OPTIONS
    // ======================================================
    useEffect(() => {
        if (!product?.productAttributes?.length) return;

        setSelectedOptions((prev) => {
            // don't override if already selected
            if (Object.keys(prev).length > 0) return prev;

            const defaults: Record<number, ProductAttributeValue> = {};

            product.productAttributes.forEach((attr) => {
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
        setPreviewImages(null); //FIX stuck preview bug

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
    const selectedSku = useMemo(() => {
        const selectedIds = Object.values(selectedOptions)
            .map((op) => op.id)
            .sort();

        for (const sku of product.skus) {
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
    const previewOption = (option: ProductAttributeValue) => {
        if (option.images?.length) {
            setPreviewImages(option.images);
        }
    };

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

        if (previewImages) return previewImages;

        if (activeOptionImages) return activeOptionImages;

        return product.images;

    }, [product, previewImages, activeOptionImages]);

    // thumbnails must match main images source
    const thumbNails = useMemo(() => {
        if (activeOptionImages) return activeOptionImages;
        return product.images;
    }, [product, activeOptionImages]);

    const currency = useMemo(() => {
        if (selectedSku) {
            return CurrencyFormatter(selectedSku.price);
        }
        return CurrencyFormatter(product.price);
    }, [selectedSku, product]);


    // ======================================================
    useEffect(() => {
        form.setData("sku_id", selectedSku?.id ?? null);
    }, [selectedSku]);

    // ======================================================
    const renderProductVariationTypes = () => {
        return product.productAttributes.map((attribute) => (
            <div key={attribute.id}>
                <b>{attribute.name}</b>

                {/* ================= IMAGE TYPE ================= */}
                {attribute.type === "Image" && (
                    <div className="flex flex-wrap gap-2 mb-4">
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
                                    ${isChecked
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

    const onQuantityChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
        form.setData('quantity', parseInt(ev.target.value))
    }

    const addToCart = () => {
        form.post(CartController.store(product.id).url, {
            preserveScroll: true,
            preserveState: true,
            onError: (err) => {
                console.log(err)
            }
        })
    }

    const computedProductQuantity = selectedSku ? selectedSku?.quantity : product.quantity;

    // ======================================================
    const renderAddToCartButton = () => {
        return (<div className="space-y-4 w-full">
            <NativeSelect value={form.data.quantity}
                onChange={onQuantityChange}
                className="w-full border rounded-md border-black">
                {Array.from({
                    length: Math.min(10, computedProductQuantity),
                }).map((el, i) => (
                    <NativeSelectOption value={i + 1} key={i}>Quantity: {i + 1} </NativeSelectOption>
                ))}
            </NativeSelect>
            <Button onClick={addToCart} className="w-full bg-[#ffd814] hover:bg-[#ffd814] text-black rounded-full">Add to Cart</Button>
            <Button onClick={() => console.log("Buy Now clicked")} className="w-full bg-[#ffa41c] hover:bg-[#ffa41c] text-black rounded-full">Buy Now</Button>
        </div>

        )
    }

    // ======================================================
    return (
        <main className="container mx-auto px-0 py-6">
            <ProductDetailBreadcrumb product={product} />

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 pt-8">
                <div className="col-span-6">
                    <Carousel images={images} thumbNails={thumbNails} />
                </div>

                <div className="col-span-4">
                    <h1 className="text-3xl font-semibold mb-2">
                        {product.name}
                    </h1>

                    {product.productAttributes.length ? renderProductVariationTypes() : null}

                    <b className="text-xl">About the Item</b>
                    <div
                        className="ck-content-output"
                        dangerouslySetInnerHTML={{
                            __html: product.description,
                        }}
                    />

                </div>

                <div className="col-span-2">
                    <Card className="w-full max-w-sm pt-0 pb-4">
                        <CardHeader>
                            <CardTitle className="sr-only">Product price Detail</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 px-4">
                            <p className="flex gap-0.5 items-start">
                                <span className="text-xs mt-1">{currency.currencySymbol}</span>
                                <b className="text-xl"> {currency.numericalValue}</b>
                            </p>

                              <p className="text-sm text-gray-400">
                                {currency.currencySymbol} {currency.numericalValue} Shipping & Import Fees
                            </p>

                            <p className="text-sm text-gray-400">
                                Deposit To Nigeria
                                <span className="text-blue-400 pl-1 flex items-start gap-px">
                                    <span>Details</span>
                                    <ChevronDownIcon />
                                </span>
                            </p>

                            <p className="text-green-500 text-base">
                                {computedProductQuantity === 0 ?
                                    'Out of Stock' : 'In Stock'
                                }
                            </p>

                            {renderAddToCartButton()}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}

Show.layout = (page: React.ReactNode) => (
    <PageLayout children={page} />
);

export default Show;

