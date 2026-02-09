<?php

namespace App\Filament\Resources\ProductSections\RelationManagers;

use Filament\Actions\AttachAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DetachAction;
use Filament\Actions\DetachBulkAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Support\Facades\DB;

class ProductsRelationManager extends RelationManager
{
    protected static string $relationship = 'products';

    protected static ?string $inverseRelationship = 'sections';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->label('Product'),
            ])
            ->reorderable('position')
            ->recordActions([
                DetachAction::make()
                    ->action(function ($record) {
                        $this->getRelationship()->detach($record);
                        $this->resequencePositions();
                    }),
            ])
            ->headerActions([
                AttachAction::make()
                    ->multiple()
                    ->preloadRecordSelect()
                    ->recordTitleAttribute('title')
                    ->recordSelectOptionsQuery(
                        fn($query) =>
                        $query->published()
                    )
                    ->using(function (RelationManager $livewire, array $data) {

                        /** @var ProductSection $section */
                        $section = $livewire->getOwnerRecord();

                        $recordIds = $data['recordId'];

                        // Get current max position inside this section
                        $maxPosition = DB::table('product_section_product')
                            ->where('product_section_id', $section->id)
                            ->max('position') ?? 0;

                        $insertData = [];

                        foreach ($recordIds as $index => $productId) {
                            $insertData[] = [
                                'product_section_id' => $section->id,
                                'product_id' => $productId,
                                'position' => $maxPosition + $index + 1,
                            ];
                        }

                        DB::table('product_section_product')->insert($insertData);
                    })

            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DetachBulkAction::make(),
                ]),
            ]);
    }

    protected function resequencePositions(): void
    {
        $section = $this->getOwnerRecord();

        $section->products()
            ->orderBy('product_section_product.position')
            ->get()
            ->values()
            ->each(function ($product, $index) use ($section) {
                $section->products()->updateExistingPivot(
                    $product->id,
                    ['position' => $index + 1]
                );
            });
    }
}
