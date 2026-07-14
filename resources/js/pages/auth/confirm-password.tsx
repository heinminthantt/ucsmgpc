import { Form, Head } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import { Button, Label, Spinner } from 'journal-ds';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirm password" />

            {/* Secure-area notice — reinforces context before the form */}
            <div
                className="mb-6 flex items-center gap-3 rounded-sm border border-journal-rule bg-journal-warm/15 px-4 py-3"
                role="note"
            >
                <Icon icon="mdi:shield-lock-outline" className="text-journal-burgundy text-xl shrink-0" aria-hidden="true" />
                <p className="text-xs font-serif text-journal-sepia leading-relaxed">
                    You are entering a secure area. Please re-confirm your identity to continue.
                </p>
            </div>

            <PasskeyVerify
                routes={{
                    options: confirmOptions(),
                    submit: confirmStore(),
                }}
                label="Confirm with passkey"
                loadingLabel="Confirming..."
                separator="Or confirm with password"
            />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                autoFocus
                                aria-invalid={!!errors.password}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <Button
                            className="w-full gap-2"
                            disabled={processing}
                            data-test="confirm-password-button"
                        >
                            {processing ? <Spinner /> : <Icon icon="mdi:check-decagram-outline" className="text-base" />}
                            {processing ? 'Confirming…' : 'Confirm password'}
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Confirm password',
    description:
        'This is a secure area of the application. Please confirm your password before continuing.',
};