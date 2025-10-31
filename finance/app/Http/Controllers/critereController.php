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
    
    // 🔹 3. Afficher un critère spécifique (GET /critere/{id})
    public function show($id)
    {
        $critere = Critere::find($id);

        if (!$critere) {
            return response()->json(['message' => 'Critère non trouvé'], 404);
        }

        return response()->json($critere);
    }

    // 🔹 4. Modifier un critère (POST /critere/{id})
    public function update(Request $request, $id)
    {
        $critere = Critere::find($id);

        if (!$critere) {
            return response()->json(['message' => 'Critère non trouvé'], 404);
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

    // 🔹 5. Supprimer un critère (DELETE /critere/{id})
    public function destroy($id)
    {
        $critere = Critere::find($id);

        if (!$critere) {
            return response()->json(['message' => 'Critère non trouvé'], 404);
        }

        $critere->delete();

        return response()->json(['message' => 'Critère supprimé avec succès']);
    }
    
}
