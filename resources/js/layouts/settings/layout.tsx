import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    { title: 'Profile', href: edit(), icon: null },
    { title: 'Security', href: editSecurity(), icon: null },
    { title: 'Appearance', href: editAppearance(), icon: null },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
                <p className="mt-2 text-sm text-muted-foreground">Manage your profile and account settings</p>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row">
                <aside className="w-full shrink-0 lg:w-48">
                    <nav className="flex flex-col gap-0.5" aria-label="Settings">
                        {sidebarNavItems.map((item, index) => (
                            <Link
                                key={`${toUrl(item.href)}-${index}`}
                                href={item.href}
                                className={cn(
                                    'rounded-md px-3 py-2 text-sm transition-colors',
                                    isCurrentOrParentUrl(item.href)
                                        ? 'bg-card font-medium text-foreground'
                                        : 'text-muted-foreground hover:bg-card hover:text-foreground',
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <div className="min-w-0 flex-1">
                    <section className="max-w-xl space-y-10">{children}</section>
                </div>
            </div>
        </div>
    );
}
