<?php

namespace Database\Seeders;

use App\Models\Account;
use Illuminate\Database\Seeder;

class AccountSeeder extends Seeder
{
    /**
     * Seed the payment accounts shown to users for transfer.
     *
     * Update these with the real business account details before seeding.
     */
    public function run(): void
    {
        Account::updateOrCreate(
            ['account_number' => '3004753997 '],
            [
                'account_name' => 'SMARTMIRAH HOSPITALITY LIMITED ',
                'bank_name' => 'GT Bank',
                'is_primary_account' => true,
            ]
        );
    }
}
