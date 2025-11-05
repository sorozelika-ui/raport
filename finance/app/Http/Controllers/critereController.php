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
    
  
    public function show($id)
    {
        $critere = Critere::find($id);

        if (!$critere) {
            return response()->json(['message' => 'Critère non trouvé'], 404);
        }

        return response()->json($critere);
    }

    
    public function update(Request $request, $id)
    {
        $critere = Critere::find($id);

        if (!$critere) {
            return response()->json(['message' => 'Critère non trouvé']);
        }

        $validatedData = $request->validate([
            'libcrit' => 'required|string',
            'designlib' => 'required|string',
        ]);

        $critere->update($validatedData);

        return response()->json([
            'message' => 'Critère mis à jour avec succès',
            'data' => $critere
        ]);
    }

    
    public function destroy($id)
    {
        $critere = Critere::find($id);

        if (!$critere) {
            return response()->json(['message' => 'Critère non trouvé']);
        }

        $critere->delete();

        return response()->json(['message' => 'Critère supprimé avec succès']);
    }
    
}
