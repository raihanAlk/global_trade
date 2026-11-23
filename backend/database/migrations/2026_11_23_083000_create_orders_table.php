<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_no')->unique();
            $table->unsignedBigInteger('buyer_company_id');
            $table->unsignedBigInteger('seller_company_id');
            $table->decimal('total_value', 15, 2)->default(0.00);
            $table->string('currency', 3)->default('USD');
            $table->date('order_date')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])->default('pending');
            $table->date('expected_delivery')->nullable();
            $table->timestamps();
            $table->foreign('buyer_company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('seller_company_id')->references('id')->on('companies')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
