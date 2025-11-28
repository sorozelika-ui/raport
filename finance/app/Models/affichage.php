<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\affichage;
use Illuminate\Support\Facades\DB;

class affichagecontroller extends Controller
{
    public function index(Request $request)
    {
        // Charger les relations définies dans ton modèle
        $evaluations = affichage::with(['type_Prestataire', 'critere', 'note', 'ANNEE'])
                                 ->orderBy('id', 'desc')
                                 ->get();

        return response()->json($evaluations);
    }

    public function store(Request $request)
    {
        // Validation conforme à tes colonnes
        $request->validate([
            'type_prestataire_id' => 'required|exists:type_prestataire,id',
            'criteres_id' => 'required|exists:criteres,id',
            'note_id' => 'required|exists:note,id',
            'années_id' => 'required|exists:années,id',
        ]);

        $evaluation = affichage::create([
            'type_prestataire_id' => $request->type_prestataire_id,
            'criteres_id' => $request->criteres_id,
            'note_id' => $request->note_id,
            'années_id' => $request->années_id,
        ]);

        // Recharger les relations
        $evaluation->load(['type_Prestataire', 'critere', 'note', 'ANNEE']);

        return response()->json([
            'message' => 'Évaluation créée avec succès',
            'data' => $evaluation
        ], 201);
    }

    public function show($id)
    {
        $evaluation = affichage::with(['type_Prestataire', 'critere', 'note', 'ANNEE'])
                               ->find($id);

        if (!$evaluation) {
            return response()->json(['message' => 'Évaluation non trouvée'], 404);
        }

        return response()->json($evaluation);
    }

    public function update(Request $request, $id)
    {
        $evaluation = affichage::find($id);

        if (!$evaluation) {
            return response()->json(['message' => 'Évaluation non trouvée'], 404);
        }

        $request->validate([
            'type_prestataire_id' => 'required|exists:type_prestataire,id',
            'criteres_id' => 'required|exists:criteres,id',
            'note_id' => 'required|exists:notes,id',
            'années_id' => 'required|exists:années,id',
        ]);

        $evaluation->update([
            'type_prestataire_id' => $request->type_prestataire_id,
            'criteres_id' => $request->criteres_id,
            'note_id' => $request->note_id,
            'années_id' => $request->années_id,
        ]);

        $evaluation->load(['type_Prestataire', 'critere', 'note', 'ANNEE']);

        return response()->json([
            'message' => 'Évaluation mise à jour avec succès',
            'data' => $evaluation
        ]);
    }

    public function destroy($id)
    {
        $evaluation = affichage::find($id);

        if (!$evaluation) {
            return response()->json(['message' => 'Évaluation non trouvée'], 404);
        }

        $evaluation->delete();

        return response()->json(['message' => 'Évaluation supprimée']);
    }
}
