import { Icon } from '@iconify/react';
import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button, Checkbox, Input, Label, Spinner } from '@/components/ui';
import { useT } from '@/i18n';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const t = useT();
    const [remember, setRemember] = useState(false);

    return (
        <>
            <Head title="Log in" />
            <PasskeyVerify />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        {status && (
                            <div
                                role="status"
                                className="rounded-sm bg-emerald-600/10 border border-emerald-600/30 px-4 py-3 text-sm text-emerald-600 flex items-center gap-2"
                            >
                                <Icon icon="mdi:check-circle-outline" className="shrink-0" />
                                {status}
                            </div>
                        )}

                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t('auth.email')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                    className="focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                                <InputError id="email-error" message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">{t('auth.password')}</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs italic text-muted-foreground hover:text-primary transition-colors"
                                            tabIndex={5}
                                        >
                                            {t('auth.forgot')}
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    aria-invalid={!!errors.password}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Checkbox 
                                    id="remember-ui" 
                                    tabIndex={3} 
                                    checked={remember}
                                    onCheckedChange={(c) => setRemember(c === true)}
                                />
                                {remember && <input type="hidden" name="remember" value="on" />}
                                <Label htmlFor="remember-ui" className="text-sm font-normal cursor-pointer">
                                    Remember me
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full gap-2"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing ? <Spinner /> : <Icon icon="mdi:login-variant" className="text-base" />}
                                {processing ? 'Signing in…' : t('auth.log_in')}
                            </Button>
                        </div>

                        {/* Ruled separator with centered glyph — editorial touch */}
                        <div className="relative text-center" aria-hidden="true">
                            <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
                            <span className="relative bg-background px-3 text-muted-foreground/60 text-xs"></span>
                        </div>

                        <p className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <TextLink
                                href={register()}
                                tabIndex={6}
                                className="text-primary hover:underline underline-offset-4 font-medium"
                            >
                                Sign up free
                            </TextLink>
                        </p>
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Welcome back',
    description: 'Log in to your Project Catalog account',
};
