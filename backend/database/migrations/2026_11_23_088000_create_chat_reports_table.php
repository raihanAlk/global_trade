<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_reports', function (Blueprint $table) {
            $table->id();
            $table->string('conversation_id', 255)->nullable();
            $table->string('reported_user_name', 255);
            $table->string('reporter_name', 255)->nullable();
            $table->enum('reason', ['spam', 'harassment', 'fraud', 'inappropriate', 'other'])->default('other');
            $table->enum('status', ['pending', 'under_review', 'resolved'])->default('pending');
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('moderator_id')->nullable();
            $table->timestamps();
            $table->foreign('moderator_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_reports');
    }
};
