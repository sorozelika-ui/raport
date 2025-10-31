<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class affichage extends Model
{   protected $table='evaluations';
    protected $fillable=[
        'type_prestataire_id','criteres_id','note_id','années_id',
    ];
    public function type_prestataire()
    {
    return $this->belongsto(type_prestataire::class);
    }
    public function critere()
    {
    return $this->belongsto(critere::class);
    }
        public function note()
    {
    return $this->belongsto(note::class);
    }
    public function ANNEE()
    {
    return $this->belongsto(ANNEE::class);
    }
}
