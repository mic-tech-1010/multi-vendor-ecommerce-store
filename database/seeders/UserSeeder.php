<?php

namespace Database\Seeders;

use App\Enum\RolesEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'), // It's recommended to use a secure password
        ]);

        $vendorUser = User::create([
            'name' => 'Vendor User',
            'email' => 'vendor@example.com',
            'password' => bcrypt('password'), // It's recommended to use a secure password
        ]);

        $customerUser = User::create([
            'name' => 'Customer User',
            'email' => 'customer@example.com',
            'password' => bcrypt('password'), // It's recommended to use a secure password
        ]);

        $adminUser->assignRole(RolesEnum::Admin->value);
        $vendorUser->assignRole(RolesEnum::Vendor->value);
        $customerUser->assignRole(RolesEnum::Customer->value);

    }
}
