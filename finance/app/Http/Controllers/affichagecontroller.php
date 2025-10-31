<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\affichage;
class affichagecontroller extends Controller


{// 🔹 1. Afficher toutes les évaluations
    public function index()
    {
        return response()->json(
            Evaluations::with(['type_prestataire', 'criteres', 'note', 'années'])->get()
        );
    }

    // 🔹 2. Créer une nouvelle évaluation
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type_prestataire_id' => 'required|exists:type_prestataire,id',
            'criteres_id' => 'required|exists:criteres,id',
            'note_id' => 'required|exists:note,id',
            'années_id' => 'required|exists:années,id',
        ]);

        $evaluation = Evaluations::create($validated);

        return response()->json([
            'message' => 'Évaluation enregistrée avec succès ✅',
            'data' => $evaluation
        ]);
    }

    // 🔹 3. Afficher une évaluation précise
    public function show($id)
    {
        $evaluation = Evaluations::with(['type_prestataire', 'criteres', 'note', 'années'])->find($id);

        if (!$evaluation) {
            return response()->json(['message' => 'Évaluation non trouvée ❌'], 404);
        }

        return response()->json($evaluation);
    }

    // 🔹 4. Modifier une évaluation
    public function update(Request $request, $id)
    {
        $evaluation = Evaluations::find($id);

        if (!$evaluation) {
            return response()->json(['message' => 'Évaluation non trouvée ❌'], 404);
        }

        $validated = $request->validate([
            'type_prestataire_id' => 'required|exists:type_prestataire,id',
            'criteres_id' => 'required|exists:criteres,id',
            'note_id' => 'required|exists:note,id',
            'années_id' => 'required|exists:années,id',
        ]);

        $evaluation->update($validated);

        return response()->json([
            'message' => 'Évaluation mise à jour avec succès ✏️',
            'data' => $evaluation
        ]);
    }

    // 🔹 5. Supprimer une évaluation
    public function destroy($id)
    {
        $evaluation = Evaluations::find($id);

        if (!$evaluation) {
            return response()->json(['message' => 'Évaluation non trouvée ❌'], 404);
        }

        $evaluation->delete();

        return response()->json(['message' => 'Évaluation supprimée avec succès 🗑️']);
    }
    
}
