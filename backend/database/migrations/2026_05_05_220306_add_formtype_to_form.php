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
        Schema::table('forms', function (Blueprint $table) {
            $table->foreignId('form_type_id')
                ->nullable() // nullable pour ne pas bloquer les lignes existantes
                ->after('form_category_id')
                ->constrained('form_types')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       Schema::table('forms', function (Blueprint $table) {
            $table->dropForeign(['form_type_id']);
            $table->dropColumn('form_type_id');
        });
    }
};
