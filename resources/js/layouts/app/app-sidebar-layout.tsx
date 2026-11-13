import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    Bookmark,
    FolderOpen,
    LayoutGrid,
    LogOut,
    Plus,
    Settings,
    ShieldCheck,
    ClipboardCheck,
    CalendarRange,
    FileText,
    UserRound,
} from 'lucide-react';
import { useState } from 'react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useMe, useUnreadCount } from '@/hooks/useCatalog';
import { useT } from '@/i18n';
import { cn } from '@/lib/utils';
import { logout } from '@/routes';
import type { AppLayoutProps } from '@/types';

type NavEntry = { label: string; href: string; icon: React.ElementType };

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

    const nav: NavEntry[] = [
        { label: t('nav.projects'), href: '/projects', icon: FolderOpen },
        ...(user
            ? [
                  { label: t('nav.dashboard'), href: '/dashboard', icon: LayoutGrid },
                  { label: t('nav.my_project'), href: '/projects/my', icon: FileText },
                  { label: t('nav.new_project'), href: '/projects/create', icon: Plus },
                  { label: t('nav.saved'), href: '/saved-projects', icon: Bookmark },
              ]
            : []),
        ...(isStaff
            ? [{ label: t('nav.supervisor'), href: '/supervisor-dashboard', icon: ClipboardCheck }]
            : []),
        ...(role === 'SUPERVISOR'
            ? [{ label: t('nav.examiner'), href: '/examiner', icon: ClipboardCheck }]
            : []),
        ...(isDeptAdmin
            ? [{ label: t('nav.department'), href: '/department', icon: CalendarRange }]
            : []),
        ...(isDeptAdmin
            ? [{ label: t('nav.audit_log'), href: '/audit-log', icon: FileText }]
            : []),
        ...(isAdmin
            ? [{ label: t('nav.admin'), href: '/admin-dashboard', icon: ShieldCheck }]
            : []),
    ];

    const isActive = (href: string) =>
        page.url === href || (href !== '/' && page.url.startsWith(href + '/')) || (href === '/projects' && page.url === '/projects');

    const navList = (onNavigate?: () => void) => (
        <nav className="flex flex-col gap-0.5">
            {nav.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                        'flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors',
                        isActive(item.href)
                            ? 'bg-stone-200/70 font-medium text-stone-900 dark:bg-stone-800 dark:text-stone-50'
                            : 'text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800/60 dark:hover:text-stone-50',
                    )}
                >
                    <item.icon className="size-4 shrink-0" />
                    {item.label}
                </Link>
            ))}
        </nav>
    );

    const userBlock = (
        <div className="border-t border-border pt-3">
            {user ? (
                <div className="flex flex-col gap-0.5">
                    <Link
                        href="/notifications"
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800/60 dark:hover:text-stone-50"
                    >
                        <Bell className="size-4 shrink-0" />
                        {t('nav.notifications')}
                        {(unread?.count ?? 0) > 0 && (
                            <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                                {unread!.count > 9 ? '9+' : unread!.count}
                            </span>
                        )}
                    </Link>
                    <Link
                        href="/profile"
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800/60 dark:hover:text-stone-50"
                    >
                        <UserRound className="size-4 shrink-0" />
                        {t('nav.profile')}
                    </Link>
                    <Link
                        href="/settings/profile"
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-stone-600 hover:bg-stone-200/50 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800/60 dark:hover:text-stone-50"
                    >
                        <Settings className="size-4 shrink-0" />
                        {t('nav.settings')}
                    </Link>
                    <div className="mt-2 flex items-center gap-2.5 px-2.5">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-stone-200 text-xs font-medium text-stone-700 dark:bg-stone-700 dark:text-stone-200">
                            {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-medium text-stone-900 dark:text-stone-50">{user.name}</p>
                            <p className="truncate text-xs text-stone-500">{user.email}</p>
                        </div>
                        <Link
                            href={logout()}
                            method="post"
                            as="button"
                            className="shrink-0 rounded-md p-1.5 text-stone-500 hover:bg-stone-200/60 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-stone-50"
                            title="Log out"
                        >
                            <LogOut className="size-4" />
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="flex gap-2 px-1">
                    <Link
                        href="/login"
                        className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-center text-sm text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800"
                    >
                        {t('nav.sign_in')}
                    </Link>
                    <Link
                        href="/register"
                        className="flex-1 rounded-lg bg-primary px-3 py-1.5 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        {t('nav.register')}
                    </Link>
                </div>
            )}
            <div className="px-2.5 pt-3">
                <LanguageSwitcher />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-background px-3 py-4 md:flex">
                <Link href="/" className="px-2.5 pb-4">
                    <span className="text-[15px] font-semibold text-stone-900 dark:text-stone-50">UCSM Project Catalog</span>
                    <span className="block text-xs font-normal text-stone-500">{t('app.tagline')}</span>
                </Link>
                <div className="flex-1 overflow-y-auto">{navList()}</div>
                {userBlock}
            </aside>

            {/* Mobile top bar */}
            <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur md:hidden">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link href="/" className="text-[15px] font-semibold">UCSM Project Catalog</Link>
                    <button
                        type="button"
                        onClick={() => setMobileOpen((v) => !v)}
                        className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm"
                        aria-label="Toggle menu"
                    >
                        Menu
                    </button>
                </div>
                {mobileOpen && (
                    <div className="border-t border-border px-4 py-3">
                        {navList(() => setMobileOpen(false))}
                        <div className="mt-3">{userBlock}</div>
                    </div>
                )}
            </header>

            <main className="animate-page-enter md:pl-60">
                <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
            </main>
        </div>
    );
}
