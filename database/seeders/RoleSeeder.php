<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['id' => 1, 'type' => 'super_admin'],
            ['id' => 2, 'type' => 'admin'],
            ['id' => 3, 'type' => 'user'],
        ];

        foreach ($roles as $role) {
            \App\Models\Role::create($role);
        }
    }
}
