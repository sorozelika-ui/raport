<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CritereController;
use App\Http\Controllers\ANNEEController;
use App\Http\Controllers\type_prestatairecontroller;
use App\Http\Controllers\evaluationscontroller;
use App\Http\Controllers\notecontroller;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\AuthController;

// Routes d'authentification
Route::post('/inscription', [AuthController::class, 'inscription']);
Route::post("/login", [AuthController::class, "login"]);
Route::post('/logout', [AuthController::class, 'logout']);

// route des criteres 
Route::get('/criteres',[CritereController::class,'index']);
Route::get('/criteres/{id}', [CritereController::class,'show']);
Route::post('/criteres',[CritereController::class,'store']);
Route::put('/criteres/{id}', [CritereController::class,'update']);
Route::delete('/criteres/{id}', [CritereController::class,'destroy']);

//route des années 
Route::post('/ANNEE', [AnneeController::class, 'store']);
Route::get('/ANNEE', [AnneeController::class, 'index']);
Route::get('/ANNEE/{id}', [AnneeController::class,'show']);
Route::put('/ANNEE/{id}', [AnneeController::class,'update']);
Route::delete('/ANNEE/{id}', [AnneeController::class,'destroy']);

//route des prestataires

Route::get('/prestataires/{id}/evolution', [type_prestatairecontroller::class, 'evolution']);
Route::get('/prestataire', [type_prestatairecontroller::class, 'index']);
Route::post('/prestataire', [type_prestatairecontroller::class, 'store']);
Route::get('/prestataire/{id}', [type_prestatairecontroller::class,'show']);
Route::put('/prestataire/{id}', [type_prestatairecontroller::class,'update']);
Route::delete('/prestataire/{id}', [type_prestatairecontroller::class,'destroy']);

//route des notes
Route::get('/note',[notecontroller::class,'index']);
Route::get('/note/{id}', [notecontroller::class,'show']);
Route::post('/note',[notecontroller::class,'store']);
Route::put('/note/{id}', [notecontroller::class,'update']);
Route::delete('/note/{id}', [notecontroller::class,'destroy']);

// Récupérer les critères en fonction d'un prestataire et d'une année
Route::get('/criteres/{typePrestataireId}/{anneeId}', [EvaluationController::class, 'getCriteres']);

// Enregistrer une évaluation (nouvelle API)
Route::post('/evaluations/create',[EvaluationController::class, 'createEvaluation']);

Route::get('/evaluations/initial',[EvaluationController::class,'initialData']);
Route::get('/criteres-by-prestataire/{prestataire}/{annee?}',[EvaluationController::class,'criteresByPrestataire']);
//Route::get('/prestataires-evalues', [EvaluationController::class, 'prestatairesAvecMoyenne']);

//informations pour les prestataires evalués
Route::get('/prestataires-evalues', [EvaluationController::class, 'prestatairesEvalues']);

// consulter les resultats

Route::get('/evaluations/prestataire/{id}', [EvaluationController::class, 'getByPrestataires']);




/*Route::middleware('auth:sanctum')->group(function () {

    // Routes accessibles uniquement par ADMIN
    Route::middleware('check.admin')->group(function () {
        Route::get('/evaluateurs', [EvaluateurController::class, 'index']);
        Route::get('/prestataires-evalues', [EvaluateurController::class, 'index']);
    });

}); */