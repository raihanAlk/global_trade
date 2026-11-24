<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trade_center_posts', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['news', 'export_guide', 'import_guide', 'country_profile', 'glossary', 'event'])->default('news');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content');
            $table->string('excerpt', 255)->nullable();
            $table->string('cover_image', 255)->nullable();
            $table->boolean('featured')->default(false);
            $table->unsignedBigInteger('author_id')->nullable();
            $table->enum('status', ['draft', 'pending', 'published', 'scheduled'])->default('draft');
            $table->dateTime('published_at')->nullable();
            $table->dateTime('scheduled_at')->nullable();
            $table->timestamps();
            $table->foreign('author_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trade_center_posts');
    }
};
