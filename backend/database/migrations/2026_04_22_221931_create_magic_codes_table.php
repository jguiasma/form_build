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
        Schema::create('magic_codes', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->string('code', 255);
            $table->timestamp('expiration_date');
            $table->boolean('is_valid')->default(true);
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('magic_codes');
    }
};
