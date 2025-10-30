<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   
    public function up(): void
    {
        if(!schema::hastable('type_prestataire'))
        {
               Schema::create('type_prestataire', function (Blueprint $table) 
            {
               $table->id();
               $table->STRING('nom');
               $table->string('specialite');
               $table->string('addresse');
               $table->timestamps();
            }
          );
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('type_prestataire');
    }
};
