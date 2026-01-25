<?php

namespace Database\Seeders;

use App\Enum\PermissionEnum;
use App\Enum\RolesEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Create Roles
        $adminRole = Role::create(['name' => RolesEnum::Admin->value]);
        $vendorRole = Role::create(['name' => RolesEnum::Vendor->value]);
        $customerRole = Role::create(['name' => RolesEnum::Customer->value]);

        $manageProducts = Permission::create(['name' => PermissionEnum::ManageProducts->value]);
        $manageOrders = Permission::create(['name' => PermissionEnum::ManageOrders->value]);
        $manageUsers = Permission::create(['name' => PermissionEnum::ManageUsers->value]);

        $adminRole->syncPermissions([$manageUsers, $manageProducts, $manageOrders]);
        $vendorRole->syncPermissions([$manageProducts, $manageOrders]);

    }
}
