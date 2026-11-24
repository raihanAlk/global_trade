<?php

namespace App\Http\Controllers;

use App\Models\user;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

class auth_controller extends base_controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = user::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return $this->send_error('Email atau password tidak valid', [], 401);
        }

        $token = $user->createToken('global-trade-api')->plainTextToken;

        return $this->send_response([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->only(['id', 'name', 'email', 'role']),
        ], 'Login berhasil');
    }

    public function logout(Request $request)
    {
        $access_token = $request->user()->currentAccessToken();

        if ($access_token instanceof PersonalAccessToken) {
            $access_token->delete();
        }

        return $this->send_response(null, 'Logout berhasil');
    }

    public function me(Request $request)
    {
        return $this->send_response(
            $request->user()->only(['id', 'name', 'email', 'role']),
            'Profil pengguna'
        );
    }
}
