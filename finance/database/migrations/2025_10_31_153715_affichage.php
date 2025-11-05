<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
       if(!schema::hastable('evaluations'))
    {
        schema::create('evaluations',function(Blueprint $table)
        {
            $table->id();
            $table->foreignId('type_prestatataire_id')->contrained('type_prestatataire')->ondelete('cascade');
            $table->foreignId('criteres_id')->contrained('criteres')->ondelete('cascade');
            $table->foreignId('note_id')->contrained('note')->ondelete('cascade');
            $table->foreignId('années_id')->contrained('années')->ondelete('cascade');
             $table->timestamps();
        });
    }
}

   
    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};
