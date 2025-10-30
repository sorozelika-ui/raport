<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypePrestataire extends Model
{
    use HasFactory;

    protected $table = 'type_prestataire';
    protected $fillable = ['nom', 'specialite', 'addresse'];
    public $timestamps = true; 
    protected $connection = 'pgsql';

    // Relation many-to-many avec Critere
    public function criteres()
    {
        return $this->belongsToMany(
            Critere::class,                   // Modèle lié
            'critere_type_prestataire',       // Table pivot
            'type_prestataire_id',            // Clé étrangère dans la table pivot pour ce modèle
            'criteres_id'                      // Clé étrangère dans la table pivot pour le modèle lié
        )
        ->withPivot('années_id')              // Colonne supplémentaire de la table pivot
        ->withTimestamps();                  // Gère created_at et updated_at dans la table pivot
    }
}
