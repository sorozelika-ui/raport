<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ANNEE extends Model
{
    use HasFactory; 
   protected $table='annees';
   
   protected $fillable = ['liban'];
    protected $timestamp=true; 
}

