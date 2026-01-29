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

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
