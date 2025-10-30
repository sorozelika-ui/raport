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
    {  if (!Schema::hasTable('evaluations')) {
         Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->STRING('note');
            $table->string('moyenne');
            $table->string('appreciation');
            $table->timestamps();
        });
    }
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};
