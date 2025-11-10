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
        Schema::table('bareme', function (Blueprint $table) 
        {
            $table->decimal('nin_note', 5, 2)->change();
            $table->decimal('max_note', 5, 2)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
           Schema::table('bareme', function (Blueprint $table)
        {
            $table->integer('nin_note')->change();
            $table->integer('max_note')->change();
        }); 
    }
};
