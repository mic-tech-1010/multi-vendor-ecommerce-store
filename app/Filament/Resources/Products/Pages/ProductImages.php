<?php

namespace App\Filament\Resources\Products\Pages;

use Filament\Resources\Pages\EditRecord;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Schemas\Schema;
use App\Filament\Resources\Products\ProductResource;
use Filament\Support\Icons\Heroicon;
use BackedEnum;
use Filament\Notifications\Notification;
use Filament\Actions\Action;

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
                Action::make('toggleVariations')
                ->label(
                    fn() =>
                    $this->record->has_variations
                        ? 'Disable Variations'
                        : 'Enable Variations'
                )
                ->icon('heroicon-o-adjustments-horizontal')
                ->color(
                    fn() =>
                    $this->record->has_variations ? 'primary' : 'success'
                )
                ->requiresConfirmation()
                ->action(function () {
                    $product = $this->record;

                    if ($product->has_variations) {
                        // Turning OFF variations
                        $product->update(['has_variations' => false]);

                        // Optional cleanup (recommended)
                        $product->skus()->delete();
                        $product->productAttributes()->delete();

                        Notification::make()
                            ->title('Variations disabled')
                            ->body('Product is now a simple product.')
                            ->success()
                            ->send();
                    } else {
                        // Turning ON variations
                        $product->update(['has_variations' => true]);

                        Notification::make()
                            ->title('Variations enabled')
                            ->body('You can now add attributes and SKUs.')
                            ->success()
                            ->send();
                    }

                    $this->refreshFormData(['has_variations']);
                }),


        ];
    }
}
