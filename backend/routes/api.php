<?php

use Illuminate\Support\Facades\Route;

use App\Admin\Http\Controllers\CompanyController;
use App\Admin\Http\Controllers\CategoryController;
use App\Admin\Http\Controllers\ProductController;
use App\Admin\Http\Controllers\ProductImageController;
use App\Admin\Http\Controllers\ProductReviewController;
use App\Admin\Http\Controllers\RFQRequestController;
use App\Admin\Http\Controllers\RFQItemController;
use App\Admin\Http\Controllers\QuotationController;
use App\Admin\Http\Controllers\QuotationItemController;
use App\Admin\Http\Controllers\OrderController;
use App\Admin\Http\Controllers\OrderItemController;
use App\Admin\Http\Controllers\ShipmentController;
use App\Admin\Http\Controllers\ShipmentEventController;
use App\Admin\Http\Controllers\ChatReportController;
use App\Admin\Http\Controllers\TradeCenterPostController;

Route::prefix('v1')->group(function () {
    // Perusahaan (supplier / importer / exporter)
    Route::apiResource('companies', CompanyController::class);

    // Kategori (manajemen kategori)
    Route::apiResource('categories', CategoryController::class);
    Route::get('categories/{category}/count-products', [CategoryController::class, 'countProducts'])
        ->name('categories.count-products');

    // Produk (product moderation)
    Route::apiResource('products', ProductController::class);
    Route::put('products/{product}/approve', [ProductController::class, 'approve'])
        ->name('products.approve');
    Route::put('products/{product}/reject', [ProductController::class, 'reject'])
        ->name('products.reject');
    Route::put('products/{product}/request-changes', [ProductController::class, 'requestChanges'])
        ->name('products.request-changes');

    // Gambar produk
    Route::prefix('products')->group(function () {
        Route::get('/{product}/images', [ProductImageController::class, 'index']);
        Route::post('/{product}/images', [ProductImageController::class, 'store']);
        Route::put('/{product}/images/{image}', [ProductImageController::class, 'update']);
        Route::delete('/{product}/images/{image}', [ProductImageController::class, 'destroy']);
    });

    // Ulasan produk
    Route::prefix('products')->group(function () {
        Route::get('/{product}/reviews', [ProductReviewController::class, 'index']);
        Route::post('/{product}/reviews', [ProductReviewController::class, 'store']);
        Route::put('/{product}/reviews/{review}', [ProductReviewController::class, 'update']);
        Route::delete('/{product}/reviews/{review}', [ProductReviewController::class, 'destroy']);
    });

    // Permintaan RFQ
    Route::apiResource('rfq-requests', RFQRequestController::class);
    Route::put('rfq-requests/{rfq}/status', [RFQRequestController::class, 'status'])
        ->name('rfq-requests.status');
    Route::prefix('rfq-requests')->group(function () {
        Route::get('/{rfq}/items', [RFQItemController::class, 'index']);
        Route::post('/{rfq}/items', [RFQItemController::class, 'store']);
        Route::put('/{rfq}/items/{item}', [RFQItemController::class, 'update']);
        Route::delete('/{rfq}/items/{item}', [RFQItemController::class, 'destroy']);
    });

    // Quotation
    Route::apiResource('quotations', QuotationController::class);
    Route::put('quotations/{quotation}/status', [QuotationController::class, 'status'])
        ->name('quotations.status');
    Route::prefix('quotations')->group(function () {
        Route::get('/{quotation}/items', [QuotationItemController::class, 'index']);
        Route::post('/{quotation}/items', [QuotationItemController::class, 'store']);
        Route::put('/{quotation}/items/{item}', [QuotationItemController::class, 'update']);
        Route::delete('/{quotation}/items/{item}', [QuotationItemController::class, 'destroy']);
    });

    // Order
    Route::apiResource('orders', OrderController::class);
    Route::put('orders/{order}/status', [OrderController::class, 'status'])
        ->name('orders.status');
    Route::prefix('orders')->group(function () {
        Route::get('/{order}/items', [OrderItemController::class, 'index']);
        Route::post('/{order}/items', [OrderItemController::class, 'store']);
        Route::put('/{order}/items/{item}', [OrderItemController::class, 'update']);
        Route::delete('/{order}/items/{item}', [OrderItemController::class, 'destroy']);
    });

    // Pengiriman
    Route::apiResource('shipments', ShipmentController::class);
    Route::put('shipments/{shipment}/status', [ShipmentController::class, 'status'])
        ->name('shipments.status');
    Route::prefix('shipments')->group(function () {
        Route::get('/{shipment}/events', [ShipmentEventController::class, 'index']);
        Route::post('/{shipment}/events', [ShipmentEventController::class, 'store']);
        Route::put('/{shipment}/events/{event}', [ShipmentEventController::class, 'update']);
        Route::delete('/{shipment}/events/{event}', [ShipmentEventController::class, 'destroy']);
    });

    // Laporan chat (chat monitoring)
    Route::apiResource('chat-reports', ChatReportController::class);
    Route::put('chat-reports/{report}/status', [ChatReportController::class, 'status'])
        ->name('chat-reports.status');
    Route::put('chat-reports/{report}/moderate', [ChatReportController::class, 'moderate'])
        ->name('chat-reports.moderate');

    // Konten Pusat Perdagangan (Trade Center)
    Route::apiResource('trade-center-posts', TradeCenterPostController::class);
    Route::put('trade-center-posts/{post}/publish', [TradeCenterPostController::class, 'publish'])
        ->name('trade-center-posts.publish');
    Route::put('trade-center-posts/{post}/schedule', [TradeCenterPostController::class, 'schedule'])
        ->name('trade-center-posts.schedule');
    Route::put('trade-center-posts/{post}/unschedule', [TradeCenterPostController::class, 'unschedule'])
        ->name('trade-center-posts.unschedule');
});
