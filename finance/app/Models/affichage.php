<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class affichage extends Model
{

    protected $table='evaluations';


    protected $fillable = [
        'type_prestataire_id',
        'criteres_id',
        'note_id',
        'annees_id',
    ];

    public function prestataire()
    {
        return $this->belongsTo(type_prestataire::class, 'type_prestataire_id');
    }

    public function critere()
    {
        return $this->belongsTo(Critere::class, 'criteres_id');
    }

    public function note()
    {
        return $this->belongsTo(note::class, 'note_id');
    }

    public function annee()
    {
        return $this->belongsTo(ANNEE::class, 'annees_id');
    }
}
