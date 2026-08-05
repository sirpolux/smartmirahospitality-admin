<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'received', 'packaged', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending'");
        DB::statement("ALTER TABLE transactions MODIFY COLUMN status ENUM('pending', 'confirmed', 'rejected', 'failed', 'refunded') NOT NULL DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending'");
        DB::statement("ALTER TABLE transactions MODIFY COLUMN status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending'");
    }
};
