<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminApiToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $plainToken = $request->bearerToken();
        if (!$plainToken) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $user = User::where('api_token_hash', hash('sha256', $plainToken))->first();
        if (!$user || $user->role !== 'admin' || $user->account_status !== 'active') {
            return response()->json(['message' => 'Unauthorized admin access.'], 403);
        }

        $request->setUserResolver(fn () => $user);
        return $next($request);
    }
}
