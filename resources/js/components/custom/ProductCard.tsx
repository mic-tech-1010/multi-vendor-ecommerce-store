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
        <Card className="bg-white list-none min-h-72 flex flex-col gap-0.5 justify-between mx-auto rounded-none min-[75rem]:max-h-[420px] py-3">
            <CardHeader>
                <CardTitle>
                  <h2 className="font-semibold text-[clamp(1.1rem,0.79rem+1.103vw,1.5rem)] leading-[1.2] text-[#09090b]">{section.title}</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
                {children}
            </CardContent>
            <CardFooter>
                <Link className="text-link-color text-[0.9375rem]" href={'#'}>See More</Link>
            </CardFooter>
        </Card>
    )
}

export default ProductCard
