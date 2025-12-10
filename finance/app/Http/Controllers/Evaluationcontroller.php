<?php

/*namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\affichage;
use App\Models\bareme;
use App\Models\note;
use App\Models\type_prestataire;
use App\Models\User;
use App\Notifications\EvaluationReussie;
use Illuminate\Support\Facades\DB;

class EvaluationController extends Controller
{
    
    public function createEvaluation(Request $request)
    {
        $request->validate([
            'type_prestataire_id' => 'required|exists:type_prestataire,id',
            'evaluation_date' => 'required|date',
            'evaluations' => 'required|array',
            'evaluations.*.criteres_id' => 'required|exists:criteres,id',
            'evaluations.*.note_id' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {

            $notes = [];
            $total = 0;
            $count = 0;

            foreach ($request->evaluations as $ev) {

                // Création de la note
                $note = note::create([
                    'type_prestataire_id' => $request->type_prestataire_id,
                    'criteres_id' => $ev['criteres_id'],
                    'note_id' => $ev['note_id'],
                    'moyenne' => $ev['note_id'], // valeur stockée
                    'evaluation_date' => $request->evaluation_date,
                ]);

                $notes[] = $note;

                $total += $ev['note_id'];
                $count++;
            }

            // Moyenne générale
            $moyenneGenerale = $count > 0 ? $total / $count : 0;

            // Mise à jour du prestataire
            $prestataire = type_prestataire::find($request->prestataire_id);
            $prestataire->moyenne_generale = $moyenneGenerale;
            $prestataire->save();

            // 🔔 Envoyer la notification à l’admin (id = 1)
            $admin = User::find(1);
            if ($admin) {
                $admin->notify(new EvaluationReussie($prestataire));
            }

            DB::commit();

            return response()->json([
                'message' => 'Évaluation réussie',
                'moyenne_generale' => $moyenneGenerale,
                'notes' => $notes
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la création de l’évaluation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    
    public function getEvaluations($prestataire_id)
    {
        $notes = note::where('type_prestataire_id', $type_prestataire_id)
            ->with('critere')
            ->orderBy('evaluation_date', 'desc')
            ->get();

        return response()->json($notes);
    }

    
    public function prestatairesEvalues()
    {
        $data = type_prestataire::whereHas('notes')
            ->with('notes.critere')
            ->get();

        return response()->json($data);
    }
}*/


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\affichage;
use App\Models\bareme;
use App\Models\note;
use App\Models\type_prestataire;
use Illuminate\Support\Facades\DB;

class EvaluationController extends Controller
{
    //CREATION DES EVALUATION UTILLISE LA METHODE GET
    public function createEvaluation(Request $request)
    {
        $request->validate([
            'type_prestataire_id' => 'required|exists:type_prestataire,id',
            'annees_id' => 'required|exists:annees,id',
            'evaluations' => 'required|array|min:1',
            'evaluations.*.criteres_id' => 'required|exists:criteres,id',
            'evaluations.*.note_id' => 'required|exists:note,id',
        ]);

        DB::beginTransaction();

        try {
            $created = [];
            $totalNotes = 0;
            $countNotes = 0;

            //  Calcul de la moyenne
            foreach ($request->evaluations as $evalData) {
                $noteModel = note::find($evalData['note_id']);
                if (!$noteModel) {
                    DB::rollBack();
                    return response()->json(['message' => 'Note non trouvée'], 404);
                }

                if (isset($noteModel->nts) && is_numeric($noteModel->nts)) {
                    $totalNotes += floatval($noteModel->nts);
                    $countNotes++;
                }
            }

            $moyenne = $countNotes > 0 ? round($totalNotes / $countNotes, 2) : 0;

            //  Stockage de la moyenne dans chaque note + création de l'affichage
            foreach ($request->evaluations as $evalData) {
                $noteModel = note::find($evalData['note_id']);
                $noteModel->update(['moyenne' => $moyenne]);

                $evaluation = affichage::create([
                    'type_prestataire_id' => $request->type_prestataire_id,
                    'criteres_id' => $evalData['criteres_id'],
                    'note_id' => $evalData['note_id'],
                    'annees_id' => $request->annees_id,
                    'justification' => $evalData['justification'] ?? null,
                ]);

                $evaluation->load(['prestataire', 'critere', 'note', 'annee']);
                $created[] = $evaluation;
            }

            $appreciation = $this->getAppreciationFromBareme($moyenne);

            DB::commit();

            return response()->json([
                'message' => 'Évaluation enregistrée avec succès',
                'evaluations' => $created,
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

    //afficher toute les evaluations enregistrées
    public function index()
    {
        $evaluations = affichage::with(['prestataire', 'critere', 'note', 'annee'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($evaluations);
    }

    //modification
    public function show($id)
    {
        $evaluation = affichage::with(['prestataire', 'critere', 'note', 'annee'])
            ->find($id);

        if (!$evaluation) {
            return response()->json(['message' => 'Évaluation non trouvée'], 404);
        }

        return response()->json($evaluation);
    }

    //suppression
    public function destroy($id)
    {
        $evaluation = affichage::find($id);

        if (!$evaluation) {
            return response()->json(['message' => 'Évaluation non trouvée'], 404);
        }

        $evaluation->delete();

        return response()->json(['message' => 'Évaluation supprimée']);
    }

    //prestataaire evalues:liste
    public function prestatairesEvalues()
    {
        $evaluations = affichage::with(['prestataire', 'critere', 'note', 'annee'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($evaluations);
    }

    //afficher les prestataire dans la consultation des resultats
    public function getByPrestataires($id)
    {
        $prestataire = type_prestataire::find($id);

        if (!$prestataire) {
            return response()->json([
                "message" => "Prestataire introuvable"
            ], 404);
        }

        $evaluations = affichage::with(['critere', 'note', 'annee'])
            ->where("type_prestataire_id", $id)
            ->get();

        if ($evaluations->isEmpty()) {
            return response()->json([
                "prestataire" => $prestataire,
                "evaluations" => [],
                "moyenne" => 0,
                "appreciation" => "Aucune",
            ]);
        }

        $total = 0;
        $count = 0;

        foreach ($evaluations as $eval) {
            if ($eval->note && is_numeric($eval->note->nts)) {
                $total += floatval($eval->note->nts);
                $count++;
            }
        }

        $moyenne = $count > 0 ? round($total / $count, 2) : 0;
        $appreciation = $this->getAppreciationFromBareme($moyenne);

        return response()->json([
            "prestataire" => $prestataire,
            "evaluations" => $evaluations,
            "moyenne" => $moyenne,
            "appreciation" => $appreciation,
            "nombre_criteres" => $count
        ]);
    }

    //utiliser le bareme 
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
}

