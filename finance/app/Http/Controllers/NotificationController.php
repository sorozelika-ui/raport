<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    // Envoyer des notifications
    public function send(Request $request)
    {
        $request->validate([
            'prestataire_ids' => 'required|array',
            'prestataire_ids.*' => 'exists:type_prestataire,id',
            'titre' => 'required|string',
            'message' => 'required|string',
            'type' => 'required|in:evaluation,alerte,info',
            'annee' => 'required|integer',
        ]);

        $notifications = [];

        foreach ($request->prestataire_ids as $prestataireId) {
            $notification = Notification::create([
                'type_prestataire_id' => $prestataireId,
                'titre' => $request->titre,
                'message' => $request->message,
                'type' => $request->type,
                'annee' => $request->annee,
                'details' => $request->details,
            ]);

            $notifications[] = $notification;
        }

        return response()->json([
            'message' => 'Notifications envoyées avec succès',
            'count' => count($notifications),
            'notifications' => $notifications
        ], 201);
    }

    // Récupérer les notifications d'un prestataire
    public function getByPrestataire($prestataireId)
    {
        $notifications = Notification::where('type_prestataire_id', $prestataireId)
            ->orderBy('created_at', 'desc')
            ->get();

        $nonLues = $notifications->where('lu', false)->count();

        return response()->json([
            'notifications' => $notifications,
            'non_lues' => $nonLues,
            'total' => $notifications->count()
        ]);
    }

    // Marquer comme lu
    public function reads($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json(['message' => 'Notification non trouvée'], 404);
        }

        $notification->update(['lu' => true]);

        return response()->json([
            'message' => 'Notification marquée comme lue',
            'notification' => $notification
        ]);
    }

    // Marquer toutes comme lues
    public function AsRead($prestataireId)
    {
        Notification::where('type_prestataire_id', $prestataireId)
            ->update(['lu' => true]);

        return response()->json(['message' => 'Toutes les notifications marquées comme lues']);
    }
}