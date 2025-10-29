<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ANNEE;
class ANNEEController extends Controller
{
  public function index()
    {
        return response()->json(ANNEE::all());
    }
   public function store(Request $request)
    {
      $annee=new ANNEE();
      $annee->liban=$request->input('liban');

      $annee->save();
        
        return response()->json($annee);
    }
    
}