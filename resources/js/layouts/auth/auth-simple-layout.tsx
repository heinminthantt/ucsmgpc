import { Link } from '@inertiajs/react';
import { Check, ArrowLeft } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useT } from '@/i18n';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    const t = useT();

    return (
        <div className="grid min-h-svh bg-background text-foreground lg:grid-cols-[1.05fr_1fr]">
            {/* Institutional panel */}
            <aside className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-12 text-sidebar-foreground lg:flex">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,color-mix(in_srgb,var(--gold)_22%,transparent),transparent_48%),radial-gradient(circle_at_85%_90%,color-mix(in_srgb,var(--gold)_10%,transparent),transparent_45%)]"
                />
                <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-1/3 size-[28rem] rounded-full border border-white/5" />
                <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-1/3 size-[20rem] rounded-full border border-white/5" />

                <Link href={home()} className="relative flex items-center gap-3">
                    <AppLogoIcon className="size-11 shrink-0 object-contain" />
                    <span>
                        <span className="font-display block text-lg leading-none text-white">UCSMGY</span>
                        <span className="mt-1 block text-[9px] tracking-[0.2em] text-sidebar-foreground/50 uppercase">
                            Project Catalog
                        </span>
                    </span>
                </Link>

                <div className="relative max-w-md">
                    <p className="flex items-center gap-3 text-[10px] font-medium tracking-[0.22em] text-sidebar-primary uppercase">
                        <span className="h-px w-8 bg-sidebar-primary" />
                        {t('app.tagline')}
                    </p>
                    <h2 className="font-display mt-6 text-4xl leading-[1.15] text-white">
                        {t('auth.panel_title')}
                    </h2>
                    <p className="mt-4 text-[13px] leading-relaxed text-sidebar-foreground/60">
                        {t('auth.panel_desc')}
                    </p>
                    <ul className="mt-8 space-y-3">
                        {['welcome.search_title', 'welcome.workflow_title', 'welcome.feedback_title'].map((key) => (
                            <li key={key} className="flex items-center gap-3 text-[13px] text-sidebar-foreground/75">
                                <span className="flex size-5 items-center justify-center rounded-full border border-sidebar-primary/30 text-sidebar-primary">
                                    <Check className="size-3" />
                                </span>
                                {t(key)}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative text-[11px] text-sidebar-foreground/40">
                    © {new Date().getFullYear()} {t('app.tagline')}
                </p>
            </aside>

            {/* Form panel */}
            <div className="flex min-h-svh flex-col">
                <div className="flex items-center justify-between px-5 py-4 sm:px-8">
                    <Link href={home()} className="flex items-center gap-2.5 lg:invisible">
                        <AppLogoIcon className="size-8 shrink-0 object-contain" />
                        <span className="font-display text-[15px] font-semibold">UCSMGY</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href={home()} className="hidden items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground sm:flex">
                            <ArrowLeft className="size-3.5" />
                            {t('auth.back_home')}
                        </Link>
                        <LanguageSwitcher />
                    </div>
                </div>

                <main className="flex min-h-0 flex-1 items-center justify-center px-5 py-4 sm:px-8 sm:py-6">
                    <div className="w-full max-w-sm">
                        <p className="text-[10px] font-medium tracking-[0.22em] text-gold uppercase">
                            {t('welcome.archive')}
                        </p>
                        <h1 className="font-display mt-2 text-2xl leading-tight text-foreground sm:text-3xl">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                        )}
                        <div className="mt-5">{children}</div>
                    </div>
                </main>

                <footer className="px-5 py-2 text-center text-[11px] text-muted-foreground sm:px-8 sm:py-3">
                    {t('auth.footer')}
                </footer>
            </div>
        </div>
    );
}
