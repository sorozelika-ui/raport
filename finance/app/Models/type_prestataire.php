<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class type_prestataire extends Authenticatable

{
    use Notifiable;
    protected $table = 'type_prestataire';

    protected $fillable = [
        'nom',
        'specialite',
        'addresse',
        'email',
        'password',
        'telephone'
    ];

    protected $hidden = [
        'password',
    ];
}
