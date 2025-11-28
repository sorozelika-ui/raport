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
         Schema::table('type_prestataire', function (Blueprint $table) {
            // Vérifier si les colonnes n'existent pas avant de les ajouter
            if (!Schema::hasColumn('type_prestataire', 'email')) {
                $table->string('email')->unique()->after('nom');
            }
            if (!Schema::hasColumn('type_prestataire', 'telephone')) {
                $table->string('telephone')->nullable()->after('email');
            }
            if (!Schema::hasColumn('type_prestataire', 'password')) {
                $table->string('password')->after('addresse');
            }
        });;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('type_prestataire', function (Blueprint $table) {
            //
            $table->dropColumn('password');
        });
    }
};
