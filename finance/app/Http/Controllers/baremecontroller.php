<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class baremecontroller extends Controller
{
     public function index()
    {
        return response()->json(bareme::all());
    }
   public function store(Request $request)
    {
      $annee=new bareme();
      $annee->liban=$request->input('liban');

      $annee->save();
        
        return response()->json($annee);
    }
    
    public function show($id)
    {
        $annee = bareme::find($id);

        if (!$annee) {
            return response()->json(['message' => 'année non trouvé']);
        }

        return response()->json($annee);
    }

    //  Modifier un note (POST /note/{id})
    public function update(Request $request, $id)
    {
        $annee =  bareme::find($id);

        if (!$annee) {
            return response()->json(['message' => 'bareme non trouvé']);
        }

        $validatedData = $request->validate([
            'liban' => 'required|string',
        ]);

        $annee->update($validatedData);

        return response()->json([
            'message' => 'bareme mis à jour avec succès',
            'data' => $annee
        ]);
    }

    //  Supprimer un note (DELETE /note/{id})
    public function destroy($id)
    {
        $annee = bareme::find($id);

        if (!$annee) {
            return response()->json(['message' => 'bareme non trouvé']);
        }

        $annee->delete();

        return response()->json(['message' => 'bareme supprimé avec succès']);
    }
    
}
