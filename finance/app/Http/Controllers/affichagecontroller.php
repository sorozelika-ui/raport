<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\affichage;
use App\Models\ANNEE;
use App\Models\Critere;
use App\Models\type_prestataire;
use App\Models\bareme;
use App\Models\note;

class affichagecontroller extends Controller


{
    // ===================== STORE =====================
    public function store()
    {
        $evaluations = affichage::with([
            'type_prestataire',
            'critere',
            'note',
            'annee'
        ])->get();

        $Regrouper = $evaluations->groupBy(function ($item) {
            return $item->type_prestataire_id . '-' . $item->années_id;
        });

        $resultats = $Regrouper->map(function ($items) {
            $prestataire = $items->first()->type_prestataire;
            $annee = $items->first()->ANNEE;

            $evaluationsList = $items->map(function ($evalu) {
                return [
                    'critere' => $evalu->critere->libcrit,
                    'note' => floatval($evalu->note->nt),
                ];
            });

            $moyenne = $evaluationsList->avg('note');
            $appreciation = $this->calculerAppreciation($moyenne);

            return [
                'id' => $items->first()->id,
                'type_prestataire' => $prestataire->nom,
                'specialite' => $prestataire->specialite,
                'annees' => $annee->liban,
                'evaluations' => $evaluationsList,
                'moyenne' => round($moyenne, 2),
                'appreciation' => $appreciation,
            ];
        })->values();

        return response()->json($resultats);
    }

    // ===================== INDEX =====================
     public function index(Request $request)
    {
        $validated = $request->validate([
            'type_prestataire_id' => 'required|exists:type_prestataire,id',
            'années_id' => 'required|exists:années,id',
            'evaluations' => 'required|array|min:1',
            'evaluations.*.criteres_id' => 'required|exists:criteres,id',
            'evaluations.*.note_id' => 'required|exists:note,id',
        ]);

        $total = 0;
        $count = count($validated['evaluations']);
        $details = [];

        foreach ($validated['evaluations'] as $evalu) {
            $note = note::find($evalu['note_id']);
            $critere = Critere::find($evalu['criteres_id']);

            $total += (float) $note->nt;

            $details[] = [
                'critere' => $critere->libcrit,
                'note' => (float) $note->nt,
            ];

            affichage::create([
                'type_prestataire_id' => $validated['type_prestataire_id'],
                'criteres_id' => $evalu['criteres_id'],
                'note_id' => $evalu['note_id'],
                'années_id' => $validated['années_id'],
            ]);
        }

        $moyenne = round($total / $count, 2);
        $appreciation = $this->calculerAppreciation($moyenne);

        $prestataire = type_prestataire::find($validated['type_prestataire_id']);
        $annee = ANNEE::find($validated['années_id']);

        return response()->json([
            'type_prestataire' => $prestataire->nom,
            'specialite' => $prestataire->specialite,
            'annees' => $annee->liban,
            'evaluations' => $details,
            'moyenne' => $moyenne,
            'appreciation' => $appreciation,
        ]);
    }

    // ===================== MÉTHODE DÉDIÉE =====================
    private function calculerAppreciation($moyenne)
    {
        if ($moyenne < 10) {
            return 'Faible';
        } elseif ($moyenne >= 10 && $moyenne < 15) {
            return 'Bon';
        } elseif ($moyenne >= 15 && $moyenne < 18) {
            return 'Très Bon';
        } else {
            return 'Excellent';
        }
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

    
            return response()->json(['message' => 'Évaluation non trouvée '],);

        $evaluation->delete();

        return response()->json(['message' => 'Évaluation supprimée avec succès ']);
    }
    
}
