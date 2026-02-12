<?php

namespace App\Enum;

enum ProductSectionLayoutEnum: string
{
    case SINGLEGRID = 'Single Product Grid';
    case TWOBYTWOGRID = 'Two By Two Grid';
    case THREEBYONE = 'Three By One Grid';
    case Slider = 'Slider';

    public static function labels(): array
    {
        return [
            self::SINGLEGRID->value => 'Single Grid',
            self::Slider->value => 'Slider',
            self::TWOBYTWOGRID->value => 'Two By Two Grid',
            self::THREEBYONE->value => 'Three By One Grid',
        ];
    }
}
