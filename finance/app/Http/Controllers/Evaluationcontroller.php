<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\affichage;
use App\Models\bareme;
use App\Models\note;
use Illuminate\Support\Facades\DB;

class EvaluationController extends Controller
{
    
     //Créer une évaluation complète
    
    public function createEvaluation(Request $request)
    {
        $request->validate([
            'type_prestataire_id' => 'required|exists:type_prestataire,id',
            'annees_id' => 'required|exists:annees,id',
            'evaluations' => 'required|array|min:1',
            'evaluations.*.critere_id' => 'required|exists:criteres,id',
            'evaluations.*.note_id' => 'required|exists:notes,id',
        ]);

        DB::beginTransaction();

        try {
            $evaluations = [];
            $totalNotes = 0;
            $countNotes = 0;

            // Créer chaque évaluation
            foreach ($request->evaluations as $evalData) {
                // Récupérer la note
                $note = note::find($evalData['note_id']);
                
                if (!$note) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Note non trouvée'
                    ], 404);
                }

                // Créer l'évaluation
                $evaluation = Affichage::create([
                    'type_prestataire_id' => $request->type_prestataire_id,
                    'criteres_id' => $evalData['critere_id'],
                    'note_id' => $evalData['note_id'],
                    'annees_id' => $request->annees_id,
                ]);

                // Charger les relations
                $evaluation->load(['prestataire', 'critere', 'note', 'annee']);
                $evaluations[] = $evaluation;

                // Calculer la somme des notes
                $totalNotes += floatval($note->nt);
                $countNotes++;
            }

            // Calculer la moyenne
            $moyenne = $countNotes > 0 ? round($totalNotes / $countNotes, 2) : 0;

            // Récupérer l'appréciation depuis le barème
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

    /**
     * Récupérer l'appréciation depuis le barème
     */
    private function getAppreciationFromBareme($moyenne)
    {
        try {
            // Chercher dans la table baremes
            $bareme = bareme::where('nin_note', '<=', $moyenne)
                            ->where('max_note', '>=', $moyenne)
                            ->first();

            if ($bareme) {
                return $bareme->appreciation;
            }

            // Si pas de barème trouvé, utiliser des valeurs par défaut
            if ($moyenne >= 16) return "Excellent";
            if ($moyenne >= 14) return "Très Bien";
            if ($moyenne >= 12) return "Bien";
            if ($moyenne >= 10) return "Passable";
            if ($moyenne >= 5) return "Insuffisant";
            return "Très Insuffisant";

        } catch (\Exception $e) {
            // En cas d'erreur, retourner une appréciation par défaut
            if ($moyenne >= 16) return "Excellent";
            if ($moyenne >= 14) return "Très Bien";
            if ($moyenne >= 12) return "Bien";
            if ($moyenne >= 10) return "Passable";
            if ($moyenne >= 5) return "Insuffisant";
            return "Très Insuffisant";
        }
    }

    /**
     * Récupérer toutes les évaluations
     */
    public function index()
    {
        $evaluations = affichage::with(['prestataire', 'critere', 'note', 'annee'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($evaluations);
    }

    /**
     * Récupérer une évaluation
     */
    public function show($id)
    {
        $evaluation = affichage::with(['prestataire', 'critere', 'note', 'annee'])
            ->find($id);

        if (!$evaluation) {
            return response()->json(['message' => 'Évaluation non trouvée'], 404);
        }

        return response()->json($evaluation);
    }

    /**
     * Supprimer une évaluation
     */
    public function destroy($id)
    {
        $evaluation = affichage::find($id);

        if (!$evaluation) {
            return response()->json(['message' => 'Évaluation non trouvée'], 404);
        }

        $evaluation->delete();

        return response()->json(['message' => 'Évaluation supprimée']);
    }

    /**
     * Récupérer les évaluations d'un prestataire
     */
    public function getByPrestataire(Request $request, $prestataireId)
    {
        $query = affichage::with(['prestataire', 'critere', 'note', 'annee'])
            ->where('type_prestataire_id', $prestataireId);

        if ($request->has('annee_id') && !empty($request->annee_id)) {
            $query->where('annees_id', $request->annee_id);
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


/*
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\type_prestataire; // ou TypePrestataire selon ton modele exact
use App\Models\ANNEE;
use App\Models\critere;
use App\Models\note;
use App\Models\bareme;
use App\Models\affichage; // ton modèle qui pointe table 'evaluations'
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class EvaluationController extends Controller
{
    // Renvoie prestataires, annees, notes, criteres (tous)
    public function initialData()
    {
        $prestataires = type_prestataire::select('id','nom','specialite')->orderBy('nom')->get();
        $annees = ANNEE::select('id','liban')->orderBy('liban','desc')->get();
        $notes = note::select('id','nt')->orderBy('nt','desc')->get();
        $criteres = critere::select('id','libcrit')->orderBy('libcrit')->get();

        return response()->json([
            'prestataire' => $prestataires,
            'années' => $annees,
            'notes' => $notes,
            'criteres' => $criteres,
        ]);
    }

    // Optionnel : critères filtrés par prestataire et année si tu as logique métier
    public function criteresByPrestataire($prestataireId, $anneeId = null)
    {
        // Si tu as une table qui relie certain critères à un type de prestataire / année,
        // applique le filtre ici. Sinon renvoie simplement tous les critères.
        $criteres = critere::select('id','libcrit')
            ->orderBy('libcrit')
            ->get();

        return response()->json($criteres);
    }

    // Enregistrement des evaluations (array of {critere_id, note_id, justification?})
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type_prestataire_id' => 'required|exists:type_prestataire,id',
            'années_id' => 'required|exists:années,id',
            'evaluations' => 'required|array|min:1',
            'evaluations.*.critere_id' => 'required|exists:criteres,id',
            'evaluations.*.note_id' => 'required|exists:note,id',
            'evaluations.*.justification' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message'=>'Validation failed','errors'=>$validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            // On enregistre une ligne par critere dans la table evaluations (Affichage model)
            $savedIds = [];
            foreach ($request->evaluations as $ev) {
                $row = affichage::create([
                    'type_prestataire_id' => $request->type_prestataire_id,
                    'criteres_id' => $ev['critere_id'],
                    'note_id' => $ev['note_id'],
                    'années_id' => $request->annees_id,
                    // si tu as une colonne justification, ajoute-la ici (ex: 'justification' => $ev['justification'] ?? null)
                ]);
                $savedIds[] = $row->id;
            }

            // Recalcul : récupérer les notes (nt) liées à ces enregistrements pour calculer la moyenne
            $records = affichage::with(['note','critere'])
                ->whereIn('id', $savedIds)
                ->get();

            // Calcul moyenne (note->nt)
            $moyenne = $records->avg(function($r){ return $r->note ? floatval($r->note->nt) : 0; });

            // Trouver appreciation via table bareme (nin_note <= moyenne <= max_note)
            $bareme = bareme::where('nin_note', '<=', $moyenne)
                             ->where('max_note', '>=', $moyenne)
                             ->first();

            $appreciation = $bareme ? $bareme->appreciation : null;

            DB::commit();

            // Construire la réponse : prestataire info + liste des critères+note + moyenne + appreciation
            $prest = type_prestataire::find($request->type_prestataire_id);

            $evaluationsResp = $records->map(function($r){
                return [
                    'critere_id' => $r->criteres_id,
                    'critere' => $r->critere ? $r->critere->libcrit : null,
                    'note_id' => $r->note_id,
                    'note' => $r->note ? $r->note->nt : null,
                ];
            });

            return response()->json([
                'message' => 'Évaluations enregistrées',
                'prestataire' => [
                    'id' => $prest->id,
                    'nom' => $prest->nom,
                    'specialite' => $prest->specialite,
                ],
                'evaluations' => $evaluationsResp,
                'moyenne' => round($moyenne,2),
                'appreciation' => $appreciation,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message'=>'Erreur interne','error'=>$e->getMessage()], 500);
        }
    }

    // (Optionnel) Endpoint pour renvoyer tableau récapitulatif (prestataire, criteres, notes, moyenne, appreciation)
    public function summary()
    {
        // Exemple : regrouper par prestataire et année, puis calcul
        $rows = affichage::with(['type_Prestataire','critere','note','ANNEE'])->get();

        $grouped = $rows->groupBy(function($r){
            return $r->type_prestataire_id . '|' . $r->années_id;
        });

        $result = [];
        foreach ($grouped as $key => $items) {
            $first = $items->first();
            $prest = $first->type_Prestataire;
            $annee = $first->ANNEE;

            $evaluations = $items->map(function($i){
                return [
                    'critere' => $i->critere ? $i->critere->libcrit : null,
                    'note' => $i->note ? $i->note->nt : null
                ];
            });

            $moy = $items->avg(function($i){ return $i->note ? floatval($i->note->nt) : 0; });

            $bareme = bareme::where('nin_note','<=',$moy)->where('max_note','>=',$moy)->first();

            $result[] = [
                'prestataire' => $prest ? ['id'=>$prest->id,'nom'=>$prest->nom,'specialite'=>$prest->specialite] : null,
                'annee' => $annee ? $annee->liban : null,
                'evaluations' => $evaluations,
                'moyenne' => round($moy,2),
                'appreciation' => $bareme ? $bareme->appreciation : null,
            ];
        }

        return response()->json($result);
    }
}*/
