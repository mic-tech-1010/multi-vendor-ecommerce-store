<?php

namespace App\Enum;

enum ProductSectionLayoutEnum: string
{
    case SINGLEGRID = 'single-grid';
    case TWOBYTWOGRID = 'two-by-two-grid';
    case THREEBYONE = 'three-by-one-grid';
    case Slider = 'slider';

    public static function labels(): array
    {
        return [
            self::SINGLEGRID->value => 'single-grid',
            self::Slider->value => 'slider',
            self::TWOBYTWOGRID->value => 'two-by-two-grid',
            self::THREEBYONE->value => 'three-by-one-grid',
        ];
    }
}
