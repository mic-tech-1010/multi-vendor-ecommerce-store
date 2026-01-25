import Header from '@/layouts/app/app-header';
import Footer from './app/app-footer';

function PageLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="">
                {children}
            </main>
            <Footer />
        </>
    )
}

export default PageLayout
