import { Head } from '@inertiajs/react';

import PageLayout from '@/layouts/app-layout';
import ImageCarousel from '@/section/home/Carousel';

export default function Home() {

    return (
        <>
            <Head title="Welcome">
                <meta name="description" content="Welcome to our multi-vendor store!" />
            </Head>

            <ImageCarousel />

        </>
    );
}


Home.layout = (page: React.ReactNode) => <PageLayout children={page} />
