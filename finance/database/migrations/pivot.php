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
       schema::create('pivot',function(blueprint $table)
       {
        $table->id();
        $table->foreignid('critere_id')->constraited()->ondelete('cascade');
        $table->foreignid('type_prestataire_id')->constraited()->ondelete('cascade');
        $table->foreignid('années_id')->constraited()->ondelete('cascade');
        $table->unique(['type_prestataire_id','critere_id','années_id']);
        $table->timestamps();
       });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        schema::dropifexists('pivot');
    }
};
