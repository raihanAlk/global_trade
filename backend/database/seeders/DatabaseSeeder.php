<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin hanya dibuat jika kredensial eksplisit disediakan di environment.
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');
        if (!$email || !$password) return;

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => env('ADMIN_NAME', 'GlobalTrade Administrator'),
                'country' => env('ADMIN_COUNTRY', 'Indonesia'),
                'role' => 'admin',
                'account_status' => 'active',
                'password' => Hash::make($password),
            ]
        );
    }
}
