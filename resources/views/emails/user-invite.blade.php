Hello {{ $invitedUser->name }},

An account was created for you on the UCSMGY Project Catalog, the project
system for the University of Computer Studies, Magway.

Activate your account and set your password here:
{{ $activationUrl }}

This link expires on {{ $expiresAt->format('d M Y, H:i') }} and can be
used once. If it expires, ask your department admin to send a new invite.

If you were not expecting this email, you can ignore it.
