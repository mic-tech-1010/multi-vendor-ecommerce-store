<?php

namespace App\Filament\Resources\Departments\Schemas;

use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class DepartmentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                 TextInput::make('name')
                    ->label('Department Name')
                    ->live(onBlur: true)
                    ->required()
                    ->maxLength(255)
                    ->afterStateUpdated(function (string $operation, $state, callable $set) {
                        $set('slug', Str::slug($state));
                    }),
                TextInput::make('slug')
                    ->required()
                    ->maxLength(255),
                TextInput::make('meta_title'),
                TextInput::make('meta_description'),
                Checkbox::make('active')
            ]);
    }
}
