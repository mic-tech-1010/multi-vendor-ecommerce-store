import React, { useState, useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { EmblaOptionsType } from "embla-carousel"
import { Image } from "@/types"

type CarouselPropType = {
    images: Image[]
    thumbNails: Image[]
    options?: EmblaOptionsType
}

type ThumbPropType = {
    selected: boolean
    image: Image
    onClick: () => void
    onHover: () => void
}

const OPTIONS: EmblaOptionsType = {
    containScroll: "trimSnaps",
}

const Carousel: React.FC<CarouselPropType> = ({ images, thumbNails }) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const [emblaMainRef, emblaMainApi] = useEmblaCarousel(OPTIONS)

    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        axis: "y",
        dragFree: true,
        containScroll: "keepSnaps",
    })

    const onThumbClick = useCallback(
        (index: number) => {
            emblaMainApi?.scrollTo(index)
        },
        [emblaMainApi]
    )

    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return

        const index = emblaMainApi.selectedScrollSnap()
        setSelectedIndex(index)
        emblaThumbsApi.scrollTo(index)
    }, [emblaMainApi, emblaThumbsApi])

    useEffect(() => {
        if (!emblaMainApi) return

        onSelect()
        emblaMainApi.on("select", onSelect)
        emblaMainApi.on("reInit", onSelect)
    }, [emblaMainApi, onSelect])

    return (
        <div className="flex max-w-4xl h-112.5 gap-0.25">
            {/* Thumbnails */}
            <div className="w-20 overflow-hidden" ref={emblaThumbsRef}>
                <div className="flex flex-col gap-3 h-full">
                    {thumbNails.map((image, index) => (
                        <Thumb
                            key={index}
                            image={image}
                            selected={index === selectedIndex}
                            onClick={() => onThumbClick(index)}
                            onHover={() => onThumbClick(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Main Carousel */}
            <div className="flex-1 overflow-hidden rounded-none bg-white" ref={emblaMainRef}>
                <div className="flex h-full">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="flex-[0_0_100%] h-full flex items-center justify-center"
                        >
                            <img
                                src={image.large}
                                alt=""
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const Thumb: React.FC<ThumbPropType> = ({
    selected,
    image,
    onClick,
    onHover,
}) => {
    return (
        <button
            onMouseEnter={onHover}
            onClick={onClick}
            className={`
        cursor-pointer w-12 h-12 overflow-hidden rounded-xl border transition
        ${selected ? "border-black" : "border-gray-300 opacity-60"}
      `}
        >
            <img
                src={image.thumb}
                alt=""
                className="w-full h-full object-cover"
            />
        </button>
    )
}

export default Carousel
