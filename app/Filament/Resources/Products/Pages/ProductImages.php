<?php

namespace App\Filament\Resources\Products\Pages;

use Filament\Resources\Pages\EditRecord;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Schemas\Schema;
use App\Filament\Resources\Products\ProductResource;
use Filament\Support\Icons\Heroicon;
use BackedEnum;

class ProductImages extends EditRecord
{
    protected static string $resource = ProductResource::class;

    protected static ?string $title = 'Images';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Photo;

    protected static ?string $navigationLabel = 'Product Images';

    public function form(Schema $schema): Schema
    {
        return  $schema
            ->components([
                SpatieMediaLibraryFileUpload::make('images')
                    ->label('')
                    ->image()
                    ->multiple()
                    ->openable()
                    ->panelLayout('grid')
                    ->collection('images')
                    ->reorderable()
                    ->appendFiles()
                    ->preserveFilenames()
                    ->columnSpan(2)
            ]);
    }
    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
