<?php

namespace App\Http\Controllers;

use App\Enum\OrderStatusEnum;
use App\Http\Resources\OrderViewResource;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Stripe\Checkout\Session;
use Stripe\Stripe;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class CheckOutController extends Controller
{

    public function __construct()
    {
        Stripe::setApiKey(config('app.stripe_secret_key'));
    }

    public function checkout(Request $request, CartService $cartService)
    {

        $vendorId = $request->input('vendor_id');

        $allCartItems = $cartService->getCartItemsGrouped();

        DB::beginTransaction();

        try {

            $checkOutCartItems = $allCartItems;

            if ($vendorId) {
                $checkOutCartItems = [$allCartItems[$vendorId]];
            }

            $orders = [];
            $lineItems = [];

            foreach ($checkOutCartItems as $item) {

                $user = $item['user'];
                $cartItems = $item['items'];

                $order = Order::create([
                    'stripe_session_id' => null,
                    'user_id' => $request->user()->id,
                    'vendor_user_id' => $user['id'],
                    'total_price' => $item['totalPrice'],
                    'status' => OrderStatusEnum::Draft->value
                ]);

                $orders[] = $order;

                foreach ($cartItems as $cartItem) {

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $cartItem['product_id'],
                        'quantity' => $cartItem['quantity'],
                        'price' => $cartItem['price'],
                        'product_sku_id' => $cartItem['product_sku_id'],
                    ]);

                    $description = collect($cartItem['options'])->map(function ($item) {
                        return "{$item['type']['name']}: {$item['value']}";
                    })->implode(', ');

                    $lineItem = [
                        'price_data' => [
                            'currency' => strtolower(config('app.currency', 'USD')),
                            'product_data' => [
                                'name' => $cartItem['title'],
                                'images' => [$cartItem['image']],
                            ],
                            'unit_amount' => $cartItem['price'] * 100,
                        ],
                        'quantity' => $cartItem['quantity'],
                    ];
                    if ($description) {
                        $lineItem['price_data']['product_data']['description'] = $description;
                    }
                    $lineItems[] = $lineItem;
                }
            }

            $session = Session::create([
                'customer_email' => $request->user()->email,
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => route('stripe.success', []) . "?session_id={CHECKOUT_SESSION_ID}",
                'cancel_url' => route('stripe.failure', [])
            ]);

            foreach ($orders as $order) {
                $order->stripe_session_id = $session->id;
                $order->save();
            }

            DB::commit();
            return redirect($session->url);
        } catch (\Exception $e) {
            Log::error($e);
            DB::rollBack();
            return back()->with('error', $e->getMessage() ?: 'Something went wrong');
        }
    }

    public function success()
    {
        $user = Auth::user();
        $session_id = request()->get('session_id');
        $orders = Order::where('stripe_session_id', $session_id)
            ->get();

        if ($orders->count() === 0) {
            abort(404);
        }

        foreach ($orders as $order) {
            if ($order->user_id !== $user->id) {
                abort(403);
            }
        }

        return Inertia::render('stripe/success', [
            'orders' => OrderViewResource::collection($orders)->collection->toArray(),
        ]);
    }

    public function failure() {}

    public function webhook(Request $request)
    {
        // Handle Stripe webhook events here
        $stripe = new \Stripe\StripeClient(config('app.stripe_secret_key'));

        $endpoint_secret = config('app.stripe_webhook_secret');

        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $event = null;

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sig_header,
                $endpoint_secret
            );
        } catch (\UnexpectedValueException $e) {
            Log::error($e);
            // Invalid payload
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            Log::error($e);
            // Invalid signature
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        //Handle the event
        switch ($event->type) {
            case 'charge.updated':
                $charge = $event->data->object; // contains a \Stripe\Charge
                $transactionId = $charge['balance_transaction'];
                $paymentIntent = $charge['payment_intent'];
                $balanceTransaction = $stripe->balanceTransactions->retrieve($transactionId);

                $orders = Order::where('payment_intent', $paymentIntent)->get();

                $totalAmount = $balanceTransaction['amount'];
                $stripeFee = 0;
                foreach ($balanceTransaction['fee_details'] as $feeDetail) {
                    if ($feeDetail['type'] === 'stripe_fee') {
                        $stripeFee = $feeDetail['amount'];
                    }
                }
                $platformFeePercent = config('app.platform_fee_pct');

                foreach ($orders as $order) {
                    $vendorShare = $order->total_price / $totalAmount;

                    $order->online_payment_comission = $vendorShare * $stripeFee;
                    $order->website_comission = ($order->total_price - $order->online_payment_comission) / 100 * $platformFeePercent;
                    $order->vendor_subtotal = $order->total_price - $order->online_payment_comission - $order->website_comission;

                    $order->save();

                    // send email to vendor user

                    Mail::to($order->vendorUser->email)->send(new NewOrderMail($order));
                }

                //send email to buyer

                Mail::to($orders[0]->user)->send(new CheckoutCompleted($orders));

            case 'checkout.session.completed':
                $session = $event->data->object; // contains a \Stripe\Checkout\Session
                $pi = $session['payment_intent'];

                $orders = Order::query()
                    ->with(['orderItems'])
                    ->where(['stripe_session_id' => $session['id']])
                    ->get();

                $productsToBeDeltedFromCart = [];
                foreach ($orders as $order) {
                    $order->payment_intent = $pi;
                    $order->status = OrderStatusEnum::Paid;
                    $order->save();

                    $productsToBeDeltedFromCart =
                        [
                            ...$productsToBeDeltedFromCart,
                            ...$order->orderItems->map(fn($item) => $item->product_id)->toArray()
                        ];

                    foreach ($order->orderItems as $orderItem) {
                        // Reduce product stock logic here
                        $options = $orderItem->variation_type_option_ids;
                        $product = $orderItem->product;

                        if ($options) {
                            sort($options);
                            $variation = $product->variations()
                                ->where('variation_type_option_ids', $options)
                                ->first();

                            if ($variation && $variation->quantity != null) {
                                $variation->quantity -= $orderItem->quantity;
                                $variation->save();
                            } else if ($product->quantity != null) {
                                $product->quantity -= $orderItem->quantity;
                                $product->save();
                            }
                        }
                    }
                }
                CartItem::query()
                    ->where('user_id', $order->user_id)
                    ->whereIn('product_id', $productsToBeDeltedFromCart)
                    ->where('saved_for_later', false)
                    ->delete();

            default:
                echo 'Received unknown event type ' . $event->type;
        }
        return response('', 200);
    }
}
