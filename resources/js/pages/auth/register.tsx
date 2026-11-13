import { Icon } from '@iconify/react';
import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button, Input, Label, Spinner } from '@/components/ui';
import { useT } from '@/i18n';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    const t = useT();

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
                                <Label htmlFor="name">{t('auth.full_name')}</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    placeholder={t('auth.placeholder_name')}
                                    aria-invalid={!!errors.name}
                                    className="focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">{t('auth.email')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    aria-invalid={!!errors.email}
                                    className="focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">{t('auth.password')}</Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    placeholder={t('auth.placeholder_password')}
                                    passwordrules={passwordRules}
                                    aria-invalid={!!errors.password}
                                />
                                <p className="text-xs italic text-muted-foreground/80">
                                    {t('auth.password_hint')}
                                </p>
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">{t('auth.confirm_password')}</Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    placeholder={t('auth.placeholder_repeat')}
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
                                {processing ? t('auth.creating') : t('auth.register')}
                            </Button>
                        </div>

                        {/* Ruled separator with centered glyph */}
                        <div className="relative text-center" aria-hidden="true">
                            <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
                            <span className="relative bg-background px-3 text-[8px] text-gold">◆</span>
                        </div>

                        <p className="text-center text-sm text-muted-foreground">
                            {t('auth.already_account')}{' '}
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="text-primary hover:underline underline-offset-4 font-medium"
                            >
                                {t('auth.log_in')}
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
