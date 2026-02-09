<?php

namespace App\Filament\Resources\ProductSections\Schemas;

use App\Enum\ProductSectionLayoutEnum;
use App\Enum\ProductSectionTypeEnum;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ProductSectionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(function (string $operation, $state, callable $set) {
                        $set('slug', Str::slug($state));
                    }),
                TextInput::make('slug')
                    ->required()
                    ->maxLength(255),
                Select::make('layout')
                    ->required()
                    ->options(ProductSectionLayoutEnum::labels()),
                Select::make('type')
                    ->required()
                    ->options(ProductSectionTypeEnum::labels()),
                // Select::make('products')
                //     ->multiple()
                //     ->relationship(
                //         name: 'products',
                //         titleAttribute: 'title'
                //     )
                //     ->preload()
                //     ->searchable(),
                Checkbox::make('active'),
                TextInput::make('sort_order')
                    ->numeric()
                    ->default(0),
            ]);
    }
}
