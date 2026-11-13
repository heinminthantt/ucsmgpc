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
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">Manage your profile and account settings</p>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row">
                <aside className="w-full shrink-0 lg:w-48">
                    <nav className="flex flex-col gap-0.5" aria-label="Settings">
                        {sidebarNavItems.map((item, index) => (
                            <Link
                                key={`${toUrl(item.href)}-${index}`}
                                href={item.href}
                                className={cn(
                                    'rounded-lg px-2.5 py-1.5 text-sm',
                                    isCurrentOrParentUrl(item.href)
                                        ? 'bg-stone-200/70 font-medium text-stone-900 dark:bg-stone-800 dark:text-stone-50'
                                        : 'text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800/60 dark:hover:text-stone-50',
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
