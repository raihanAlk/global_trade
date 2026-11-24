<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rfq_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('supplier_company_id');
            $table->unsignedBigInteger('importer_company_id');
            $table->string('destination_country', 100);
            $table->unsignedInteger('quantity')->default(0);
            $table->enum('status', ['draft', 'pending', 'approved', 'negotiating', 'closed'])->default('draft');
            $table->date('expires_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->foreign('supplier_company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('importer_company_id')->references('id')->on('companies')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rfq_requests');
    }
};
