<?php

namespace App\Enum;

enum OrderStatusEnum: string
{
    case Draft = 'draft';
    case Paid = 'paid';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Draft->value => __('Draft'),
            self::Paid->value => __('Paid'),
            self::Shipped->value => __('Shipped'),
            self::Delivered->value => __('Delivered'),
            self::Cancelled->value => __('Cancelled'),
        };
    }
}
