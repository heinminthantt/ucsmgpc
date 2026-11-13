import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    Bookmark,
    CalendarRange,
    ClipboardCheck,
    FileText,
    FolderOpen,
    LayoutGrid,
    LogOut,
    Menu,
    Plus,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { LanguageSwitcher } from '@/components/language-switcher';
import {
    Sheet,
    SheetContent,
    SheetTitle,
} from '@/components/ui/sheet';
import { useMe, useUnreadCount } from '@/hooks/useCatalog';
import { useT } from '@/i18n';
import { cn } from '@/lib/utils';
import { logout } from '@/routes';
import type { AppLayoutProps } from '@/types';

type NavEntry = { label: string; href: string; icon: React.ElementType };
type NavGroup = { label: string; items: NavEntry[] };

export default function AppSidebarLayout({ children }: AppLayoutProps) {
    const { data: user } = useMe();
    const { data: unread } = useUnreadCount();
    const page = usePage();
    const t = useT();
    const [mobileOpen, setMobileOpen] = useState(false);

    const role = (user?.role ?? '').toString().toUpperCase();
    const isStaff = role === 'SUPERVISOR' || role === 'ADMIN' || role === 'DEPARTMENT_ADMIN';
    const isAdmin = role === 'ADMIN';
    const isDeptAdmin = role === 'DEPARTMENT_ADMIN' || role === 'ADMIN';

    const groups: NavGroup[] = [
        {
            label: t('nav.group_catalog'),
            items: [{ label: t('nav.projects'), href: '/projects', icon: FolderOpen }],
        },
        ...(user
            ? [{
                  label: t('nav.group_workspace'),
                  items: [
                      { label: t('nav.dashboard'), href: '/dashboard', icon: LayoutGrid },
                      { label: t('nav.my_project'), href: '/projects/my', icon: FileText },
                      { label: t('nav.new_project'), href: '/projects/create', icon: Plus },
                      { label: t('nav.saved'), href: '/saved-projects', icon: Bookmark },
                  ],
              }]
            : []),
        ...(isStaff
            ? [{
                  label: t('nav.group_admin'),
                  items: [
                      ...(isStaff ? [{ label: t('nav.supervisor'), href: '/supervisor-dashboard', icon: ClipboardCheck }] : []),
                      ...(role === 'SUPERVISOR' ? [{ label: t('nav.examiner'), href: '/examiner', icon: ClipboardCheck }] : []),
                      ...(isDeptAdmin ? [{ label: t('nav.department'), href: '/department', icon: CalendarRange }] : []),
                      ...(isDeptAdmin ? [{ label: t('nav.audit_log'), href: '/audit-log', icon: FileText }] : []),
                      ...(isAdmin ? [{ label: t('nav.admin'), href: '/admin-dashboard', icon: ShieldCheck }] : []),
                  ],
              }]
            : []),
    ].filter((group) => group.items.length > 0);

    const currentUrl = page.url.split('?')[0];
    const activeHref = groups
        .flatMap((group) => group.items)
        .filter((item) => currentUrl === item.href || currentUrl.startsWith(item.href + '/'))
        .sort((a, b) => b.href.length - a.href.length)[0]?.href;

    const initials = user?.name?.trim().charAt(0).toUpperCase() ?? '?';

    const brand = (onNavigate?: () => void) => (
        <Link href={user ? '/dashboard' : '/'} onClick={onNavigate} className="flex items-center gap-3">
            <AppLogoIcon className="size-11 shrink-0 object-contain" />
            <span className="min-w-0">
                <span className="font-display block text-[17px] leading-none font-semibold tracking-wide text-white">
                    UCSMGY
                </span>
                <span className="mt-1 block truncate text-[9px] leading-none font-medium tracking-[0.2em] text-sidebar-foreground/55 uppercase">
                    Project Catalog
                </span>
            </span>
        </Link>
    );

    const navList = (onNavigate?: () => void) => (
        <nav className="flex flex-col gap-6">
            {groups.map((group) => (
                <div key={group.label}>
                    <p className="mb-2 px-3 text-[10px] font-medium tracking-[0.22em] text-sidebar-foreground/35 uppercase">
                        {group.label}
                    </p>
                    <div className="flex flex-col gap-0.5">
                        {group.items.map((item) => {
                            const active = item.href === activeHref;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onNavigate}
                                    aria-current={active ? 'page' : undefined}
                                    className={cn(
                                        'group relative flex items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors',
                                        active
                                            ? 'bg-white/[0.08] font-medium text-white'
                                            : 'text-sidebar-foreground/75 hover:bg-white/[0.05] hover:text-white',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'absolute top-1/2 left-0 h-5 w-px -translate-y-1/2 rounded-full bg-sidebar-primary transition-opacity',
                                            active ? 'opacity-100' : 'opacity-0',
                                        )}
                                    />
                                    <item.icon className={cn('size-4 shrink-0', active ? 'text-sidebar-primary' : 'text-sidebar-foreground/45 group-hover:text-sidebar-primary')} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );

    const footer = (onNavigate?: () => void) => (
        <div className="border-t border-white/10 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
                <LanguageSwitcher tone="dark" />
                <Link
                    href="/notifications"
                    onClick={onNavigate}
                    aria-label={t('nav.notifications')}
                    className="relative rounded-full border border-white/10 bg-white/5 p-2 text-sidebar-foreground/70 transition-colors hover:text-white"
                >
                    <Bell className="size-4" />
                    {(unread?.count ?? 0) > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-sidebar-primary px-1 text-[9px] font-semibold text-sidebar-primary-foreground">
                            {(unread?.count ?? 0) > 9 ? '9+' : unread?.count}
                        </span>
                    )}
                </Link>
            </div>

            {user ? (
                <div className="flex items-center gap-3 rounded-lg bg-white/[0.06] p-3">
                    <Link href="/profile" onClick={onNavigate} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/15 text-sm font-semibold text-sidebar-primary">
                        {initials}
                    </Link>
                    <Link href="/profile" onClick={onNavigate} className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-white">{user.name}</p>
                        <p className="truncate text-[11px] text-sidebar-foreground/50">{user.email}</p>
                    </Link>
                    <Link
                        href={logout()}
                        method="post"
                        as="button"
                        aria-label="Log out"
                        className="rounded-md p-1.5 text-sidebar-foreground/55 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <LogOut className="size-4" />
                    </Link>
                </div>
            ) : (
                <div className="flex gap-2">
                    <Link
                        href="/login"
                        onClick={onNavigate}
                        className="flex-1 rounded-md border border-white/15 px-3 py-2 text-center text-[13px] text-sidebar-foreground transition-colors hover:bg-white/10"
                    >
                        {t('nav.sign_in')}
                    </Link>
                    <Link
                        href="/register"
                        onClick={onNavigate}
                        className="flex-1 rounded-md bg-sidebar-primary px-3 py-2 text-center text-[13px] font-medium text-sidebar-primary-foreground transition-opacity hover:opacity-90"
                    >
                        {t('nav.register')}
                    </Link>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-svh bg-background text-foreground">
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col bg-sidebar text-sidebar-foreground lg:flex">
                <div className="border-b border-white/10 px-6 py-6">{brand()}</div>
                <div className="flex-1 overflow-y-auto px-3 py-6">{navList()}</div>
                {footer()}
            </aside>

            {/* Mobile top bar */}
            <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur lg:hidden">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2.5">
                        <AppLogoIcon className="size-9 shrink-0 object-contain" />
                        <span>
                            <span className="font-display block text-[15px] leading-none font-semibold">UCSMGY</span>
                            <span className="mt-0.5 block text-[9px] tracking-[0.18em] text-muted-foreground uppercase">
                                Project Catalog
                            </span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-1">
                        <Link
                            href="/notifications"
                            aria-label={t('nav.notifications')}
                            className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                            <Bell className="size-5" />
                            {(unread?.count ?? 0) > 0 && (
                                <span className="absolute top-1 right-1 size-2 rounded-full bg-gold ring-2 ring-background" />
                            )}
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            className="rounded-full p-2 text-foreground hover:bg-muted"
                            aria-label={t('nav.menu')}
                        >
                            <Menu className="size-5" />
                        </button>
                    </div>
                </div>
            </header>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent side="left" className="w-[300px] max-w-[86vw] gap-0 border-none bg-sidebar p-0 text-sidebar-foreground">
                    <SheetTitle className="sr-only">{t('nav.menu')}</SheetTitle>
                    <div className="border-b border-white/10 px-5 py-5">{brand(() => setMobileOpen(false))}</div>
                    <div className="flex-1 overflow-y-auto px-3 py-5">
                        {navList(() => setMobileOpen(false))}
                    </div>
                    {footer(() => setMobileOpen(false))}
                </SheetContent>
            </Sheet>

            <main className="animate-page-enter lg:pl-[272px]">{children}</main>
        </div>
    );
}
