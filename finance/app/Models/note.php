<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class note extends Model
{
    use HasFactory; 
   protected $table='note';
   protected $fillable = ['nts','appreciation','moyenne'];
   protected $timestamp=true;
   protected $connection = 'pgsql';
}
