<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('category_id')->after('id')->nullable();
            $table->unsignedBigInteger('company_id')->after('category_id')->nullable();
            $table->unsignedBigInteger('reviewed_by')->after('company_id')->nullable();
            $table->timestamp('reviewed_at')->after('reviewed_by')->nullable();
            $table->foreign('reviewed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropForeign(['reviewed_by']);
            $table->dropColumn(['category_id', 'company_id', 'reviewed_by', 'reviewed_at']);
        });
    }
};
