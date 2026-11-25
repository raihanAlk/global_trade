<?php

namespace App\Http\Controllers;

use App\Models\user;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
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
            return $this->send_error(
                'Email atau password tidak valid',
                [],
                401
            );
        }

        if ($user->account_status !== 'active') {
            return $this->send_error(
                'Akun sedang tidak aktif. Silakan hubungi administrator.',
                [],
                403
            );
        }

        $token = $user->createToken('global-trade-user')->plainTextToken;

        return $this->send_response([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->only([
                'id',
                'name',
                'email',
                'country',
                'role',
                'account_status',
            ]),
        ], 'Login berhasil');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return $this->send_response(null, 'Logout berhasil');
    }

    public function me(Request $request)
    {
        return $this->send_response(
            $request->user()->only([
                'id',
                'name',
                'email',
                'country',
                'role',
                'account_status',
                'created_at',
            ]),
            'Profil pengguna'
        );
    }

    public function update_profile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'country' => 'sometimes|nullable|string|max:100',
        ]);

        $user->fill($validated);
        $user->save();

        return $this->send_response(
            $user->only([
                'id',
                'name',
                'email',
                'country',
                'role',
                'account_status',
                'created_at',
            ]),
            'Profil berhasil diperbarui'
        );
    }

    public function change_password(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (! Hash::check($validated['current_password'], $user->password)) {
            return $this->send_error(
                'Password saat ini tidak sesuai.',
                [],
                422
            );
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        return $this->send_response(
            null,
            'Password berhasil diperbarui'
        );
    }
}
