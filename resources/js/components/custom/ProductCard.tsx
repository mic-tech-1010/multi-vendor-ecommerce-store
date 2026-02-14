import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Section } from "@/types"
import { Link } from "@inertiajs/react"

function ProductCard({ section, children }:
    { section: Section, children?: React.ReactNode }) {

    return (
        <Card
            className="bg-white h-full flex flex-col rounded-none py-3 max-h-max">
            <CardHeader>
                <CardTitle>
                    <h2 className="font-semibold text-[clamp(1.1rem,0.79rem+1.103vw,1.5rem)] leading-[1.2] text-[#09090b]">{section.title}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 grid">
                {children}
            </CardContent>
            <CardFooter>
                <Link className="text-link-color text-sm" href={'#'}>See More</Link>
            </CardFooter>
        </Card>
    )
}

export default ProductCard
