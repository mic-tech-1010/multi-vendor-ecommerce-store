import { Head } from '@inertiajs/react';

import PageLayout from '@/layouts/app-layout';
import ImageCarousel from '@/section/home/Carousel';
import { PaginationProps, Section } from '@/types';
import ProductSectionRenderer from '@/components/custom/ProductSectionRenderer';

export default function Home({ sections }: { sections: PaginationProps<Section> }) {

    return (
        <>
            <Head title="Welcome">
                <meta name="description" content="Welcome to our multi-vendor store!" />
            </Head>

            <ImageCarousel />

            <section
            className="mt-8 sm:mt-[-23%] z-20 relative px-0 sm:px-4 overflow-hidden"
            >
                {sections.data.map(section => (
                    <ProductSectionRenderer
                        key={section.id}
                        section={section}
                    />
                ))}
            </section>

        </>
    );
}


Home.layout = (page: React.ReactNode) => <PageLayout children={page} />
