import { Head, Link } from '@inertiajs/react';
import { Bookmark, ClipboardCheck, MessageSquare, Search } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui';
import { useT } from '@/i18n';
import { dashboard, login, register } from '@/routes';

type Props = {
    auth?: { user?: { name: string } | null };
};

const featureKeys = [
    { icon: Search, title: 'welcome.search_title', description: 'welcome.search_desc' },
    { icon: ClipboardCheck, title: 'welcome.workflow_title', description: 'welcome.workflow_desc' },
    { icon: MessageSquare, title: 'welcome.feedback_title', description: 'welcome.feedback_desc' },
    { icon: Bookmark, title: 'welcome.save_title', description: 'welcome.save_desc' },
];

export default function Welcome({ auth }: Props) {
    const t = useT();

    return (
        <>
            <Head title="UCSM Project Catalog" />
            <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
                <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
                    <span className="text-sm font-semibold">{t('welcome.title')}</span>
                    <nav className="flex items-center gap-2">
                        <LanguageSwitcher />
                        {auth?.user ? (
                            <Button asChild size="sm">
                                <Link href={dashboard()}>{t('welcome.go_dashboard')}</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={login()}>{t('nav.sign_in')}</Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href={register()}>{t('nav.register')}</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 sm:px-6">
                    <section className="py-16 text-center sm:py-24">
                        <h1 className="text-3xl font-semibold text-stone-900 sm:text-4xl">
                            {t('welcome.title')}
                        </h1>
                        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-stone-500 sm:text-[15px]">
                            {t('welcome.subtitle')}
                        </p>
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                            <Button asChild>
                                <Link href="/projects">{t('welcome.browse')}</Link>
                            </Button>
                            {auth?.user ? (
                                <Button asChild variant="outline">
                                    <Link href={dashboard()}>{t('welcome.go_dashboard')}</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="outline">
                                        <Link href={login()}>{t('nav.sign_in')}</Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href={register()}>{t('nav.register')}</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </section>

                    <section className="grid gap-3 pb-16 sm:grid-cols-2">
                        {featureKeys.map((f) => (
                            <div key={f.title} className="rounded-xl border border-stone-200 bg-white p-5">
                                <f.icon className="h-5 w-5 text-stone-400" />
                                <h2 className="mt-3 text-sm font-medium text-stone-900">{t(f.title)}</h2>
                                <p className="mt-1 text-[13px] leading-relaxed text-stone-500">{t(f.description)}</p>
                            </div>
                        ))}
                    </section>
                </main>

                <footer className="border-t border-stone-200">
                    <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 px-4 py-4 text-[13px] text-stone-500 sm:flex-row sm:px-6">
                        <p>© {new Date().getFullYear()} UCSM Project Catalog</p>
                        <div className="flex gap-4">
                            <Link href="/projects" className="hover:text-stone-900">{t('nav.projects')}</Link>
                            {!auth?.user && (
                                <Link href={login()} className="hover:text-stone-900">{t('nav.sign_in')}</Link>
                            )}
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
