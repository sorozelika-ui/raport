<?php

namespace App\Http\Controllers;
use App\Models\type_prestataire;
use Illuminate\Http\Request;

class type_prestatairecontroller extends Controller
{
    public function index(Request $request)
    {
        $query = type_prestataire::query();

        // Recherche
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('nom', 'LIKE', "%$search%")
                  ->orWhere('specialite', 'LIKE', "%$search%")
                  ->orWhere('addresse', 'LIKE', "%$search%");
        }

        // Tri descendante pour avoir le dernier ajout en haut
        $prestataires = $query->orderBy('id', 'desc')->get();

        return response()->json($prestataires);
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
     public function show($id)
    {
        $type = type_prestataire::find($id);

        if (!$type) {
            return response()->json(['message' => 'prestataire non trouvé'], 404);
        }

        return response()->json($type);
    }

   
    public function update(Request $request, $id)
    {
        $type = type_prestataire::find($id);

        if (!$type) {
            return response()->json(['message' => 'prestataire non trouvé']);
        }

        $validatedData = $request->validate([
            'nom' => 'required|string',
            'specialite' => 'required|string',
            'addresse' => 'required|string',
        ]);

        $type->update($validatedData);

        return response()->json([
            'message' => 'prestataire mis à jour avec succès',
            'data' => $type
        ]);
    }

   
    public function destroy($id)
    {
        $type = type_prestataire::find($id);

        if (!$type) {
            return response()->json(['message' => 'prestataire non trouvé']);
        }

        $type->delete();

        return response()->json(['message' => 'prestataire supprimé avec succès']);
    }
    
}
