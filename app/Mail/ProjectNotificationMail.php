<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Email copy of an in-app project notification (spec section 8).
 * Queued wherever App\Services\ProjectLifecycle creates a
 * ProjectNotification row, to the same recipient.
 */
class ProjectNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $projectTitle,
        public string $messageText,
        public ?string $actorName,
        public string $notificationType,
        public string $projectUrl,
        public ?string $reason = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'UCSMGY Project Catalog: '.$this->projectTitle,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.project-notification',
        );
    }
}
