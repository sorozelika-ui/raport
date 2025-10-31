<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\note;

class notecontroller extends Controller
{
    public function index()
    {
        return response()->json(note::all());
    }

    public function store(Request $request)
    {
       $request->validate(['nt'=>'required|string',
       'appreciation'=>'required|string',]);

        $note=note::create(['nt'=>$request->nt,
        'appreciation'=>$request->appreciation]);
        
        return response()->json([
            'message' => 'note ajouté avec succès',
            'data' => $note
        ]);
    }
    
    // 🔹 3. Afficher un critère spécifique (GET /note/{id})
    public function show($id)
    {
        $note = note::find($id);

        if (!$note) {
            return response()->json(['message' => 'note non trouvé'], 404);
        }

        return response()->json($note);
    }

    // 🔹 4. Modifier un note (POST /note/{id})
    public function update(Request $request, $id)
    {
        $note = note::find($id);

        if (!$note) {
            return response()->json(['message' => 'note non trouvé'], 404);
        }

        $validatedData = $request->validate([
            'nt' => 'required|decimal(5,2)',
            'appreciation' => 'required|string',
        ]);

        $note->update($validatedData);

        return response()->json([
            'message' => 'note mis à jour avec succès',
            'data' => $note
        ]);
    }

    // 🔹 5. Supprimer un note (DELETE /note/{id})
    public function destroy($id)
    {
        $note = note::find($id);

        if (!$note) {
            return response()->json(['message' => 'note non trouvé'], 404);
        }

        $note->delete();

        return response()->json(['message' => 'note supprimé avec succès']);
    }
    
}
