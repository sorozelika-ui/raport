<?php
use App\Models\type_prestataire;
use App\Models\critere;
use App\Models\note;
use App\Models\affichage;
//use App\http\Controllers\EvaluController;

class EvaluController extends Controller{
public function store(Request $request)
{
    // 1. Récupérer prestataire et critères
    $prestataire = type_prestataire ::findOrFail($request->type_prestataire_id);

    $criteres = [];
    $total = 0;

    foreach ($request->evaluations as $e) {
        $critere = critere::find($e['criteres_id']);
        $note = note::find($e['note_id']);

        affichage::create([
            'type_prestataire_id' => $prestataire->id,
            'criteres_id' => $critere->id,
            'note_id' => $note->id,
            'années_id' => $request->annees_id,
        ]);

        $criteres[] = [
            "libcrit" => $critere->libcrit,
            "nt" => $note->nt
        ];

        $total += $note->nt;
    }

    // 2. Calcul moyenne
    $moyenne = round($total / count($criteres), 2);

    // 3. Envoyer la notification
    $prestataire->notify(new PrestataireEvaluationNotification(
        $prestataire,
        $moyenne,
        $criteres
    ));

    return response()->json([
        "message" => "Evaluation enregistrée et notification envoyée",
        "moyenne" => $moyenne,
        "prestataire" => $prestataire,
        "criteres" => $criteres
    ]);
}
}
?>