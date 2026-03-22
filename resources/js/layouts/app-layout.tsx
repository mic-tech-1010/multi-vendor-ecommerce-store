import Header from '@/layouts/app/app-header';
import Footer from './app/app-footer';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { SharedData } from '@/types';

function PageLayout({ children }: { children: React.ReactNode }) {

    const props = usePage<SharedData>().props;
    const [successMessages, setSuccessMessages] = useState<any[]>([]);

    const timeoutRefs = useRef<{ [key: number]: ReturnType<typeof setTimeout> }>({})

    useEffect(() => {
        if (props.success.message) {

            const newMessage = {
                ...props.success,
                id: props.success.time,
            }

            setSuccessMessages((prevMessages: any[]) => [newMessage, ...prevMessages]);

            //set a timeout to remove the message after 5 seconds
            const timeoutId = setTimeout(() => {
                setSuccessMessages((prevMessages: any[]) =>
                    prevMessages.filter((message) => message.id !== newMessage.id)
                );

                //clear timeout reference
                delete timeoutRefs.current[newMessage.id];

            }, 5000);
        }

    }, [props.success])

    return (
        <>
            <Header />
            {successMessages.length > 0 && (
                <div className="fixed top-4 right-4 z-50">
                    {successMessages.map((message) => (
                        <div key={message.id} className="bg-green-500 text-white p-4 rounded-md shadow-lg">
                            {message.message}
                        </div>
                    ))}
                </div>
            )}
            <main className="bg-[#e3e6e6]">
                {children}
            </main>
            <Footer />
        </>
    )
}

export default PageLayout
