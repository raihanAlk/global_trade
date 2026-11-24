<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('businesses', function (Blueprint $table) {
            $table->id();
            $table->string('legal_name');
            $table->string('display_name')->nullable();
            $table->string('country', 100)->index();
            $table->string('business_type', 100)->nullable();
            $table->string('registration_number')->nullable()->index();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->text('address')->nullable();
            $table->text('description')->nullable();
            $table->string('verification_status', 40)->default('pending')->index();
            $table->timestamps();
        });

        Schema::create('business_memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('membership_role', 30)->default('member');
            $table->string('status', 30)->default('active');
            $table->timestamps();
            $table->unique(['business_id', 'user_id']);
        });

        Schema::create('verification_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->foreignId('submitted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status', 40)->default('pending')->index();
            $table->text('admin_notes')->nullable();
            $table->text('request_message')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('verification_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('verification_submission_id')->constrained()->cascadeOnDelete();
            $table->string('document_type', 100);
            $table->string('original_name');
            $table->string('file_path');
            $table->string('mime_type', 100)->nullable();
            $table->string('review_status', 30)->default('pending');
            $table->text('review_note')->nullable();
            $table->timestamps();
        });

        Schema::create('verification_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('verification_submission_id')->constrained()->cascadeOnDelete();
            $table->string('from_status', 40)->nullable();
            $table->string('to_status', 40);
            $table->text('notes')->nullable();
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verification_status_histories');
        Schema::dropIfExists('verification_documents');
        Schema::dropIfExists('verification_submissions');
        Schema::dropIfExists('business_memberships');
        Schema::dropIfExists('businesses');
    }
};
