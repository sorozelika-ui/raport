<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\affichage;
use App\Models\bareme;
use App\Models\note;
use Illuminate\Support\Facades\DB;

class EvaluationController extends Controller
{
    public function createEvaluation(Request $request)
    {
        // Validation
        $request->validate([
            'type_prestataire_id' => 'required|exists:type_prestataire,id',
            'annees_id' => 'required|exists:annees,id',
            'evaluations' => 'required|array|min:1',
            'evaluations.*.criteres_id' => 'required|exists:criteres,id',
            'evaluations.*.note_id' => 'required|exists:note,id',
        ]);

        DB::beginTransaction();

        try {
            $evaluations = [];
            $totalNotes = 0;

            foreach ($request->evaluations as $evalData) {

                $note = note::find($evalData['note_id']);

                if (!$note) {
                    DB::rollBack();
                    return response()->json(['message' => 'Note non trouvée'], 404);
                }

                $evaluation = affichage::create([
                    'type_prestataire_id' => $request->type_prestataire_id,
                    'criteres_id' => $evalData['criteres_id'],
                    'note_id' => $evalData['note_id'],
                    'annees_id' => $request->annees_id,
                ]);

                $evaluation->load(['prestataire', 'critere', 'note', 'annee']);
                $evaluations[] = $evaluation;

                $totalNotes += floatval($note->nt);
            }

            $countNotes = count($evaluations);
            $moyenne = $countNotes > 0 ? round($totalNotes / $countNotes, 2) : 0;

            $appreciation = $this->getAppreciationFromBareme($moyenne);

            DB::commit();

            return response()->json([
                'message' => 'Évaluation enregistrée avec succès',
                'evaluations' => $evaluations,
                'moyenne' => $moyenne,
                'appreciation_systeme' => $appreciation,
                'nombre_criteres' => $countNotes,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de l\'enregistrement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function getAppreciationFromBareme($moyenne)
    {
        $bareme = bareme::where('nin_note', '<=', $moyenne)
                         ->where('max_note', '>=', $moyenne)
                         ->first();

        if ($bareme) return $bareme->appreciation;

        if ($moyenne >= 16) return "Excellent";
        if ($moyenne >= 14) return "Très Bien";
        if ($moyenne >= 12) return "Bien";
        if ($moyenne >= 10) return "Passable";
        if ($moyenne >= 5) return "Insuffisant";
        
        return "Très Insuffisant";
    }

    public function index()
    {
        $evaluations = affichage::with(['prestataire', 'critere', 'note', 'annee'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($evaluations);
    }

    public function show($id)
    {
        $evaluation = affichage::with(['prestataire', 'critere', 'note', 'annee'])
            ->find($id);

        if (!$evaluation) {
            return response()->json(['message' => 'Évaluation non trouvée'], 404);
        }

        return response()->json($evaluation);
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

    public function getByPrestataire(Request $request, $prestataireId)
    {
        $query = affichage::with(['prestataire', 'critere', 'note', 'annee'])
            ->where('type_prestataire_id', $prestataireId);

        if ($request->has('annees_id') && !empty($request->annees_id)) {
            $query->where('annees_id', $request->annees_id);
        }

        $evaluations = $query->orderBy('id', 'desc')->get();

        $moyenne = 0;
        if ($evaluations->count() > 0) {
            $totalNotes = $evaluations->sum(function ($eval) {
                return $eval->note ? floatval($eval->note->nt) : 0;
            });
            $moyenne = $totalNotes / $evaluations->count();
        }

        return response()->json([
            'evaluations' => $evaluations,
            'moyenne' => round($moyenne, 2),
            'total' => $evaluations->count()
        ]);
    }
}
