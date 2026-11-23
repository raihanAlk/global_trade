<?php

use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\AdminManagementController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login'])->middleware('throttle:5,1');

    Route::middleware('admin.api')->group(function () {
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/dashboard', [AdminManagementController::class, 'dashboard']);

        Route::get('/users', [AdminManagementController::class, 'users']);
        Route::get('/users/{user}', [AdminManagementController::class, 'user']);
        Route::patch('/users/{user}/status', [AdminManagementController::class, 'updateUserStatus']);

        Route::get('/businesses', [AdminManagementController::class, 'businesses']);
        Route::get('/businesses/{business}', [AdminManagementController::class, 'business']);

        Route::get('/verifications', [AdminManagementController::class, 'verifications']);
        Route::get('/verifications/{submission}', [AdminManagementController::class, 'verification']);
        Route::patch('/verifications/{submission}', [AdminManagementController::class, 'updateVerification']);
        Route::get('/verifications/{submission}/documents/{document}', [AdminManagementController::class, 'previewDocument']);
    });
});
