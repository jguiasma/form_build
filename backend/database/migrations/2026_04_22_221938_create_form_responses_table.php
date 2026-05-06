<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('form_responses', function (Blueprint $table) {
        $table->id();
        $table->foreignId('form_id')->constrained()->onDelete('cascade');
        $table->foreignId('account_id')->nullable()->constrained('accounts')->onDelete('set null');
        $table->enum('status', ['in_progress', 'completed'])->default('in_progress');
        $table->timestamp('started_at')->nullable();
        $table->timestamp('submitted_at')->nullable();
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_responses');
    }
};
