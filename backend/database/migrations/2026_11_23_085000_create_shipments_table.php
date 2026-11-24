<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_number')->unique();
            $table->string('origin_city', 255)->nullable();
            $table->string('origin_country', 100)->nullable();
            $table->string('destination_city', 255)->nullable();
            $table->string('destination_country', 100)->nullable();
            $table->date('estimated_arrival')->nullable();
            $table->enum('status', ['pending', 'in_transit', 'delivered', 'exception', 'cancelled'])->default('pending');
            $table->string('current_location', 255)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
