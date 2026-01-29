<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_attributes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                ->index()
                ->constrained('products')
                ->cascadeOnDelete();
            $table->string('name');
            $table->string('type');

            $table->unique(['product_id', 'name']);
        });

        Schema::create('product_attribute_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_attribute_id')
                ->index()
                ->constrained('product_attributes')
                ->cascadeOnDelete();
            $table->string('value');
        });

        Schema::create('product_skus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                ->index()
                ->constrained('products')
                ->cascadeOnDelete();
            $table->string('sku')->unique();
            $table->decimal('price', 20, 4);
            $table->integer('quantity');
            $table->timestamps();
        });

        Schema::create('product_sku_attribute_value', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_sku_id')->constrained('product_skus')->cascadeOnDelete();
            $table->foreignId('product_attribute_value_id')->constrained('product_attribute_values')->cascadeOnDelete();
            $table->unique([
                'product_sku_id',
                'product_attribute_value_id'
            ]);
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_attributes');
        Schema::dropIfExists('product_attribute_values');
        Schema::dropIfExists('product_skus');
        Schema::dropIfExists('product_sku_attribute_value');
    }
};
