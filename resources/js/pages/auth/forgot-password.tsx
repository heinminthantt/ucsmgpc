import { Icon } from '@iconify/react';
import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button, Input, Label, Spinner } from '@/components/ui';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot password" />

            {status && (
                <div
                    role="status"
                    className="mb-6 rounded-sm bg-emerald-600/10 border border-emerald-600/30 px-4 py-3 text-sm text-emerald-600 flex items-center gap-2 justify-center text-center"
                >
                    <Icon icon="mdi:check-circle-outline" className="shrink-0" />
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="email@example.com"
                                    aria-invalid={!!errors.email}
                                    className="focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                                <p className="text-xs italic text-muted-foreground/80">
                                    We&apos;ll send a secure reset link to this address.
                                </p>
                                <InputError message={errors.email} />
                            </div>

                            <Button
                                type="submit"
                                className="w-full gap-2"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing ? <Spinner /> : <Icon icon="mdi:email-fast-outline" className="text-base" />}
                                {processing ? 'Sending…' : 'Email password reset link'}
                            </Button>
                        </div>
                    )}
                </Form>

                {/* Ruled separator with centered glyph */}
                <div className="relative text-center" aria-hidden="true">
                    <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
                    <span className="relative bg-background px-3 text-muted-foreground/60 text-xs"></span>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                    Or, return to{' '}
                    <TextLink
                        href={login()}
                        className="text-primary hover:underline underline-offset-4 font-medium"
                    >
                        log in
                    </TextLink>
                </p>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Forgot password',
    description: 'Enter your email to receive a password reset link',
};
