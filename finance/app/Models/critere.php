<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Critere extends Model
{
    use HasFactory;
    protected $table='criteres';
    protected $primarykey='id';
    public $incrementing = true;
    protected $keytype = 'integer';
    protected $fillable = ['libcrit', 'designlib'];
    
}
