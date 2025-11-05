<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\affichage;
class affichagecontroller extends Controller


{
    public function index()
    {
            $evaluations = affichage::with(['type_Prestataire', 'critere', 'note', 'annee'])->get();

    $resultats = $evaluations->map(function ($note) {
        return [
            'id' => $note->id,
            'prestataire' => $note->type_Prestataire->nom ?? 'Inconnu',
            'specialite' => $note->type_Prestataire->specialite ?? '—',
            'critere' => $note->critere->libcrit ?? '—',
            'note' => $note->note->nt ?? '—',
            'annee' => $note->annee->liban ?? '—',
        ];
    });

    return response()->json($resultats);
}

    public function store(Request $request)
    { 
         $validated = $request->validate([
            'type_prestataire_id' => 'required|exists:type_prestataire,id',
            'années_id' => 'required|exists:années,id',
            'evaluations' => 'required|array|min:1|max:20',
            'evaluations.*.criteres_id' => 'required|exists:criteres,id',
            'evaluations.*.note_id' => 'required|exists:note,id',
        ]);

        $results = [];

        foreach ($validated['evaluations'] as $evaluationData) {
            $evaluation = affichage::create([
                'type_prestataire_id' => $validated['type_prestataire_id'],
                'criteres_id' => $evaluationData['criteres_id'],
                'note_id' => $evaluationData['note_id'],
                'années_id' => $validated['années_id'],
            ]);

            $results[] = [
                'prestataire' => Type_Prestataire::find($evaluation->type_prestataire_id)->nom ?? 'Inconnu',
                'specialite' => Type_Prestataire::find($evaluation->type_prestataire_id)->specialite ?? '',
                'critere' => Critere::find($evaluation->criteres_id)->libcrit ?? '',
                'note' => note::find($evaluation->note_id)->nt ?? '',
                'annee' => ANNEE::find($evaluation->années_id)->liban ?? '',
                'critere' => Critere::find($evaluation->criteres_id)->libcrit ?? '',
                'note' => note::find($evaluation->note_id)->nt ?? '',
                'annee' => ANNEE::find($evaluation->années_id)->liban ?? '',
            ];
        }

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
        $evaluation = affichage::with(['type_prestataire', 'criteres', 'note', 'années'])->find($id);

        if (!$evaluation) {
            return response()->json(['message' => 'Évaluation non trouvée ']);
        }

        return response()->json($evaluation);
    }

    //Modifier une évaluation
    public function update(Request $request, $id)
    {
        $evaluation = affichage::find($id);

        if (!$evaluation) {
            return response()->json(['message' => 'Évaluation non trouvée ']);
        }

        $validated = $request->validate([
            'type_prestataire_id' => 'required|exists:type_prestataire,id',
            'criteres_id' => 'required|exists:criteres,id',
            'note_id' => 'required|exists:note,id',
            'années_id' => 'required|exists:années,id',
        ]);

        $evaluation->update($validated);

        return response()->json([
            'message' => 'Évaluation mise à jour avec succès ',
            'data' => $evaluation
        ]);
    }

    //  Supprimer une évaluation
    public function destroy($id)
    {
        $evaluation = affichage::find($id);

        if (!$evaluation) {
            return response()->json(['message' => 'Évaluation non trouvée '],);
        }

        $evaluation->delete();

        return response()->json(['message' => 'Évaluation supprimée avec succès ']);
    }
    
}
