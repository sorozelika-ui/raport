<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class bareme extends Model
{
    use HasFactory;
    protected $fillable=['nin_note','max_note','appreciation'];
    protected $table='bareme';
}
