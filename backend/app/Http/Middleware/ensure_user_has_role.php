<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ensure_user_has_role
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user_role = $request->user()?->role;

        if (! $user_role || ! in_array($user_role, $roles, true)) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Akses tidak diizinkan',
            ], 403);
        }

        return $next($request);
    }
}
