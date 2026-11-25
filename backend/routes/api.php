<?php

use App\Http\Controllers\auth_controller;
use App\Http\Controllers\category_controller;
use App\Http\Controllers\chat_report_controller;
use App\Http\Controllers\company_controller;
use App\Http\Controllers\order_controller;
use App\Http\Controllers\order_item_controller;
use App\Http\Controllers\product_controller;
use App\Http\Controllers\product_image_controller;
use App\Http\Controllers\product_review_controller;
use App\Http\Controllers\quotation_controller;
use App\Http\Controllers\quotation_item_controller;
use App\Http\Controllers\rfq_item_controller;
use App\Http\Controllers\rfq_request_controller;
use App\Http\Controllers\shipment_controller;
use App\Http\Controllers\shipment_event_controller;
use App\Http\Controllers\trade_center_post_controller;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\AdminManagementController;
use App\Http\Middleware\EnsureAdminApiToken;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Admin login (menggunakan api_token_hash)
    Route::post('auth/login', [AdminAuthController::class, 'login'])->middleware('throttle:5,1');
    // User authentication
    Route::post('user/login', [auth_controller::class, 'login'])
        ->middleware('throttle:5,1');

    // Authentication for the existing Sanctum-protected API
    Route::middleware('auth:sanctum')->group(function () {
        // User profile and account
        Route::get('user/me', [auth_controller::class, 'me']);

        Route::put('user/profile', [auth_controller::class, 'update_profile']);

        Route::post('user/change-password', [auth_controller::class, 'change_password']);
        
        Route::middleware('role:admin')->group(function () {
            Route::apiResource('companies', company_controller::class);
            Route::apiResource('categories', category_controller::class);
            Route::get('categories/{category}/count-products', [category_controller::class, 'count_products'])
                ->name('categories.count-products');

            Route::apiResource('products', product_controller::class)->except(['index', 'show']);
            Route::post('products/{product}/images', [product_image_controller::class, 'store']);
            Route::put('products/{product}/images/{image}', [product_image_controller::class, 'update']);
            Route::delete('products/{product}/images/{image}', [product_image_controller::class, 'destroy']);
            Route::post('products/{product}/reviews', [product_review_controller::class, 'store']);
            Route::put('products/{product}/reviews/{review}', [product_review_controller::class, 'update']);
            Route::delete('products/{product}/reviews/{review}', [product_review_controller::class, 'destroy']);

            Route::apiResource('rfq-requests', rfq_request_controller::class);
            Route::put('rfq-requests/{rfq}/status', [rfq_request_controller::class, 'status'])
                ->name('rfq-requests.status');
            Route::prefix('rfq-requests')->group(function () {
                Route::get('/{rfq}/items', [rfq_item_controller::class, 'index']);
                Route::post('/{rfq}/items', [rfq_item_controller::class, 'store']);
                Route::put('/{rfq}/items/{item}', [rfq_item_controller::class, 'update']);
                Route::delete('/{rfq}/items/{item}', [rfq_item_controller::class, 'destroy']);
            });

            Route::apiResource('quotations', quotation_controller::class);
            Route::put('quotations/{quotation}/status', [quotation_controller::class, 'status'])
                ->name('quotations.status');
            Route::prefix('quotations')->group(function () {
                Route::get('/{quotation}/items', [quotation_item_controller::class, 'index']);
                Route::post('/{quotation}/items', [quotation_item_controller::class, 'store']);
                Route::put('/{quotation}/items/{item}', [quotation_item_controller::class, 'update']);
                Route::delete('/{quotation}/items/{item}', [quotation_item_controller::class, 'destroy']);
            });

            Route::apiResource('orders', order_controller::class);
            Route::put('orders/{order}/status', [order_controller::class, 'status'])
                ->name('orders.status');
            Route::prefix('orders')->group(function () {
                Route::get('/{order}/items', [order_item_controller::class, 'index']);
                Route::post('/{order}/items', [order_item_controller::class, 'store']);
                Route::put('/{order}/items/{item}', [order_item_controller::class, 'update']);
                Route::delete('/{order}/items/{item}', [order_item_controller::class, 'destroy']);
            });

            Route::apiResource('shipments', shipment_controller::class);
            Route::put('shipments/{shipment}/status', [shipment_controller::class, 'status'])
                ->name('shipments.status');
            Route::prefix('shipments')->group(function () {
                Route::get('/{shipment}/events', [shipment_event_controller::class, 'index']);
                Route::post('/{shipment}/events', [shipment_event_controller::class, 'store']);
                Route::put('/{shipment}/events/{event}', [shipment_event_controller::class, 'update']);
                Route::delete('/{shipment}/events/{event}', [shipment_event_controller::class, 'destroy']);
            });
        });

        Route::middleware('role:admin,moderator')->group(function () {
            Route::get('products', [product_controller::class, 'index'])->name('products.index');
            Route::get('products/{product}', [product_controller::class, 'show'])->name('products.show');
            Route::put('products/{product}/approve', [product_controller::class, 'approve'])
                ->name('products.approve');
            Route::put('products/{product}/reject', [product_controller::class, 'reject'])
                ->name('products.reject');
            Route::put('products/{product}/request-changes', [product_controller::class, 'request_changes'])
                ->name('products.request-changes');
            Route::get('products/{product}/images', [product_image_controller::class, 'index']);
            Route::get('products/{product}/reviews', [product_review_controller::class, 'index']);

            Route::apiResource('chat-reports', chat_report_controller::class);
            Route::put('chat-reports/{report}/status', [chat_report_controller::class, 'status'])
                ->name('chat-reports.status');
            Route::put('chat-reports/{report}/moderate', [chat_report_controller::class, 'moderate'])
                ->name('chat-reports.moderate');
        });

        Route::middleware('role:admin,editor')->group(function () {
            Route::apiResource('trade-center-posts', trade_center_post_controller::class);
            Route::put('trade-center-posts/{post}/publish', [trade_center_post_controller::class, 'publish'])
                ->name('trade-center-posts.publish');
            Route::put('trade-center-posts/{post}/schedule', [trade_center_post_controller::class, 'schedule'])
                ->name('trade-center-posts.schedule');
            Route::put('trade-center-posts/{post}/unschedule', [trade_center_post_controller::class, 'unschedule'])
                ->name('trade-center-posts.unschedule');
        });
    });

    Route::middleware(EnsureAdminApiToken::class)->group(function () {
        Route::post('auth/logout', [AdminAuthController::class, 'logout']);
        Route::get('auth/me', [AdminAuthController::class, 'me']);

        Route::get('dashboard', [AdminManagementController::class, 'dashboard']);
        Route::get('users', [AdminManagementController::class, 'users']);
        Route::get('users/{user}', [AdminManagementController::class, 'user']);
        Route::put('users/{user}/status', [AdminManagementController::class, 'updateUserStatus']);
        Route::get('businesses', [AdminManagementController::class, 'businesses']);
        Route::get('businesses/{business}', [AdminManagementController::class, 'business']);
        Route::get('verifications', [AdminManagementController::class, 'verifications']);
        Route::get('verifications/{submission}', [AdminManagementController::class, 'verification']);
        Route::put('verifications/{submission}', [AdminManagementController::class, 'updateVerification']);
    });
});
