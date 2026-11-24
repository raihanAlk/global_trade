<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_reviews', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('product_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedTinyInteger('rating')->default(0);
            $table->text('comment')->nullable();
            $table->boolean('approved')->default(false);
            $table->timestamp('approved_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_reviews');
    }
};
