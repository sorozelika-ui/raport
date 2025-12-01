<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PrestataireEvaluationNotification extends Notification
{
    use Queueable;

  use Queueable;

    public $prestataire;
    public $moyenne;
    public $criteres;

    public function __construct($prestataire, $moyenne, $criteres)
    {
        $this->type_prestataire = $prestataire;
        $this->moyenne = $moyenne;
        $this->criteres = $criteres;
    }

    public function via($notifiable)
    {
        return ['mail']; // tu peux ajouter "database"
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject("Résultat de votre évaluation")
            ->greeting("Bonjour " . $this->prestataire->nom)
            ->line("Votre évaluation a été réalisée.")
            ->line("Spécialité : " . $this->prestataire->specialite)
            ->line("Moyenne générale : " . $this->moyenne . "/20")
            ->line("Détails des critères :")
            ->line("-------------------------")
            ->line(collect($this->criteres)->map(function($c){
                return $c['libcrit']." : ".$c['nt']."/20";
            })->implode("\n"))
            ->salutation("Cordialement, Service Evaluation");
    }
}
