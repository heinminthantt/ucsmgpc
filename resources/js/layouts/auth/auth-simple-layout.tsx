import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6">
            <div className="w-full max-w-sm">
                <div className="mb-6 text-center">
                    <Link href={home()} className="text-base font-semibold text-foreground">
                        UCSM Project Catalog
                    </Link>
                    {title && <h1 className="mt-4 text-xl font-semibold text-foreground">{title}</h1>}
                    {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
                </div>
                <div className="rounded-xl border border-border bg-card px-6 py-6">{children}</div>
            </div>
        </div>
    );
}
