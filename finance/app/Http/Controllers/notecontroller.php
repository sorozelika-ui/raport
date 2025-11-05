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
       $request->validate(['nt'=>'required|numeric|min:1|max:20',
       'appreciation'=>'required|string', 'moyenne'=>'required|float',]);

        $note=note::create(['nt'=>$request->nt,
        'appreciation'=>$request->appreciation]);
        return response()->json([
            'message' => 'note ajouté avec succès',
            'data' => $note
        ]);

        // Calculer la moyenne des notes
         $notes = array_map(function ($r) {
            return (float) $r['note'];
        }, $results);
        $moyenne = count($notes) ? array_sum($notes) / count($notes) : 0;

        return response()->json([
            'message' => 'Évaluations enregistrées avec succès',
            'moyenne' => number_format($moyenne, 2),
            'details' => $results
        ]);
    }
    
    
    public function show($id)
    {
        $note = note::find($id);

        if (!$note) {
            return response()->json(['message' => 'note non trouvé']);
        }

        return response()->json($note);
    }

    
    public function update(Request $request, $id)
    {
        $note = note::find($id);

        if (!$note) {
            return response()->json(['message' => 'note non trouvé']);
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

    
    public function destroy($id)
    {
        $note = note::find($id);

        if (!$note) {
            return response()->json(['message' => 'note non trouvé']);
        }

        $note->delete();

        return response()->json(['message' => 'note supprimé avec succès']);
    }
    
}
