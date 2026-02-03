<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Resources\Products\ProductResource;
use Filament\Resources\Pages\EditRecord;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Filament\Actions\DeleteAction;
use Filament\Support\Icons\Heroicon;
use BackedEnum;
use Filament\Infolists\Components\TextEntry;
use Filament\Notifications\Notification;
use Filament\Actions\Action;

class ProductSkus extends EditRecord
{
    protected static string $resource = ProductResource::class;

    protected static ?string $title = 'Product SKUs';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::Briefcase;

    protected static ?string $navigationLabel = "Stock Keeping Unit (SKU)";

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            Repeater::make('skus')
                ->relationship()
                ->columns(2)
                ->columnSpan(2)
                ->label(false)
                ->collapsible()
                ->addable(false)
                ->deletable(false)
                ->defaultItems(1)
                ->schema([
                    TextEntry::make('attributeValues.value')
                        ->label('Combination'),
                    TextInput::make('price')
                        ->numeric()
                        ->required(),
                    TextInput::make('quantity')
                        ->integer()
                        ->minValue(0)
                        ->required(),
                ])

        ]);
    }

    public static function canAccess(array $parameters = []): bool
    {
        return $parameters['record']->has_variations;
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
