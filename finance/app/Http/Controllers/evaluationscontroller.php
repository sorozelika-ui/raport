<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class evaluationscontroller
{   
       public function index()
    {
        return response()->json(evaluations::all());
    }
    
    public function store(Request $request)
    {
    $request->validate(['note'=>'required|string',
       'moyenne'=>'required|string','appreciation'=>'required|string','critere_id'=>'required|string','type_prestataire_id'=>'required|string','années_id'=>'required|string',]);

        $type=evaluations::create(['note'=>$request->note,
      'moyenne'=>$request->moyenne,'appreciation'=>$request->appreciation]);
        
        return response()->json([
            'message' => 'prestataire evalué avec succès',
            'data' => $type
        ]);
    }
}
