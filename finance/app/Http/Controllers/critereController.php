<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Critere;

class CritereController extends Controller
{
    public function index(Request $request)
    {
        $query =criteres::query();

        /*Recherche
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('libcrit', 'LIKE', "%$search%")
                  ->orWhere('designlib', 'LIKE', "%$search%")
            
        }

        // Tri descendante pour avoir le dernier ajout en haut
        $prestataires = $query->orderBy('id', 'desc')->get();

        return response()->json($prestataires);*/
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
