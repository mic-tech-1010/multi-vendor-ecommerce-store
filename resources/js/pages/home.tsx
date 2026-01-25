import { Head } from '@inertiajs/react';

import PageLayout from '@/layouts/app-layout';

export default function Home() {

    return (
        <>
            <Head title="Welcome">
                <meta name="description" content="Welcome to our multi-vendor store!" />
            </Head>

            <h1>This is the home page</h1>

        </>
    );
}


Home.layout = (page: React.ReactNode) => <PageLayout children={page} />
