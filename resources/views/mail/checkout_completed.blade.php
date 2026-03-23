<x-mail::message><h1>Payment was Completed Successfully</h1>

@foreach ($orders as $order)
<x-mail::table>
<table>
<tbody>
        <tr>
                <td>Seller</td>
                        <td>
                            <a href="{{ url('/') }}">
                                {{ $order->vendorUser->vendor->store_name }}
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td>Order # </td>
                        <td>{{ $order->id }}</td>
                    </tr>
                    <tr>
                        <td>Items</td>
                        <td>{{ $order->orderItems->count() }}</td>
                    </tr>
                    <tr>
                        <td>Total</td>
                        <td>{{ \Illuminate\Support\Number::currency($order->total_price) }}</td>
                    </tr>
</tbody>
</table>

</x-mail::table>

<x-mail::table>
<table>
<thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
</thead>
<tbody>
@foreach ($order->orderItems as $orderItem)
<tr>
<td>
<table>
<tbody>
<tr>
<td padding="5" style="padding-right: 5px;">
                                                <img src="{{ $orderItem->product->getFirstMediaUrl('product_images', 'thumb') }}"
                                                    alt="{{ $orderItem->product->name }}" width="50">
</td>
<td>
                                                {{ $orderItem->product->name }}
</td>
</tr>
</tbody>
</table>
</td>
<td>
                                {{ $orderItem->quantity }}
</td>
<td>
                                ${{ \Illuminate\Support\Number::currency($orderItem->price) }}
</td>
</tr>
@endforeach
</tbody>
</table>
</x-mail::table>

<x-mail::button :url="$order->id">
            View Order Details
</x-mail::button>
    @endforeach
<x-mail::subCopy>
        If you have any questions, feel free to reply to this email or contact our support team.
</x-mail::subCopy>

<x-mail::panel>
        Thank you for your purchase!
</x-mail::panel>

    Thanks,
    {{ config('app.name') }}

</x-mail::message>
