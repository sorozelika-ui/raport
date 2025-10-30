<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ANNEE extends Model
{
   protected $table='annee';
   
   protected $fillable = [ 'liban'];
    protected $timestamp=true;
}

