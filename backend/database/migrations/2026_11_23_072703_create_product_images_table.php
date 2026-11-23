<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('product_id')->nullable();
            $table->string('url', 255)->nullable();
            $table->string('alt', 255)->nullable();
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->boolean('is_primary')->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};
