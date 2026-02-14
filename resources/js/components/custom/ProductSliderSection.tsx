import { Product, Section } from "@/types";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Link } from "@inertiajs/react";


function ProductSlider({ section }: { section: Section }) {
    return (
        <div className="overflow-hidden my-6 bg-white mx-0 sm:mx-4 font-semibold">
            <h2 className="mt-6.5 ml-6.5 text-[clamp(1.1rem,0.79rem+1.103vw,1.5rem)] leading-[1.2] text-[#09090b]">{section.title}</h2>
            <Carousel
                opts={{
                    align: "start",
                }}
                className="overflow-hidden w-full p-6.5"
            >
                <ul>
                    <CarouselContent className="">

                        {section.products.map((product) => (
                            <CarouselItem key={product.id} className="basis-1/3 md:basis-1/4 lg:basis-1/6 aspect-square max-h-35 sm:max-h-48 h-full">
                                <li className="p-1 aspect-square h-full">
                                    <Link href={''} className="flex h-full">
                                        <img src={product.image} alt={product.slug} className="object-contain max-h-full w-full"/>
                                    </Link>
                                </li>
                            </CarouselItem>
                        ))}

                    </CarouselContent>

                </ul>
                <CarouselPrevious className="left-0 hover:bg-transparent cursor-pointer z-30 rounded-[0_3px_3px_0] size:10 sm:size-13" variant="ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" height="75" strokeWidth="1" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                        className="w-14 sm:w-16">
                        <path d="M15 6l-6 6l6 6" strokeWidth="2" stroke="black" />

                    </svg>
                </CarouselPrevious>
                <CarouselNext className="right-0 hover:bg-transparent cursor-pointer z-30 rounded-[3px_0_0_3px] text-black size:10 sm:size-13" variant="ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="w-14 sm:w-16" height="75"
                        strokeWidth="1">
                        <path d="M10 6l6 6l-6 6" strokeWidth="2"></path>
                    </svg>
                </CarouselNext>
            </Carousel>
        </div>
    )
}

export default ProductSlider

