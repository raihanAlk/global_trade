<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Email atau password tidak valid.'], 422);
        }
        if ($user->role !== 'admin' || $user->account_status !== 'active') {
            return response()->json(['message' => 'Akun tidak memiliki akses admin aktif.'], 403);
        }

        $token = Str::random(64);
        $user->forceFill(['api_token_hash' => hash('sha256', $token)])->save();

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->only(['id', 'name', 'email', 'country', 'role']),
        ]);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()->only(['id', 'name', 'email', 'country', 'role'])]);
    }

    public function logout(Request $request)
    {
        $request->user()->forceFill(['api_token_hash' => null])->save();
        return response()->json(['message' => 'Logout berhasil.']);
    }
}
