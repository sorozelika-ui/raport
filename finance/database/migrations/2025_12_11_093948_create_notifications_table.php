<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('type_prestataire_id');
            $table->string('titre');
            $table->text('message');
            $table->string('type'); // evaluation, alerte, info
            $table->integer('annee');
            $table->text('details')->nullable();
            $table->boolean('lu')->default(false);
            $table->timestamps();

            $table->foreign('type_prestataire_id')
                  ->references('id')
                  ->on('type_prestataire')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
};