<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CritereController;
use App\Http\Controllers\ANNEEController;
use App\Http\Controllers\type_prestatairecontroller;
use App\Http\Controllers\evaluationscontroller;
use App\Http\Controllers\notecontroller;
use App\Http\Controllers\affichagecontroller;

Route::get('/criteres',[CritereController::class,'index']);
Route::get('/criteres/{id}', [CritereController::class,'show']);
Route::post('/criteres',[CritereController::class,'store']);
Route::post('/criteres/{id}', [CritereController::class,'update']);
Route::delete('/criteres/{id}', [CritereController::class,'destroy']);

Route::post('/ANNEE', [AnneeController::class, 'store']);
Route::get('/ANNEE', [AnneeController::class, 'index']);
Route::get('/ANNEE/{id}', [AnneeController::class,'show']);
Route::post('/ANNEE/{id}', [AnneeController::class,'update']);
Route::delete('/ANNEE/{id}', [AnneeController::class,'destroy']);

Route::get('/prestataire', [type_prestatairecontroller::class, 'index']);
Route::post('/prestataire', [type_prestatairecontroller::class, 'store']);
Route::get('/prestataire/{id}', [type_prestatairecontroller::class,'show']);
Route::post('/prestataire/{id}', [type_prestatairecontroller::class,'update']);
Route::delete('/prestataire/{id}', [type_prestatairecontroller::class,'destroy']);

Route::get('/note',[notecontroller::class,'index']);
Route::get('/note/{id}', [notecontroller::class,'show']);
Route::post('/note',[notecontroller::class,'store']);
Route::post('/note/{id}', [notecontroller::class,'update']);
Route::delete('/note/{id}', [notecontroller::class,'destroy']);

Route::get('/evaluer',[affichagecontroller::class,'store']);
Route::get('/evaluer/{id}',[affichagecontroller::class,'show']);
Route::post('/evaluer',[affichagecontroller::class,'index']);
Route::post('/evaluer/{id}',[affichagecontroller::class,'update']);
Route::delete('/evaluer/{id}',[affichagecontroller::class,'destroy']); 



//test api login
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Identifiants incorrects'
        ], 401);
    }

    // Crée un token pour l’authentification
    $token = $user->createToken('api_token')->plainTextToken;

    return response()->json([
        'message' => 'Connexion réussie',
        'user' => $user,
        'token' => $token
    ]);
});

