<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Critere;

class CritereController extends Controller
{
    public function index()
    {
        return response()->json(Critere::all());
    }

    public function store(Request $request)
    {
       $request->validate(['libcrit'=>'required|string',
       'designlib'=>'required|string',]);

        $critere=critere::create(['libcrit'=>$request->libcrit,
        'designlib'=>$request->designlib]);
        
        return response()->json([
            'message' => 'Critère ajouté avec succès',
            'data' => $critere
        ]);
    }
    
}
