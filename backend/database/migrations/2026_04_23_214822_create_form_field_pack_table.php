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
        Schema::create('form_field_pack', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_field_id')->constrained('form_fields')->onDelete('cascade');
            $table->foreignId('pack_id')->constrained('packs')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_field_pack');
    }
};
