<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CritereController;
use App\Http\Controllers\ANNEEController;
use App\Http\Controllers\type_prestatairecontroller;
Route::get('/criteres',[CritereController::class,'index']);
Route::post('/criteres',[CritereController::class,'store']);


Route::post('/ANNEE', [AnneeController::class, 'store']);
Route::get('/ANNEE', [AnneeController::class, 'index']);

Route::post('/prestataire', [type_prestatairecontroller::class, 'store']);
Route::get('/prestataire', [type_prestatairecontroller::class, 'index']);