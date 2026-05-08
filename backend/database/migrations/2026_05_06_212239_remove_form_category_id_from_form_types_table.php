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
        if (!Schema::hasColumn('form_types', 'form_category_id')) {
            return;
        }

        Schema::table('form_types', function (Blueprint $table) {
            $table->dropConstrainedForeignId('form_category_id');
        });
    }

    public function down(): void
    {
        if (Schema::hasColumn('form_types', 'form_category_id')) {
            return;
        }

        Schema::table('form_types', function (Blueprint $table) {
            $table->foreignId('form_category_id')
                ->after('id')
                ->constrained('form_categories')
                ->cascadeOnDelete();
        });
    }

};
