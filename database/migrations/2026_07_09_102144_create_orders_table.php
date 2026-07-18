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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->integer('total_quantity');
            $table->double('total_price');
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->string('delivery_channel')->nullable();
            $table->string('delivery_confirmed_by')->nullable();
            $table->string('delivered_by')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('delivery_address')->nullable();
            $table->string('delivery_state')->nullable();
            $table->string('receipt_ref')->nullable();
            $table->string('generated_at')->nullable();
            $table->timestamps();
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
