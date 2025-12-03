<?php

namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;

class type_prestataire extends Authenticatable

{

    protected $table = 'type_prestataire';

    protected $fillable = [
        'nom',
        'specialite',
        'addresse',
        'email',
        'passwordd',
        'telephone',];

    protected $hidden = [
        'passwordd',
    ];
}
