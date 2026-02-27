import { Head } from '@inertiajs/react';
import PageLayout from '@/layouts/app-layout';
import ImageCarousel from '@/section/home/Carousel';
import { Section } from '@/types';
import ProductSectionRenderer from '@/components/custom/ProductSectionRenderer';

function isGrid(layout: string) {
    return [
        'two-by-two-grid',
        'three-by-one-grid',
        'single-grid',
    ].includes(layout);
}

function GridGroup({ sections }: { sections: Section[] }) {
    return (
        <div
            className="
                mb-8
                flex gap-4 overflow-x-auto px-4
                md:grid md:grid-cols-2 md:gap-6 md:px-0
                lg:grid-cols-4 md:items-stretch
            "
        >
            {sections.map(section => (
                <div
                    key={section.id}
                    className="min-w-[80%] md:min-w-0"
                >
                    <ProductSectionRenderer section={section} />
                </div>
            ))}
        </div>
    );
}

export default function Home({
    sections,
}: {
    sections: Section[];
}) {
    const renderedSections: React.ReactNode[] = [];
    let gridGroup: Section[] = [];

    sections.forEach((section, index) => {
        if (isGrid(section.layout)) {
            gridGroup.push(section);
        } else {
            // flush grouped grids
            if (gridGroup.length > 0) {
                renderedSections.push(
                    <GridGroup
                        key={`grid-group-${index}`}
                        sections={gridGroup}
                    />
                );
                gridGroup = [];
            }

            // render non-grid (slider etc.)
            renderedSections.push(
                <div key={section.id} className="mb-8">
                    <ProductSectionRenderer section={section} />
                </div>
            );
        }
    });

    // flush remaining grids
    if (gridGroup.length > 0) {
        renderedSections.push(
            <GridGroup
                key="grid-group-last"
                sections={gridGroup}
            />
        );
    }

    return (
        <>
            <Head title="Welcome">
                <meta
                    name="description"
                    content="Welcome to our multi-vendor store!"
                />
            </Head>

            <ImageCarousel />

            <section className="mt-8 sm:mt-[-23%] z-20 relative overflow-hidden p-4">
                {renderedSections}
            </section>
        </>
    );
}

Home.layout = (page: React.ReactNode) => (
    <PageLayout children={page} />
);
