import { GroupedCartItem, SharedData } from "@/types";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { CreditCardIcon } from "lucide-react";
import CurrencyFormatter from "@/components/app/currency-formatter";
import CartItem from "@/components/custom/CartItem";
import PageLayout from "@/layouts/app-layout";
import CheckOutController from "@/actions/App/Http/Controllers/CheckOutController";

function Index({
    csrf_token,
    cartItems,
    totalQuantity,
    totalPrice
}: SharedData<{ cartItems: Record<number, GroupedCartItem> }>) {
    return (
        <main className="mx-auto p-8 flex flex-col lg:flex-row gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Shopping Cart</CardTitle>
                </CardHeader>
                <CardContent>
                    {Object.keys(cartItems).length === 0 && (
                        <div className="py-2 text-gray-500 text-center">
                            You don't have any Items in the cart yet.
                        </div>
                    )}
                    {Object.values(cartItems).map(cartItem => (
                        <div key={cartItem.user.id}>
                            <div className="flex items-center justify-between pb-4
                               border-b border-gray-300 mb-4">
                                <Link href={'#'} className="underline">
                                    {cartItem.user.name}
                                </Link>
                                <div>
                                    <form action={CheckOutController.checkout().url} method="post">
                                        <input type="hidden" name="_token" value={csrf_token} />
                                        <input type="hidden" name="vendor_id" value={cartItem.user.id} />
                                        <Button variant={"ghost"}>
                                            <CreditCardIcon />
                                            Pay only for this seller
                                        </Button>
                                    </form>
                                </div>
                            </div>
                            {cartItem.items.map(item => (
                                <CartItem item={item} key={item.id} />
                            ))}
                        </div>
                    ))
                    }
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    Subtotal ({totalQuantity} items): &nbsp;
                    {CurrencyFormatter(totalPrice).formatted}
                    <form action={CheckOutController.checkout().url} method="post">
                        <input type="hidden" name="_token" value={csrf_token} />
                        <Button variant={"default"}>
                            <CreditCardIcon />
                            Proceed to checkout
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}

Index.layout = (page: React.ReactNode) => (
    <PageLayout children={page} />
);

export default Index
