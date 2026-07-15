import { Link, router } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { useMe, useUnreadCount } from '@/hooks/useCatalog';
import { useAppearance } from '@/hooks/use-appearance';
import { Button, Avatar, AvatarFallback, AvatarImage } from 'journal-ds';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { dashboard, login, register } from '@/routes';

export function CatalogNavbar() {
    const { data: user } = useMe();
    const { data: unread } = useUnreadCount();
    const { appearance, updateAppearance } = useAppearance();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { label: 'Projects', href: '/projects', icon: 'mdi:folder-multiple-outline' },
        ...(user
            ? [
                  { label: 'Dashboard', href: '/dashboard', icon: 'mdi:view-dashboard-outline' },
                  { label: 'Saved', href: '/saved-projects', icon: 'mdi:bookmark-outline' },
                  { label: 'Create', href: '/projects/create', icon: 'mdi:plus-circle-outline' },
              ]
            : []),
        ...(user?.role === 'SUPERVISOR' || user?.role === 'ADMIN'
            ? [{ label: 'Supervisor', href: '/supervisor-dashboard', icon: 'mdi:clipboard-check-outline' }]
            : []),
        ...(user?.role === 'ADMIN'
            ? [{ label: 'Admin', href: '/admin-dashboard', icon: 'mdi:shield-crown-outline' }]
            : []),
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-journal-rule backdrop-blur-md" style={{ backgroundColor: 'color-mix(in srgb, var(--journal-paper) 95%, transparent)' }}>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <span className="font-display font-bold text-lg text-journal-burgundy tracking-tight">
                        Project Catalog
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-0.5 md:flex">
                    {navLinks.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="flex items-center gap-1.5 rounded-sm px-3.5 py-2 font-serif text-sm text-journal-ink-light transition-colors hover:bg-journal-warm/40 hover:text-journal-burgundy"
                        >
                            <Icon icon={l.icon} className="text-base" />
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Right actions */}
                <div className="flex items-center gap-1.5">
                    {/* Theme toggle removed */}

                    {user ? (
                        <>
                            {/* Notifications */}
                            <Link
                                href="/notifications"
                                className="relative rounded-sm p-2 text-journal-sepia hover:bg-journal-warm/40 hover:text-journal-burgundy transition-colors"
                            >
                                <Icon icon="mdi:bell-outline" className="text-lg" />
                                {(unread?.count ?? 0) > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-journal-burgundy text-[10px] font-bold text-journal-paper">
                                        {unread!.count > 9 ? '9+' : unread!.count}
                                    </span>
                                )}
                            </Link>

                            {/* Profile */}
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 rounded-sm px-3 py-1.5 font-serif text-sm text-journal-ink-light hover:bg-journal-warm/40 hover:text-journal-burgundy transition-colors"
                            >
                                <Avatar className="h-7 w-7">
                                    {user.avatar_url ? (
                                        <AvatarImage src={user.avatar_url} alt={user.name} className="object-cover" />
                                    ) : (
                                        <AvatarFallback className="text-xs font-bold bg-journal-burgundy text-journal-paper">
                                            {user.name[0].toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <span className="hidden sm:block">{user.name}</span>
                            </Link>

                            {/* Logout */}
                            <button
                                onClick={() => router.post('/logout')}
                                className="rounded-sm p-2 text-journal-sepia hover:bg-journal-warm/40 hover:text-journal-burgundy transition-colors"
                                aria-label="Logout"
                            >
                                <Icon icon="mdi:logout" className="text-lg" />
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href={login()}>
                                <Button variant="ghost" size="sm" className="font-serif">Log in</Button>
                            </Link>
                            <Link href={register()}>
                                <Button size="sm" className="font-serif">Sign up</Button>
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <button
                        className="rounded-sm p-2 text-journal-sepia hover:bg-journal-warm/40 md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        <Icon icon={mobileOpen ? 'mdi:close' : 'mdi:menu'} className="text-xl" />
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="border-t border-journal-rule bg-journal-paper px-6 py-4 md:hidden">
                    <nav className="flex flex-col gap-1">
                        {navLinks.map((l) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 rounded-sm px-3.5 py-2.5 font-serif text-sm text-journal-ink-light hover:bg-journal-warm/40 hover:text-journal-burgundy transition-colors"
                            >
                                <Icon icon={l.icon} className="text-base" />
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
