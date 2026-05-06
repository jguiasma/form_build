<?php

namespace Database\Seeders;

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
         User::updateOrCreate(
            ['email' => 'superadmin@formflow.com'],
            [
                'name' => 'Super Admin',
                'email' => 'superadmin@formflow.com',
                'password' => bcrypt('password'),
            ]
    );
    }
}
