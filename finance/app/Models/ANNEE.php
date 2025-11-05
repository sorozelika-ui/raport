<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ANNEE extends Model
{
   protected $table='années';
   
   protected $fillable = [ 'liban'];
    protected $timestamp=true; 
}

