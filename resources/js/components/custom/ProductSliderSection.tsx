import { Section } from "@/types";
import ProductCard from "./ProductCard";

export default function ProductSliderSection({ section }: { section: Section }) {
    return (
        <section className="w-full">
            <h2 className="text-xl font-semibold mb-4">
                {section.title}
            </h2>

            <div className="overflow-x-auto flex gap-4">

            </div>
        </section>
    );
}
