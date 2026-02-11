import CustomChevronLeft from "@/components/app/chevron-left"
import CustomChevronRight from "@/components/app/chevron-right"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import Autoplay from "embla-carousel-autoplay"

const carouselImages = [
    { src: "images/header1.jpg", alt: "" },
    { src: "images/header2.jpg", alt: "" },
    { src: "images/header3.jpg", alt: "" },
    { src: "images/header4.jpg", alt: "" },
    { src: "images/header5.jpg", alt: "" },
    { src: "images/header6.jpg", alt: "" },
]

function ImageCarousel() {
    return (
        <Carousel
            opts={{
                loop: true,
            }}
            plugins={[
                Autoplay({
                    delay: 4000,
                    stopOnLastSnap: true,
                    stopOnFocusIn: true
                }),
            ]}
            className="w-full max-w-screen overflow-hidden"
        >
            <CarouselContent className="w-screen">
                {carouselImages.map(({ src, alt }, index) => (
                    <CarouselItem key={index}>
                        <div className="w-full">
                            <a href="">
                                <img src={src} alt={alt} className="w-full mask-[linear-gradient(to_bottom,#000_50%,transparent_100%)]" />
                            </a>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 top-[20%] hover:bg-transparent cursor-pointer" variant="ghost">
               <CustomChevronLeft />
            </CarouselPrevious>
            <CarouselNext className="right-0 top-[20%] hover:bg-transparent cursor-pointer" variant="ghost">
               <CustomChevronRight />
            </CarouselNext>
        </Carousel>
    )
}

export default ImageCarousel
