<?php

namespace App\Admin\Http\Controllers;

use Illuminate\Http\JsonResponse;

abstract class BaseController extends Controller
{
    protected function sendResponse($result, string $message = 'Berhasil', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $result,
        ], $code);
    }

    protected function sendError(string $message, array $errors = [], int $code = 400): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if (! empty($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }
}
