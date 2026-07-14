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
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('item_name'); 
            $table->foreignId('category_id')->constrained('item_categories')->nullOnDelete();
            $table->text('item_description')->nullable();
            $table->string('manufacturer')->nullable();
            $table->decimal('price', 8, 2);
            $table->enum('status', ['available', 'unavailable'])->default('available');
            $table->integer('quantity')->default(0);
            $table->boolean('deleted')->default(false);
            $table->foreignId('created_by')->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
