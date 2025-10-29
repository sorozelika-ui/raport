<?php

namespace App\Http\Controllers;
use App\Models\type_prestataire;
use Illuminate\Http\Request;

class type_prestatairecontroller extends Controller
{
      public function index()
    {
        return response()->json(type_prestataire::all());
    }

    public function store(Request $request)
    {
       $request->validate(['nom'=>'required|string',
       'specialite'=>'required|string','addresse'=>'required|string',]);

        $type=type_prestataire::create(['nom'=>$request->nom,
      'specialite'=>$request->specialite,'addresse'=>$request->addresse]);
        
        return response()->json([
            'message' => 'prestataire ajouté avec succès',
            'data' => $type
        ]);
    }
}
