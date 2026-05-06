<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Pack;

class PackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packs = [
            [
                'id' => 1,
                'title' => 'Free',
                'description' => 'Basic access with limited features',
                'amount' => 0,
                'duration_days' => 30,
            ],
            [
                'id' => 2,
                'title' => 'Professional',
                'description' => 'Advanced features for professionals',
                'amount' => 49.99,
                'duration_days' => 30,
            ],
            [
                'id' => 3,
                'title' => 'Enterprise',
                'description' => 'Full access with all premium features',
                'amount' => 99.99,
                'duration_days' => 30,
            ],
        ];

        foreach ($packs as $pack) {
            Pack::updateOrCreate(
                ['id' => $pack['id']],
                $pack
            );
        }
    }
}
