<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\type_prestataire;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // Inscription
    public function inscription(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:type_prestataire,email',
            'telephone' => 'required|string|max:20',
            'specialite' => 'required|string|max:255',
            'addresse' => 'required|string|max:255',
            'passwordd' => 'required|string|min:6',
        ]);

        $prestataire = type_prestataire::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'specialite' => $request->specialite,
            'addresse' => $request->addresse,
            'passwordd' => $request->passwordd, // ← Hash important !
        ]);

        return response()->json([
            'message' => 'Inscription réussie',
            'user' => [
                'id' => $prestataire->id,
                'nom' => $prestataire->nom,
                'email' => $prestataire->email,
                'telephone' => $prestataire->telephone,
                'specialite' => $prestataire->specialite,
                'addresse' => $prestataire->addresse,
            ]
        ], 201);
    }

    // Connexion
    
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'passwordd' => 'required',
        ]);

        // Rechercher le prestataire
        $prestataire = type_prestataire::where('email', $request->email)->first();

        // Vérifier
        if (!$prestataire || $request->passwordd !== $prestataire->passwordd) {
    return response()->json([
        'message' => 'Email ou mot de passe incorrect'
    ], 401);
}

        // Token
        $token = Str::random(500);

        return response()->json([
            'message' => 'Connexion réussie',
            'token' => $token,
            'user' => [
                'id' => $prestataire->id,
                'nom' => $prestataire->nom,
                'email' => $prestataire->email,
                'telephone' => $prestataire->telephone,
                'specialite' => $prestataire->specialite,
                'addresse' => $prestataire->addresse,
            ]
        ], 200);
    }

    public function logout(Request $request)
    {
        return response()->json(['message' => 'Déconnexion réussie'], 200);
    }
}