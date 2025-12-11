<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'type_prestataire_id',
        'titre',
        'message',
        'type',
        'annee',
        'details',
        'lu'
    ];

    protected $casts = [
        'lu' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function prestataire()
    {
        return $this->belongsTo(TypePrestataire::class, 'type_prestataire_id');
    }
}