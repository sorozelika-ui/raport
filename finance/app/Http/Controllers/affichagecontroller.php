<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\affichage;
use App\Models\bareme;
use App\Models\note;
use App\Models\critere;

class affichageController extends Controller
{
    // Récupérer les critères selon type + année
    public function getCriteres()
    {
        // On suppose que chaque critère est associé à un type de prestataire pour l'année
    $criteres = criteres::all(); // ou filtrer selon tes règles si tu as une table pivot
    return response()->json($criteres);

        /*$criteres = critere::whereIn('id', function ($query) use ($typePrestataireId, $anneeId) {
            $query->select('criteres_id')
                  ->from('evaluations')
                  ->where('type_prestataire_id', $typePrestataireId)
                  ->where('années_id', $anneeId);
        })->get();

        return response()->json($criteres);*/
    }

    // Enregistrement
    public function store(Request $request)
    {

                $request->validate([
        'type_prestataire_id' => 'required',
        'annees_id' => 'required',
        'notes' => 'required|array'
    ]);

    $total = 0;
    $count = 0;

    foreach ($request->notes as $item) {
        $critereId = $item['criteres_id'];
        $noteId = $item['note_id'];

        $noteObj = note::find($noteId);

        if (!$noteObj) {
            return response()->json(['error' => "Note invalide"], 422);
        }

        if ($noteObj->nt < 5 && empty($item['justification'])) {
            return response()->json([
                'error' => 'Justification obligatoire pour les notes < 5'
            ], 422);
        }

        affichage::create([
            'type_prestataire_id' => $request->type_prestataire_id,
            'criteres_id'  => $critereId,
            'note_id'      => $noteId,
            'années_id'    => $request->annees_id,
            'justification' => $item['justification'] ?? null
        ]);

        $total += $noteObj->nt;
        $count++;
    }

    $moyenne = $total / $count;

    // Trouver appréciation via barème
    $bareme = bareme::where('nin_note', '<=', $moyenne)
                    ->where('max_note', '>=', $moyenne)
                    ->first();

    return response()->json([
        'message' => 'Évaluation enregistrée',
        'moyenne' => round($moyenne, 2),
        'appréciation_système' => $bareme->appreciation ?? "Non définie"
    ]);
    
       /* $request->validate([
            'type_prestataire_id' => 'required',
            'annees_id' => 'required',
            'notes' => 'required|array'
        ]);

        $total = 0;
        $count = 0;

        foreach ($request->notes as $critereId => $data) {

            $noteId = $data['note_id'];
            $noteObj = note::find($noteId);

            if (!$noteObj) {
                return response()->json(['error' => "Note invalide"], 422);
            }

            // Si nt < 5
            if ($noteObj->nt < 5 && empty($data['justification'])) {
                return response()->json([
                    'error' => 'Justification obligatoire pour les notes < 5'
                ], 422);
            }

            // Enregistrement
            affichage::create([
                'type_prestataire_id' => $request->type_prestataire_id,
                'criteres_id'  => $critereId,
                'note_id'      => $noteId,
                'années_id'    => $request->annees_id,
                'justification' => $data['justification'] ?? null
            ]);

            $total += $noteObj->nt;
            $count++;
        }

        $moyenne = $total / $count;

        // Trouver appréciation via barème
        $bareme = bareme::where('nin_note', '<=', $moyenne)
                        ->where('max_note', '>=', $moyenne)
                        ->first();

        return response()->json([
            'message' => 'Évaluation enregistrée',
            'moyenne' => round($moyenne, 2),
            'appréciation_système' => $bareme->appreciation ?? "Non définie"
        ]);*/
    }
}
