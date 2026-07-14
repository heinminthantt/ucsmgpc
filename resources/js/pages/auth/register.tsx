import { Form, Head } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button, Input, Label, Spinner } from 'journal-ds';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Create account" />

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    placeholder="Your name"
                                    aria-invalid={!!errors.name}
                                    className="focus:border-journal-burgundy focus:ring-1 focus:ring-journal-burgundy"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    aria-invalid={!!errors.email}
                                    className="focus:border-journal-burgundy focus:ring-1 focus:ring-journal-burgundy"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    placeholder="Min. 8 characters"
                                    passwordrules={passwordRules}
                                    aria-invalid={!!errors.password}
                                />
                                <p className="text-xs font-serif italic text-journal-sepia/80">
                                    Use at least 8 characters with a mix of letters and numbers.
                                </p>
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    placeholder="Repeat password"
                                    passwordrules={passwordRules}
                                    aria-invalid={!!errors.password_confirmation}
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                type="submit"
                                className="w-full gap-2"
                                tabIndex={5}
                                disabled={processing}
                                data-test="register-user-button"
                            >
                                {processing ? <Spinner /> : <Icon icon="mdi:account-plus-outline" className="text-base" />}
                                {processing ? 'Creating account…' : 'Create account'}
                            </Button>
                        </div>

                        {/* Ruled separator with centered glyph */}
                        <div className="relative text-center" aria-hidden="true">
                            <span className="absolute inset-x-0 top-1/2 h-px bg-journal-rule" />
                            <span className="relative bg-background px-3 text-journal-sepia/60 text-xs">❦</span>
                        </div>

                        <p className="text-center font-serif text-sm text-journal-sepia">
                            Already have an account?{' '}
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="text-journal-burgundy hover:underline underline-offset-4 font-medium"
                            >
                                Log in
                            </TextLink>
                        </p>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create your account',
    description: 'Join Project Catalog and share your work',
};
