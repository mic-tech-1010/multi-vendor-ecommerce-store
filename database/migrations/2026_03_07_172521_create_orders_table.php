<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            Schema::create('orders', function (Blueprint $table) {
                $table->id();
                $table->decimal('total_price', 20, 4);
                $table->foreignIdFor(User::class, 'user_id');
                $table->foreignIdFor(User::class, 'vendor_user_id');
                $table->string('status');
                $table->string('stripe_session_id')->nullable();
                $table->decimal('online_payment_comission', 20, 4)->nullable();
                $table->decimal('website_comission', 20, 4)->nullable();
                $table->decimal('vendor_subtotal', 20, 4)->nullable();
                $table->string('payment_intent')->nullable();
                $table->timestamps();
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
