<?php

namespace App\Filament\Resources\Products\Pages;

use App\Enum\ProductAttributeTypeEnum;
use App\Filament\Resources\Products\ProductResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Icons\Heroicon;
use BackedEnum;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Repeater\TableColumn;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Filament\Support\Enums\Alignment;
use App\Services\ProductSkuGenerator;
use Illuminate\Validation\ValidationException;
use Filament\Notifications\Notification;
use Filament\Actions\Action;

class ProductAttributes extends EditRecord
{
    protected static string $resource = ProductResource::class;

    protected static ?string $title = 'Product Attributes';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::PuzzlePiece;

    protected static ?string $navigationLabel = 'Product Attributes';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Repeater::make('productAttributes')
                    ->label('')
                    ->relationship()
                    ->columns(2)
                    ->columnSpan(2)
                    ->addActionLabel('Add new Attribute')
                    ->addActionAlignment(Alignment::End)
                    ->reorderableWithButtons()
                    ->collapsible()
                    ->schema([
                        TextInput::make('name')
                            ->required(),
                        Select::make('type')
                            ->options(ProductAttributeTypeEnum::labels())
                            ->required()
                            ->live(),
                        Repeater::make('options')
                            ->relationship()
                            ->collapsible()
                            ->addActionLabel('Add new Option')
                            ->addActionAlignment(Alignment::Start)
                            ->schema([
                                TextInput::make('value')
                                    ->columnSpan(2)
                                    ->required(),
                                SpatieMediaLibraryFileUpload::make('images')
                                    ->image()
                                    ->multiple()
                                    ->openable()
                                    ->panelLayout('grid')
                                    ->collection('images')
                                    ->reorderable()
                                    ->appendFiles()
                                    ->preserveFilenames()
                                    ->columnSpan(2)
                                    ->visible(
                                        fn(Get $get) =>
                                        $get('../../type') === ProductAttributeTypeEnum::Image->value
                                    ),
                            ])
                            ->columnSpan(2)
                    ])
            ]);
    }

    protected function afterSave(): void
    {

        $product = $this->record;

        // Only for variable products
        if (! $product->has_variations) {
            return;
        }

        try {
            app(ProductSkuGenerator::class)->generate($product);

            Notification::make()
                ->title('SKUs updated automatically')
                ->body('SKU combinations have been Modified.')
                ->success()
                ->send();
        } catch (ValidationException $e) {
            Notification::make()
                ->title('SKU generation skipped')
                ->body(collect($e->errors())->flatten()->implode("\n"))
                ->warning()
                ->send();
        }
    }

    public static function canAccess(array $parameters = []): bool
    {
        return $parameters['record']->has_variations;
    }

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
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
