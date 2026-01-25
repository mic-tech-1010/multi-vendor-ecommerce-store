<?php

namespace App\Enum;

enum PermissionEnum: string
{
    case ManageUsers = 'manage users';
    case ManageProducts = 'manage products';
    case ManageOrders = 'manage orders';


}
