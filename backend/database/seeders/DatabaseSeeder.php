<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin POS',
            'email' => 'admin@pos.app',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
    }
}
