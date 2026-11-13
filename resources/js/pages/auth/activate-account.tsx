import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button, Label } from '@/components/ui';

type Props = {
    token: string;
    email?: string | null;
    name?: string | null;
    invalidReason?: string | null;
};

export default function ActivateAccount({ token, email, name, invalidReason }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        password: string;
        password_confirmation: string;
        // Server-side error key when the invite token itself is unusable.
        token?: string;
    }>({
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/invite/activate/${token}`);
    };

    return (
        <>
            <Head title="Activate your account" />

            {invalidReason ? (
                <div className="grid gap-4 text-center">
                    <h1 className="text-lg font-semibold text-foreground">This link can't be used</h1>
                    <p className="text-sm text-muted-foreground">{invalidReason}</p>
                    <a href="/login" className="text-sm font-medium text-primary hover:underline">
                        Go to sign in
                    </a>
                </div>
            ) : (
                <form onSubmit={submit} className="grid gap-5">
                    <div className="grid gap-1 text-center">
                        <h1 className="text-lg font-semibold text-foreground">Activate your account</h1>
                        <p className="text-sm text-muted-foreground">
                            {name ? `Welcome, ${name}. ` : ''}Set a password for {email} to finish
                            setting up your UCSMGY Project Catalog account.
                        </p>
                    </div>

                    <InputError message={errors.token} />

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <PasswordInput
                            id="password"
                            name="password"
                            autoComplete="new-password"
                            autoFocus
                            placeholder="New password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
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
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            aria-invalid={!!errors.password_confirmation}
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-1 w-full" disabled={processing}>
                        Activate account
                    </Button>
                </form>
            )}
        </>
    );
}
