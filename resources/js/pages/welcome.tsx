import { Head, Link } from '@inertiajs/react';
import { Bookmark, ClipboardCheck, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui';
import { dashboard, login, register } from '@/routes';

type Props = {
    auth?: { user?: { name: string } | null };
};

const features = [
    { icon: Search, title: 'Smart search', description: 'Filter by department, semester, supervisor, team members, or programming language.' },
    { icon: ClipboardCheck, title: 'Approval workflow', description: 'Projects go through supervisor review before publication, ensuring quality.' },
    { icon: MessageSquare, title: 'Community feedback', description: 'Comment on projects, react with likes, and engage with fellow students\' work.' },
    { icon: Bookmark, title: 'Save for later', description: 'Bookmark interesting projects to revisit them any time.' },
];

export default function Welcome({ auth }: Props) {
    return (
        <>
            <Head title="UCSM Project Catalog" />
            <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
                <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
                    <span className="text-sm font-semibold">UCSM Project Catalog</span>
                    <nav className="flex items-center gap-2">
                        {auth?.user ? (
                            <Button asChild size="sm">
                                <Link href={dashboard()}>Go to dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href={login()}>Sign in</Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href={register()}>Register</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 sm:px-6">
                    <section className="py-16 text-center sm:py-24">
                        <h1 className="text-3xl font-semibold text-stone-900 sm:text-4xl">
                            UCSM Project Catalog
                        </h1>
                        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-stone-500 sm:text-[15px]">
                            A catalog of student projects from the University of Computer Studies, Magway. Browse approved work, search by department or technology, and save projects to revisit later.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                            <Button asChild>
                                <Link href="/projects">Browse projects</Link>
                            </Button>
                            {auth?.user ? (
                                <Button asChild variant="outline">
                                    <Link href={dashboard()}>Go to dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="outline">
                                        <Link href={login()}>Sign in</Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href={register()}>Register</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </section>

                    <section className="grid gap-3 pb-16 sm:grid-cols-2">
                        {features.map((f) => (
                            <div key={f.title} className="rounded-xl border border-stone-200 bg-white p-5">
                                <f.icon className="h-5 w-5 text-stone-400" />
                                <h2 className="mt-3 text-sm font-medium text-stone-900">{f.title}</h2>
                                <p className="mt-1 text-[13px] leading-relaxed text-stone-500">{f.description}</p>
                            </div>
                        ))}
                    </section>
                </main>

                <footer className="border-t border-stone-200">
                    <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 px-4 py-4 text-[13px] text-stone-500 sm:flex-row sm:px-6">
                        <p>© {new Date().getFullYear()} UCSM Project Catalog</p>
                        <div className="flex gap-4">
                            <Link href="/projects" className="hover:text-stone-900">Projects</Link>
                            {!auth?.user && (
                                <Link href={login()} className="hover:text-stone-900">Sign in</Link>
                            )}
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
