<?php

namespace App\Enum;

enum ProductSectionTypeEnum: string
{
    case Categorised = 'Categorised';
    case Algorithmic = 'Algorithmic';
    case Personalized = 'Personalized';

    public static function labels(): array
    {
        return [
            self::Categorised->value => 'Categorised',
            self::Algorithmic->value => 'Algorithmic',
            self::Personalized->value => 'Personalized',
        ];
    }
}
