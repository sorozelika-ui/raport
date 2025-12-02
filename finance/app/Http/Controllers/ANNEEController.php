<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\ANNEE;
class ANNEEController extends Controller
{
  public function index()
    {
        /*$query =ANNEE::query();Request $request

        Recherche
        if ($request->has('search') && !empty($request->search)) 
        {
            $search = $request->search;
            $query->where('liban', 'LIKE', "%$search%");   
        }

         //Tri descendante pour avoir le dernier ajout en haut
        $critere = $query->orderBy('id', 'desc')->get();*/

        return response()->json(ANNEE::all());
    }
   public function store(Request $request)
    {
      $annee=new ANNEE();
      $annee->liban=$request->input('liban');

      $annee->save();
        
        return response()->json($annee);
    }
    
    public function show($id)
    {
        $annee =ANNEE::find($id);

        if (!$annee) {
            return response()->json(['message' => 'année non trouvé']);
        }

        return response()->json($annee);
    }

    //  Modifier un note (POST /note/{id})
    public function update(Request $request, $id)
    {
        $annee = ANNEE::find($id);

        if (!$annee) {
            return response()->json(['message' => 'année non trouvé']);
        }

        $validatedData = $request->validate([
            'liban' => 'required|string',
        ]);

        $annee->update($validatedData);

        return response()->json([
            'message' => 'année mis à jour avec succès',
            'data' => $annee
        ]);
    }

    //  Supprimer un note (DELETE /note/{id})
    public function destroy($id)
    {
        $annee = ANNEE::find($id);

        if (!$annee) {
            return response()->json(['message' => 'année non trouvé']);
        }

        $annee->delete();

        return response()->json(['message' => 'année supprimé avec succès']);
    }
    
}