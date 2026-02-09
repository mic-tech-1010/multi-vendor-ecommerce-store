<?php

namespace App\Enum;

enum ProductSectionLayoutEnum: string
{
    case GRID = 'grid';
    case Slider = 'slider';

    public static function labels(): array
    {
        return [
            self::GRID->value => 'Grid',
            self::Slider->value => 'Slider',
        ];
    }

}
