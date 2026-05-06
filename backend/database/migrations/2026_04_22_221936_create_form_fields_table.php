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
       Schema::create('form_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('step_id')->nullable()->constrained('form_steps')->onDelete('cascade');
            $table->string('label');
            $table->string('field_key');
            $table->enum('type', [
                'text','textarea','number','email','password',
                'select','radio','checkbox','date','file',
                'submit','signature','phone','divider','rating',
                'url','location','voice','payment','spacer','grouped'
            ]);
            $table->string('placeholder')->nullable();
            $table->string('default_value')->nullable();
            $table->text('description')->nullable();
            $table->string('custom_error_message')->nullable();
            $table->boolean('is_required')->default(false);
            $table->json('validation_rules')->nullable();
            $table->integer('field_order')->default(1);
            $table->integer('column_index')->default(1);
            $table->integer('column_span')->default(1);
            $table->boolean('is_palette_component')->default(false);
            $table->string('icon')->nullable();
            $table->string('category')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_fields');
    }
};
