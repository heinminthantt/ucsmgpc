import { Link } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import type { PropsWithChildren } from 'react';
import { Button, Separator, Heading, Text } from 'journal-ds';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="mx-auto max-w-5xl px-6 lg:px-8 py-12">
            <div className="mb-8">
                <Heading level="h1" className="text-3xl text-journal-ink">Settings</Heading>
                <Text variant="muted" className="mt-1">Manage your profile and account settings</Text>
            </div>

            <Separator className="mb-8" />

            <div className="flex flex-col lg:flex-row lg:gap-12">
                <aside className="w-full max-w-xl lg:w-52 shrink-0">
                    <nav
                        className="flex flex-col gap-1"
                        aria-label="Settings"
                    >
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${toUrl(item.href)}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start font-serif', {
                                    'bg-journal-warm/40 text-journal-burgundy': isCurrentOrParentUrl(item.href),
                                })}
                            >
                                <Link href={item.href}>
                                    {item.icon && (
                                        <item.icon className="h-4 w-4" />
                                    )}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
