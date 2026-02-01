<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    /**
     * Envoie un email de réinitialisation de mot de passe
     * POST /api/forgot-password
     */
    public function forgotPassword(Request $request)
    {
        // Validation
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ], [
            'email.required' => 'L\'adresse email est requise',
            'email.email' => 'Veuillez fournir une adresse email valide',
            'email.exists' => 'Aucun compte n\'est associé à cette adresse email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        // Générer un token unique
        $token = Str::random(64);

        // Supprimer les anciens tokens pour cet email
        DB::table('password_resets')->where('email', $request->email)->delete();

        // Créer un nouveau token dans la table password_resets
        DB::table('password_resets')->insert([
            'email' => $request->email,
            'token' => Hash::make($token), // Hash du token pour la sécurité
            'created_at' => Carbon::now(),
        ]);

        // Récupérer l'utilisateur
        $user = User::where('email', $request->email)->first();

        // Envoyer l'email
        try {
            Mail::send('emails.reset-password', ['token' => $token, 'user' => $user], function ($message) use ($request) {
                $message->to($request->email);
                $message->subject('Réinitialisation de votre mot de passe - DGBF-PERFORM');
            });

            return response()->json([
                'success' => true,
                'message' => 'Un email de réinitialisation a été envoyé à votre adresse',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi de l\'email: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Réinitialise le mot de passe avec le token
     * POST /api/reset-password
     */
    public function resetPassword(Request $request)
    {
        // Validation
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'password' => 'required|min:5|confirmed',
        ], [
            'token.required' => 'Le token de réinitialisation est manquant',
            'password.required' => 'Le mot de passe est requis',
            'password.min' => 'Le mot de passe doit contenir au moins 5 caractères',
            'password.confirmed' => 'Les mots de passe ne correspondent pas',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        // Récupérer tous les tokens de réinitialisation
        $passwordResets = DB::table('password_resets')->get();

        $tokenFound = false;
        $email = null;

        // Vérifier le token (car il est hashé dans la BDD)
        foreach ($passwordResets as $reset) {
            if (Hash::check($request->token, $reset->token)) {
                // Vérifier que le token n'a pas expiré (1 heure)
                $createdAt = Carbon::parse($reset->created_at);
                if ($createdAt->addHour()->isPast()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Ce lien de réinitialisation a expiré. Veuillez en demander un nouveau.',
                    ], 422);
                }

                $tokenFound = true;
                $email = $reset->email;
                break;
            }
        }

        if (!$tokenFound) {
            return response()->json([
                'success' => false,
                'message' => 'Ce lien de réinitialisation est invalide ou a expiré.',
            ], 422);
        }

        // Trouver l'utilisateur
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur introuvable',
            ], 404);
        }

        // Mettre à jour le mot de passe
        $user->password = Hash::make($request->password);
        $user->save();

        // Supprimer le token utilisé
        DB::table('password_resets')->where('email', $email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Votre mot de passe a été réinitialisé avec succès',
        ], 200);
    }
}