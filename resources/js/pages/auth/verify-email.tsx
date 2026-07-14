import { Form, Head } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import TextLink from '@/components/text-link';
import { Button, Spinner } from 'journal-ds';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Email verification" />

            {/* Illustrative envelope mark — anchors the empty state */}
            <div className="mb-6 flex justify-center" aria-hidden="true">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-journal-burgundy/10 border border-journal-burgundy/20">
                    <Icon icon="mdi:email-seal-outline" className="text-3xl text-journal-burgundy" />
                </div>
            </div>

            {status === 'verification-link-sent' && (
                <div
                    role="status"
                    className="mb-6 rounded-sm bg-journal-forest/10 border border-journal-forest/30 px-4 py-3 text-sm font-serif text-journal-forest text-center flex items-center gap-2 justify-center"
                >
                    <Icon icon="mdi:check-circle-outline" className="shrink-0" />
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary" className="gap-2">
                            {processing ? <Spinner /> : <Icon icon="mdi:email-sync-outline" className="text-base" />}
                            {processing ? 'Sending…' : 'Resend verification email'}
                        </Button>

                        <p className="text-xs font-serif italic text-journal-sepia/70">
                            Didn&apos;t receive it? Check your spam folder before resending.
                        </p>

                        <TextLink
                            href={logout()}
                            className="mx-auto block font-serif text-sm text-journal-sepia hover:text-journal-burgundy transition-colors underline-offset-4 hover:underline"
                        >
                            Log out
                        </TextLink>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Email verification',
    description:
        'Please verify your email address by clicking on the link we just emailed to you.',
};
