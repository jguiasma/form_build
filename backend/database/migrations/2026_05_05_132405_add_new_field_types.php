<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
    {
        DB::statement("ALTER TABLE form_fields MODIFY COLUMN type ENUM(
            'text','textarea','number','email','password','select','radio',
            'checkbox','date','file','submit','signature','phone','divider',
            'rating','url','location','voice','payment','spacer','grouped',
            'slider','conditional','matrix'
        ) NOT NULL");
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
