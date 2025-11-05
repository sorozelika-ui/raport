<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Affichage extends Model
{
    use HasFactory;

    protected $table = 'evaluations'; 
    protected $fillable = [
        'type_prestataire_id',
        'criteres_id',
        'note_id',
        'années_id'
    ];

    public function type_Prestataire()
    {
        return $this->belongsTo(Type_Prestataire::class, 'type_prestataire_id');
    }

    public function critere()
    {
        return $this->belongsTo(Critere::class, 'criteres_id');
    }

    public function note()
    {
        return $this->belongsTo(note::class, 'note_id');
    }

    public function ANNEE()
    {
        return $this->belongsTo(ANNEE::class, 'années_id');
    }
}
