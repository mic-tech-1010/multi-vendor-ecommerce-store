import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function ShopCategoryCard({ title, link, linkHref, children }:
    { title: string; link: string; linkHref: string, children: React.ReactNode }) {
    return (
        <Card className="bg-white list-none min-h-72 flex flex-col gap-0.5 justify-between mx-auto rounded-none min-[75rem]:max-h-[420px] py-3">
            <CardHeader>
                <CardTitle>
                  <h2 className="font-semibold text-[clamp(1.1rem,0.79rem+1.103vw,1.5rem)] leading-[1.2] text-[#09090b]">{title}</h2> 
                </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
                {children}
            </CardContent>
            <CardFooter>
                <a className="text-link-color text-[0.9375rem]" href={linkHref}>{link}</a>
            </CardFooter>
        </Card>
    )
}

export default ShopCategoryCard