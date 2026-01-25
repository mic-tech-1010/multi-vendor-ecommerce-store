
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { SearchIcon } from "lucide-react";

const categories = [
    { title: "All Departments", value: "search-alias=aps" },
    { title: "Alexa Skills", value: "search-alias=alexa-skills" },
    { title: "Amazon Autos", value: "search-alias=vehicles" },
    { title: "Amazon Devices", value: "search-alias=amazon-devices" },
    { title: "Amazon Fresh", value: "search-alias=amazonfresh" },
    { title: "Amazon Global Store", value: "search-alias=amazon-global-store" },
    { title: "Amazon Haul", value: "search-alias=bazaar" },
    { title: "Amazon One Medical", value: "search-alias=amazon-one-medical" },
    { title: "Amazon Pharmacy", value: "search-alias=amazon-pharmacy" },
    { title: "Amazon Resale", value: "search-alias=warehouse-deals" },
    { title: "Appliances", value: "search-alias=appliances" },
    { title: "Apps & Games", value: "search-alias=mobile-apps" },
    { title: "Arts, Crafts & Sewing", value: "search-alias=arts-crafts" },
    { title: "Audible Books & Originals", value: "search-alias=audible" },
    { title: "Automotive Parts & Accessories", value: "search-alias=automotive" },
    { title: "Baby", value: "search-alias=baby-products" },
    { title: "Beauty & Personal Care", value: "search-alias=beauty" },
    { title: "Books", value: "search-alias=stripbooks" },
    { title: "CDs & Vinyl", value: "search-alias=popular" },
    { title: "Cell Phones & Accessories", value: "search-alias=mobile" },
    { title: "Clothing, Shoes & Jewelry", value: "search-alias=fashion" },
    { title: "Women's Clothing, Shoes & Jewelry", value: "search-alias=fashion-womens" },
    { title: "Men's Clothing, Shoes & Jewelry", value: "search-alias=fashion-mens" },
    { title: "Girl's Clothing, Shoes & Jewelry", value: "search-alias=fashion-girls" },
    { title: "Boy's Clothing, Shoes & Jewelry", value: "search-alias=fashion-boys" },
    { title: "Baby Clothing, Shoes & Jewelry", value: "search-alias=fashion-baby" },
    { title: "Collectibles & Fine Art", value: "search-alias=collectibles" },
    { title: "Computers", value: "search-alias=computers" },
    { title: "Credit and Payment Cards", value: "search-alias=financial" },
    { title: "Digital Music", value: "search-alias=digital-music" },
    { title: "Electronics", value: "search-alias=electronics" },
    { title: "Garden & Outdoor", value: "search-alias=lawngarden" },
    { title: "Gift Cards", value: "search-alias=gift-cards" },
    { title: "Grocery & Gourmet Food", value: "search-alias=grocery" },
    { title: "Handmade", value: "search-alias=handmade" },
    { title: "Health, Household & Baby Care", value: "search-alias=hpc" },
    { title: "Home & Business Services", value: "search-alias=local-services" },
    { title: "Home & Kitchen", value: "search-alias=garden" },
    { title: "Industrial & Scientific", value: "search-alias=industrial" },
    { title: "Just for Prime", value: "search-alias=prime-exclusive" },
    { title: "Kindle Store", value: "search-alias=digital-text" },
    { title: "Luggage & Travel Gear", value: "search-alias=fashion-luggage" },
    { title: "Luxury Stores", value: "search-alias=luxury" },
    { title: "Magazine Subscriptions", value: "search-alias=magazines" },
    { title: "Movies & TV", value: "search-alias=movies-tv" },
    { title: "Musical Instruments", value: "search-alias=mi" },
    { title: "Office Products", value: "search-alias=office-products" },
    { title: "Pet Supplies", value: "search-alias=pets" },
    { title: "Premium Beauty", value: "search-alias=luxury-beauty" },
    { title: "Prime Video", value: "search-alias=instant-video" },
    { title: "Same-Day Store", value: "search-alias=samedaystore" },
    { title: "Smart Home", value: "search-alias=smart-home" },
    { title: "Software", value: "search-alias=software" },
    { title: "Sports & Outdoors", value: "search-alias=sporting" },
    { title: "Subscribe & Save", value: "search-alias=specialty-aps-sns" },
    { title: "Subscription Boxes", value: "search-alias=subscribe-with-amazon" },
    { title: "Tools & Home Improvement", value: "search-alias=tools" },
    { title: "Toys & Games", value: "search-alias=toys-and-games" },
    { title: "Under $10", value: "search-alias=under-ten-dollars" },
    { title: "Video Games", value: "search-alias=videogames" },
    { title: "Whole Foods Market", value: "search-alias=wholefoods" }
];


function SearchTab() {
    return (
        <search className="flex-1 max-tablet:flex-auto max-tablet:order-1 max-tablet:min-w-full max-tablet:px-2.5 max-tablet:pt-2 max-tablet:pb-1.5">
            <form id="search-form" className="flex h-10 w-full rounded-sm" role="search">
                <div className="h-full">
                    <Label htmlFor="search-category" className="sr-only">search category</Label>
                    <Select name="">
                        <SelectTrigger id="search-category" className="bg-[#e6e6e6] text-[#555] p-1.5 max-w-max rounded-tr-none rounded-br-none rounded-l-sm h-full! focus:outline-solid! focus:outline-offset-3! focus:outline-white! focus:outline-1">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(({ value, title }, index) => (
                                <SelectItem key={index} value={value}>{title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Label htmlFor="search-input" className="sr-only">search Amazon</Label>
                <Input type="search" id="search-input" className="outline-none! rounded-none bg-white h-full text-base!"
                    placeholder="Search Amazon" autoComplete="off" role="searchbox" />

                <Button type="submit" aria-label="search" className="text-[#333] focus:outline-solid! focus:outline-offset-1! focus:outline-white! focus:outline-1 cursor-pointer h-full p-2 bg-[hsl(34,88%,62%)] hover:bg-[hsl(34,88%,62%)] rounded-l-none rounded-r-sm">
                    <SearchIcon className="w-6! h-6!"/>
                </Button>
            </form>
        </search>
    )
}

export default SearchTab




