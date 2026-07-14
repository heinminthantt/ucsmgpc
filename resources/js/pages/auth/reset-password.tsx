import { Form, Head } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button, Input, Label, Spinner } from 'journal-ds';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head title="Reset password" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Icon
                                    icon="mdi:lock-outline"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-journal-sepia/60 text-sm"
                                    aria-hidden="true"
                                />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    readOnly
                                    className="opacity-60 bg-journal-warm/20 pr-9"
                                />
                            </div>
                            <p className="text-xs font-serif italic text-journal-sepia/80">
                                Resetting the password for this account.
                            </p>
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                autoFocus
                                placeholder="New password"
                                passwordrules={passwordRules}
                                aria-invalid={!!errors.password}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm password</Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                placeholder="Confirm password"
                                passwordrules={passwordRules}
                                aria-invalid={!!errors.password_confirmation}
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button
                            type="submit"
                            className="w-full gap-2 mt-1"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing ? <Spinner /> : <Icon icon="mdi:key-variant" className="text-base" />}
                            {processing ? 'Resetting…' : 'Reset password'}
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Reset password',
    description: 'Please enter your new password below',
};
