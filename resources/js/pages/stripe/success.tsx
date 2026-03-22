import { Head, Link } from "@inertiajs/react";
import CurrencyFormatter from "@/components/app/currency-formatter";
import { CheckCheckIcon } from "lucide-react";
import { SharedData, Order } from "@/types";
import PageLayout from "@/layouts/app-layout";
import { home } from "@/routes";

function Success({orders}: SharedData<{ orders: Order[] }>) {
  return (
    <>

      <Head>
        <title>Payment Completed</title>
      </Head>

      <main className="w-[480px] mx-auto py-8 px-4">
          <div className="flex flex-col gap-2 items-center">
            <div className="text-6xl text-emerald-600">
              <CheckCheckIcon size={24}/>
            </div>
            <div className="tex-3xl">
              Payment was Completed
            </div>
          </div>
          <div className="my-6 text-lg">
            Thanks for your purchase. Your payment was completed successfully
          </div>
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4">
             <h3 className="text-3xl mb-3">Order Summary</h3>
             <div className="flex justify-between mb-2 font-bold">
              <div className="text-gray-400">
                Seller
              </div>
               <div>
                <Link  className=" hover:underline">
                  {order.vendorUser.store_name}
                </Link>
               </div>
             </div>
             <div className="flex justify-between mb-2">
              <div className="text-gray-400">
                Order Number
                </div>
                <div>
                    <Link className="hover:underline">#{order.id}</Link>
                </div>
             </div>
             <div className="flex justify-between mb-3">
              <div className="text-gray-400">
                Items
              </div>
              <div>
                {order.orderItems.length}
              </div>
             </div>
             <div className="flex justify-between mb-3">
              <div className="text-gray-400">
                Total
              </div>
              <div>
                {CurrencyFormatter(order.total_price).formatted}
              </div>
             </div>
             <div className="flex justify-between mt-4">
              <Link>
               View Order Details
              </Link>
              <Link href={home()}>
                 Back to Home
              </Link>
             </div>

            </div>
          ))}
      </main>
    </>
  )
}

export default Success

Success.layout = (page: React.ReactNode) => <PageLayout children={page} />
