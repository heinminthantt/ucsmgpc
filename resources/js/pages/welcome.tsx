import { Head, Link } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import {
    Button, Badge,
    JournalCard,
    OrnamentalDivider,
    PullQuote,
    Eyebrow,
    Heading,
    Text,
    Navbar, NavLink,
} from 'journal-ds';
import { login, register } from '@/routes';

type Props = {
    auth?: { user?: { name: string } | null };
};

export default function Welcome({ auth }: Props) {
    return (
        <>
            <Head title="Project Catalog — A Journal of Student Innovation" />

            {/* ── Navbar ── */}
            <Navbar className='bg-background'
                logo={
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="font-display font-bold text-lg text-journal-burgundy tracking-tight">
                            Project Catalog
                        </span>
                    </Link>
                }
                actions={
                    auth?.user ? (
                        <Link href="/projects">
                            <Button size="sm">Browse Projects</Button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href={login()}>
                                <Button variant="ghost" size="sm">Log in</Button>
                            </Link>
                            <Link href={register()}>
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </div>
                    )
                }
            >
                <NavLink href="/projects">Projects</NavLink>
            </Navbar>

            {/* ── Main content on paper bg ── */}
            <div className="bg-journal-paper min-h-screen">

                {/* ── Hero ── */}
                <section className="relative overflow-hidden border-b border-journal-rule">

                    <div className="mx-auto max-w-3xl px-6 lg:px-8 relative py-32 sm:py-48 text-center">
                        <Eyebrow className="text-journal-sepia">
                            <Icon icon="mdi:school-outline" className="inline mr-1 -mt-0.5" />
                            University Student Projects · UCSMGY
                        </Eyebrow>

                        <Heading
                            level="h1"
                            className="mt-4 text-5xl sm:text-6xl lg:text-7xl text-journal-ink"
                        >
                            A Journal of
                            <span className="block text-journal-burgundy italic mt-1">
                                Student Innovation
                            </span>
                        </Heading>

                        <Text
                            variant="lead"
                            className="mt-6 max-w-2xl mx-auto text-journal-ink-light"
                        >
                            A curated catalog of student projects from UCSMGY — browse by
                            department, semester, or technology. Every project reviewed and
                            approved by supervisors.
                        </Text>

                        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                            <Link href="/projects">
                                <Button size="lg" className="gap-2 px-8">
                                    <Icon icon="mdi:compass-outline" className="text-xl" />
                                    Browse the Catalog
                                </Button>
                            </Link>
                            {!auth?.user && (
                                <Link href={register()}>
                                    <Button variant="outline" size="lg" className="gap-2 px-8">
                                        <Icon icon="mdi:feather" className="text-xl" />
                                        Submit Your Project
                                    </Button>
                                </Link>
                            )}
                        </div>

                        <p className="mt-8 journal-eyebrow text-journal-sepia/60">
                            est. 2024 · reviewed & curated
                        </p>
                    </div>
                </section>

                {/* ── Pull Quote ── */}
                <section className="border-b border-journal-rule my-8 sm:my-16">
                    <div className="mx-auto max-w-prose px-6 lg:px-8 py-24">
                        <PullQuote attribution="Academic Mission">
                            Every great innovation begins as a student's curiosity. Here, we preserve and celebrate those first steps.
                        </PullQuote>
                    </div>
                </section>

                {/* ── Feature cards ── */}
                <section className="py-32 border-b border-journal-rule">
                    <div className="mx-auto max-w-5xl px-6 lg:px-8">
                        <div className="text-center mb-14">
                            <Eyebrow>What's inside</Eyebrow>
                            <Heading level="h2" className="mt-2 text-journal-ink">
                                Everything you need
                            </Heading>
                            <Text variant="muted" className="mt-3">
                                Built for students, supervisors, and administrators.
                            </Text>
                        </div>

                        <OrnamentalDivider variant="ornamental" className="mb-12" />

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((f) => (
                                <JournalCard
                                    key={f.title}
                                    className="group transition-all hover:-translate-y-0.5 hover:shadow-md p-4"
                                    title={
                                        <span className="flex items-center gap-2 font-display text-lg text-journal-ink">
                                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-journal-burgundy/10 text-journal-burgundy">
                                                <Icon icon={f.icon} className="text-base" />
                                            </span>
                                            {f.title}
                                        </span>
                                    }
                                >
                                    <Text variant="muted" className="leading-relaxed">
                                        {f.description}
                                    </Text>
                                </JournalCard>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Stats strip ── */}
                <section className="py-24 border-b border-journal-rule bg-journal-paper-dark/50">
                    <div className="mx-auto max-w-5xl px-6 lg:px-8">
                        <div className="grid grid-cols-3 divide-x divide-journal-rule text-center">
                            {[
                                { value: '100+', label: 'Projects Catalogued' },
                                { value: '12+', label: 'Departments' },
                                { value: '50+', label: 'Supervisors' },
                            ].map((s) => (
                                <div key={s.label} className="px-8 py-8">
                                    <p className="font-display text-4xl font-bold text-journal-burgundy">{s.value}</p>
                                    <p className="mt-1 journal-eyebrow text-journal-sepia">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className="py-32">
                    <div className="mx-auto max-w-prose px-6 lg:px-8 text-center">
                        <OrnamentalDivider variant="dot" className="mb-10" />
                        <Heading level="h2" className="text-journal-ink">
                            Ready to share your work?
                        </Heading>
                        <Text variant="lead" className="mt-4 text-journal-ink-light">
                            Join your classmates and showcase what you've built. Get feedback,
                            earn recognition, and inspire the next generation.
                        </Text>
                        <Link href={auth?.user ? '/projects/create' : register()} className="inline-block mt-8">
                            <Button size="lg" className="px-10 gap-2">
                                <Icon icon="mdi:feather" className="text-xl" />
                                {auth?.user ? 'Submit a Project' : 'Open Your Journal'}
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* ── Footer ── */}
                <footer className="border-t border-journal-rule py-8 bg-journal-paper-dark/30">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="journal-eyebrow text-journal-sepia">
                                © {new Date().getFullYear()} Project Catalog · UCSMGY
                            </p>
                            <OrnamentalDivider variant="ornamental" className="sm:hidden" />
                            <div className="flex items-center gap-4">
                                <Link href="/projects">
                                    <span className="font-serif text-sm text-journal-sepia hover:text-journal-burgundy transition-colors">
                                        Browse
                                    </span>
                                </Link>
                                <Link href={login()}>
                                    <span className="font-serif text-sm text-journal-sepia hover:text-journal-burgundy transition-colors">
                                        Sign in
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

const features = [
    { icon: 'mdi:magnify', title: 'Smart Search', description: 'Filter by department, semester, supervisor, team members, or programming language — all in a clean modal dialog.' },
    { icon: 'mdi:clipboard-check-outline', title: 'Approval Workflow', description: 'Projects go through supervisor review before publication, ensuring quality and academic integrity.' },
    { icon: 'mdi:comment-text-outline', title: 'Community Feedback', description: 'Comment on projects, react with likes, and engage with fellow students\' work.' },
    { icon: 'mdi:bookmark-multiple-outline', title: 'Save for Later', description: 'Bookmark interesting projects to revisit them any time from your saved collection.' },
    { icon: 'mdi:chart-bar', title: 'Admin Dashboard', description: 'Full admin control over users, roles, departments, courses, and project management.' },
    { icon: 'mdi:file-document-edit-outline', title: 'Rich Documentation', description: 'Write detailed project reports with a full rich-text editor supporting images and code blocks.' },
];
