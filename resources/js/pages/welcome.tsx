import { Head, Link } from '@inertiajs/react';
import { Bookmark, ClipboardCheck, MessageSquare, Search } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui';
import { useT } from '@/i18n';
import { dashboard, login } from '@/routes';

type Props = {
    auth?: { user?: { name: string } | null };
};

const featureKeys = [
    { icon: Search, title: 'welcome.search_title', description: 'welcome.search_desc' },
    { icon: ClipboardCheck, title: 'welcome.workflow_title', description: 'welcome.workflow_desc' },
    { icon: MessageSquare, title: 'welcome.feedback_title', description: 'welcome.feedback_desc' },
    { icon: Bookmark, title: 'welcome.save_title', description: 'welcome.save_desc' },
];

const factKeys = [
    { title: 'welcome.fact_1_title', description: 'welcome.fact_1_desc' },
    { title: 'welcome.fact_2_title', description: 'welcome.fact_2_desc' },
    { title: 'welcome.fact_3_title', description: 'welcome.fact_3_desc' },
];

export default function Welcome({ auth }: Props) {
    const t = useT();

    return (
        <>
            <Head title="UCSMGY Project Catalog" />
            <div className="flex min-h-svh flex-col bg-background text-foreground">
                {/* University utility strip */}
                <div className="bg-sidebar text-sidebar-foreground">
                    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2 text-[10px] font-medium tracking-[0.18em] uppercase sm:px-6">
                        <span>{t('app.tagline')}</span>
                        <span className="hidden text-sidebar-foreground/55 sm:block">{t('welcome.archive')}</span>
                    </div>
                </div>

                <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
                    <div className="mx-auto flex h-[74px] max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
                        <Link href="/" className="flex items-center gap-3">
                            <AppLogoIcon className="size-10 shrink-0 object-contain" />
                            <span className="hidden sm:block">
                                <span className="font-display block text-[17px] leading-none font-semibold">UCSMGY</span>
                                <span className="mt-1 block text-[9px] leading-none tracking-[0.2em] text-muted-foreground uppercase">
                                    Project Catalog
                                </span>
                            </span>
                        </Link>

                        <nav className="hidden items-center gap-7 text-[13px] md:flex">
                            <Link href="/projects" className="text-muted-foreground transition-colors hover:text-foreground">
                                {t('nav.projects')}
                            </Link>
                            <a href="#about" className="text-muted-foreground transition-colors hover:text-foreground">
                                {t('welcome.about_link')}
                            </a>
                        </nav>

                        <div className="flex items-center gap-2">
                            <LanguageSwitcher className="hidden sm:inline-flex" />
                            {auth?.user ? (
                                <Button asChild size="sm">
                                    <Link href={dashboard()}>{t('welcome.go_dashboard')}</Link>
                                </Button>
                            ) : (
                                <Button asChild size="sm">
                                    <Link href={login()}>{t('nav.sign_in')}</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1">
                    {/* Hero */}
                    <section className="relative overflow-hidden border-b border-border">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,color-mix(in_srgb,var(--gold)_16%,transparent),transparent_42%),radial-gradient(circle_at_88%_92%,color-mix(in_srgb,var(--primary)_7%,transparent),transparent_45%)]"
                        />
                        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-16 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:py-24">
                            <div>
                                <h1 className="max-w-xl text-[2.6rem] leading-[1.08] text-foreground sm:text-5xl lg:text-[3.6rem]">
                                    {t('welcome.hero_title')}
                                </h1>
                                <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                                    {t('welcome.subtitle')}
                                </p>
                                <div className="mt-8 flex flex-wrap items-center gap-3">
                                    <Button asChild size="lg" className="h-11 px-6">
                                        <Link href="/projects">{t('welcome.browse')}</Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="h-11 px-6">
                                        <Link href={auth?.user ? dashboard() : login()}>
                                            {auth?.user ? t('welcome.go_dashboard') : t('nav.sign_in')}
                                        </Link>
                                    </Button>
                                </div>
                                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[12px] text-muted-foreground">
                                    {factKeys.map((fact) => (
                                        <span key={fact.title} className="flex items-center gap-2">
                                            <span className="size-1.5 rounded-full bg-gold" />
                                            {t(fact.title)}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Institutional plaque */}
                            <div className="relative mx-auto w-full max-w-sm lg:mr-0">
                                <div aria-hidden="true" className="absolute -inset-2.5 rounded-[1.75rem] border border-gold/30" />
                                <div className="relative overflow-hidden rounded-3xl bg-sidebar p-8 text-sidebar-foreground shadow-[0_24px_60px_-24px_rgba(14,30,51,0.55)]">
                                    <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--gold)_28%,transparent),transparent_70%)]"
                                    />
                                    <div className="relative flex items-center gap-3">
                                        <AppLogoIcon className="size-11 shrink-0 object-contain" />
                                        <div>
                                            <p className="font-display text-lg leading-none text-white">UCSMGY</p>
                                            <p className="mt-1.5 text-[9px] tracking-[0.2em] text-sidebar-foreground/55 uppercase">
                                                {t('welcome.archive')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative mt-8 space-y-4">
                                        {featureKeys.slice(0, 3).map((f, i) => (
                                            <div key={f.title} className="flex items-start gap-3 border-t border-white/10 pt-4 first:border-0 first:pt-0">
                                                <span className="font-display text-sm text-sidebar-primary">0{i + 1}</span>
                                                <div>
                                                    <p className="text-[13px] font-medium text-white">{t(f.title)}</p>
                                                    <p className="mt-0.5 text-[11px] leading-relaxed text-sidebar-foreground/55">
                                                        {t(f.description)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="relative mt-8 border-t border-white/10 pt-5">
                                        <p className="text-[11px] leading-relaxed text-sidebar-foreground/60">
                                            {t('welcome.panel_note')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Facts */}
                    <section className="border-b border-border bg-card">
                        <div className="mx-auto grid max-w-6xl divide-y divide-border px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
                            {factKeys.map((fact) => (
                                <div key={fact.title} className="px-0 py-7 sm:px-7 sm:first:pl-0 sm:last:pr-0">
                                    <p className="font-display text-lg text-foreground">{t(fact.title)}</p>
                                    <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{t(fact.description)}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Capabilities */}
                    <section id="features" className="mx-auto max-w-6xl scroll-mt-28 px-5 py-16 sm:px-6 lg:py-20">
                        <div id="about" className="scroll-mt-28" />
                        <div className="max-w-2xl">
                            <h2 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">
                                {t('welcome.about_title')}
                            </h2>
                            <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
                                {t('welcome.about_desc')}
                            </p>
                        </div>

                        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
                            {featureKeys.map((f, i) => (
                                <article key={f.title} className="border-t border-border pt-5">
                                    <div className="flex items-center justify-between">
                                        <f.icon className="size-5 text-gold" strokeWidth={1.5} />
                                        <span className="font-display text-sm text-muted-foreground/60">0{i + 1}</span>
                                    </div>
                                    <h3 className="mt-4 font-display text-xl text-foreground">{t(f.title)}</h3>
                                    <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted-foreground">
                                        {t(f.description)}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="relative overflow-hidden bg-sidebar text-sidebar-foreground">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--gold)_18%,transparent),transparent_55%)]"
                        />
                        <div className="relative mx-auto max-w-3xl px-5 py-16 text-center sm:px-6 lg:py-20">
                            <h2 className="font-display text-3xl leading-tight text-white sm:text-4xl">
                                {t('welcome.cta_title')}
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-sidebar-foreground/65">
                                {t('welcome.cta_desc')}
                            </p>
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                <Button asChild size="lg" className="h-11 bg-sidebar-primary px-6 text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                                    <Link href={auth?.user ? dashboard() : login()}>
                                        {auth?.user ? t('welcome.go_dashboard') : t('nav.sign_in')}
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="h-11 border-white/25 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white">
                                    <Link href="/projects">{t('welcome.browse')}</Link>
                                </Button>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="bg-sidebar text-sidebar-foreground">
                    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr]">
                        <div>
                            <div className="flex items-center gap-3">
                                <AppLogoIcon className="size-9 shrink-0 object-contain" />
                                <div>
                                    <p className="font-display text-lg leading-none text-white">UCSMGY</p>
                                    <p className="mt-1 text-[9px] tracking-[0.2em] text-sidebar-foreground/50 uppercase">
                                        Project Catalog
                                    </p>
                                </div>
                            </div>
                            <p className="mt-4 max-w-sm text-[12px] leading-relaxed text-sidebar-foreground/55">
                                {t('welcome.footer_tagline')}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-medium tracking-[0.2em] text-sidebar-foreground/40 uppercase">
                                {t('welcome.footer_explore')}
                            </p>
                            <div className="mt-3 flex flex-col gap-2 text-[13px]">
                                <Link href="/projects" className="text-sidebar-foreground/75 transition-colors hover:text-white">{t('nav.projects')}</Link>
                                <a href="#about" className="text-sidebar-foreground/75 transition-colors hover:text-white">{t('welcome.about_link')}</a>
                                <Link href="/projects/create" className="text-sidebar-foreground/75 transition-colors hover:text-white">{t('nav.new_project')}</Link>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-medium tracking-[0.2em] text-sidebar-foreground/40 uppercase">
                                {t('welcome.footer_account')}
                            </p>
                            <div className="mt-3 flex flex-col gap-2 text-[13px]">
                                {auth?.user ? (
                                    <>
                                        <Link href={dashboard()} className="text-sidebar-foreground/75 transition-colors hover:text-white">{t('nav.dashboard')}</Link>
                                        <Link href="/saved-projects" className="text-sidebar-foreground/75 transition-colors hover:text-white">{t('nav.saved')}</Link>
                                    </>
                                ) : (
                                    <Link href={login()} className="text-sidebar-foreground/75 transition-colors hover:text-white">{t('nav.sign_in')}</Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10">
                        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-4 text-[11px] text-sidebar-foreground/45 sm:flex-row sm:px-6">
                            <p>© {new Date().getFullYear()} {t('app.tagline')}</p>
                            <p>{t('welcome.rights')}</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
