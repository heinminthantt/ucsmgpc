<?php

namespace App\Mail;

use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Invite activation email for a CSV-imported account (spec WF2).
 * Carries the activation link with the plain (unhashed) token.
 */
class UserInviteMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $invitedUser,
        public string $activationUrl,
        public CarbonInterface $expiresAt,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Activate your UCSM Project Catalog account',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.user-invite',
        );
    }
}
