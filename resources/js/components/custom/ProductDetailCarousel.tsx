import React, { useState, useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { EmblaOptionsType } from "embla-carousel"
import { Image } from "@/types"


type CarouselPropType = {
  images: Image[]
  options?: EmblaOptionsType
}

type ThumbPropType = {
  selected: boolean
  image: Image
  onClick: () => void
}

const OPTIONS: EmblaOptionsType = {}

const Carousel: React.FC<CarouselPropType> = ({ images }) => {
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
    emblaMainApi.on("select", onSelect).on("reInit", onSelect)
  }, [emblaMainApi, onSelect])

  return (
    <div className="flex max-w-4xl gap-4 items-stretch">
      {/* Thumbnails */}
      <div className="w-24 overflow-hidden" ref={emblaThumbsRef}>
        <div className="grid h-full">
          {images.map((image, index) => (
            <Thumb
              key={index}
              image={image}
              selected={index === selectedIndex}
              onClick={() => onThumbClick(index)}
            />
          ))}
        </div>
      </div>

      {/* Main carousel */}
      <div className="flex-1 overflow-hidden" ref={emblaMainRef}>
        <div className="flex -ml-4">
          {images.map((image: Image, index: number) => (
            <div key={index} className="flex-[0_0_100%] pl-4">
              <div className="flex h-80 items-center justify-center rounded-xl border text-4xl font-semibold">
                <img src={image.large} className="" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const Thumb: React.FC<ThumbPropType> = ({ selected, image, onClick }) => {
  return (
    <div className="pt-3 w-[50px]">
      <button
        onClick={onClick}
        className={`
          flex w-full items-center justify-center rounded-lg border text-lg font-medium
          transition
          ${selected ? "border-black" : "border-gray-300 opacity-60"}
        `}
      >
        <img src={image.thumb} alt="" />
      </button>
    </div>
  )
}

export default Carousel
