<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class evaluations extends Model
{
   use HasFactory; 
   protected $table='evaluations';
   protected $fillable = ['criteres_id','type_prestataire_id','note','moyenne','appreciation'];
   protected $timestamp=true;
   protected $connection = 'pgsql';
}
