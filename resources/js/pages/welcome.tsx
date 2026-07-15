import { Head, Link } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import {
    Button,
    PullQuote,
    Eyebrow,
} from 'journal-ds';
import { login, register } from '@/routes';

type Props = {
    auth?: { user?: { name: string } | null };
};

export default function Welcome({ auth }: Props) {
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            <Head title="Project Catalog — A Journal of Student Innovation" />

            <div className="bg-journal-paper min-h-screen font-serif text-journal-ink flex flex-col">

                {/* ── Top Bar ── */}
                <div className="bg-journal-ink text-journal-paper text-xs uppercase tracking-widest py-1.5 px-4 flex justify-between items-center font-bold">
                    <div className="flex gap-4">
                        <span className="hidden sm:inline">The Official Student Archive</span>
                        <span>ISSN 1234-5678</span>
                    </div>
                    <div className="flex gap-4">
                        {auth?.user ? (
                            <Link href="/projects" className="hover:text-journal-burgundy transition-colors">Go to Catalog →</Link>
                        ) : (
                            <>
                                <Link href={login()} className="hover:text-journal-burgundy transition-colors">Sign In</Link>
                                <span className="text-journal-paper/50">|</span>
                                <Link href={register()} className="hover:text-journal-burgundy transition-colors">Subscribe</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex-grow flex flex-col">

                    {/* ── Masthead ── */}
                    <header className="border-b-4 border-double border-journal-ink pb-4 mb-4 md:mb-6">
                        <div className="text-center mb-4">
                            <Eyebrow className="tracking-[0.2em] text-journal-sepia text-xs sm:text-sm uppercase mb-2">
                                University of Computer Studies, Magway
                            </Eyebrow>
                            <h1 className="font-display font-black text-6xl sm:text-8xl md:text-[8rem] leading-[0.85] tracking-tighter text-journal-ink uppercase mt-2 mb-4 drop-shadow-sm">
                                Project Catalog
                            </h1>
                        </div>

                        <div className="w-full flex justify-between items-center border-y-2 border-journal-ink py-1.5 text-xs sm:text-sm font-bold uppercase tracking-[0.1em] text-journal-ink">
                            <span className="w-1/3 text-left hidden sm:block">Vol. 1, No. 1</span>
                            <span className="w-1/2 sm:w-1/3 text-left sm:text-center italic font-serif normal-case font-normal text-journal-sepia">{currentDate}</span>
                            <span className="w-1/2 sm:w-1/3 text-right">Price: Priceless</span>
                        </div>
                    </header>

                    {/* ── Main Layout ── */}
                    <main className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 flex-grow">

                        {/* Left/Center Columns: Main Stories */}
                        <article className="md:col-span-8 lg:col-span-9 flex flex-col">

                            {/* Lead Story */}
                            <div className="border-b border-journal-rule pb-6 mb-6">
                                <h2 className="font-display font-black text-4xl sm:text-6xl text-journal-ink leading-tight mb-3">
                                    A NEW ERA OF STUDENT INNOVATION UNLEASHED
                                </h2>
                                <h3 className="italic text-journal-sepia text-xl sm:text-2xl border-b border-journal-rule pb-3 mb-4 font-medium">
                                    Curated catalog of exceptional projects from UCSMGY ready for public review and admiration.
                                </h3>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                    {/* Text Content */}
                                    <div className="text-justify leading-snug text-sm sm:text-base columns-1 sm:columns-2 lg:columns-1 gap-6">
                                        <p className="mb-4">
                                            <span className="float-left text-6xl font-display leading-none pr-3 pt-1 pb-1 text-journal-ink">E</span>
                                            <span className="font-bold uppercase text-xs tracking-wider">xclusive report — </span>very great innovation begins as a student's curiosity. Here at the University of Computer Studies, Magway, we aim to preserve, celebrate, and showcase these initial steps into the technological frontier. Our newly launched online project catalog aggregates the very best in student ingenuity.
                                        </p>
                                        <p className="mb-4">
                                            Browse by department, semester, or technology. Every project is rigorously reviewed and approved by expert supervisors to ensure academic integrity and uncompromising quality. This repository serves not just as a portfolio, but as a source of inspiration for future generations of technologists.
                                        </p>
                                        <PullQuote attribution="Academic Mission" className="my-6 border-y border-journal-rule py-4">
                                            Empowering the next generation of engineers through rigorous review and public exhibition.
                                        </PullQuote>
                                        <p>
                                            The platform offers a smart search feature, allowing prospective employers, fellow students, and academic researchers to filter innovations with pinpoint accuracy. We invite you to explore the archives and witness the birth of tomorrow's solutions today.
                                        </p>
                                    </div>

                                    {/* Featured Graphic */}
                                    <div className="flex flex-col">
                                        <div className="border-[3px] border-journal-ink p-1 bg-journal-paper-dark">
                                            <div className="aspect-video bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] bg-journal-ink/5 flex flex-col items-center justify-center text-center p-6 border border-journal-ink relative overflow-hidden group">
                                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-journal-ink via-transparent to-transparent"></div>
                                                <Icon icon="mdi:bank-outline" className="text-7xl text-journal-ink mb-2 group-hover:scale-105 transition-transform duration-700" />
                                                <h4 className="font-display text-2xl font-black uppercase tracking-widest text-journal-ink">The Academic Vault</h4>
                                            </div>
                                        </div>
                                        <p className="text-xs font-serif text-justify p-2 text-journal-ink-light border-b border-journal-rule mb-4">
                                            <span className="font-bold uppercase">Fig 1.</span> An abstract representation of the digital archives housing the latest student projects. Access is now granted to the public sphere.
                                        </p>

                                        {/* Action Box inside article */}
                                        <div className="bg-journal-paper border-2 border-journal-ink p-5 mt-auto relative">
                                            <div className="absolute -top-3 left-4 bg-journal-paper px-2 font-display font-bold uppercase tracking-widest text-xs border border-journal-ink">Official Notice</div>
                                            <h4 className="font-display font-bold text-lg text-journal-ink mb-2 leading-none uppercase">Engage With The Work</h4>
                                            <p className="text-xs text-journal-ink-light mb-4 leading-tight">
                                                {auth?.user
                                                    ? 'Your credentials have been verified. Proceed to the catalog to review the latest submissions or file a new project report.'
                                                    : 'Readers are encouraged to authenticate to bookmark projects, leave critical feedback, and submit original research.'}
                                            </p>
                                            <div className="flex gap-2">
                                                <Link href="/projects" className="flex-1">
                                                    <Button className="w-full rounded-none uppercase tracking-widest text-[10px] py-1.5 bg-journal-ink hover:bg-journal-burgundy text-journal-paper font-bold border border-journal-ink h-auto">
                                                        Browse Projects
                                                    </Button>
                                                </Link>
                                                {!auth?.user && (
                                                    <Link href={register()} className="flex-1">
                                                        <Button variant="outline" className="w-full rounded-none uppercase tracking-widest text-[10px] py-1.5 border-journal-ink text-journal-ink hover:bg-journal-ink hover:text-journal-paper font-bold h-auto">
                                                            Submit Project
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Stories / Features Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                {features.slice(0, 4).map((f, i) => (
                                    <div key={f.title} className={`pb-4 ${i < 2 ? 'sm:border-b sm:border-journal-rule' : ''} border-b border-journal-rule sm:border-none`}>
                                        <h4 className="font-display font-bold text-lg uppercase leading-tight mb-1 flex items-center gap-2 text-journal-ink">
                                            <Icon icon={f.icon} className="text-journal-sepia text-xl flex-shrink-0" />
                                            {f.title}
                                        </h4>
                                        <p className="text-sm text-journal-ink-light leading-snug text-justify">
                                            {f.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </article>

                        {/* Right Column: Sidebar / Index / Quick Facts */}
                        <aside className="md:col-span-4 lg:col-span-3 flex flex-col gap-6 md:border-l md:border-journal-rule md:pl-6">

                            {/* Weather/Status Box */}
                            <div className="border border-journal-ink p-3 text-center">
                                <h3 className="font-display font-bold text-xs uppercase tracking-[0.2em] border-b border-journal-ink pb-1 mb-2">System Status</h3>
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Icon icon="mdi:server-network" className="text-2xl text-journal-ink" />
                                    <span className="font-bold text-lg">ONLINE</span>
                                </div>
                                <p className="text-[10px] uppercase text-journal-sepia leading-tight">All systems nominal. Database synchronized. Ready for queries.</p>
                            </div>

                            {/* By The Numbers */}
                            <div className="bg-journal-paper-dark border-y-[3px] border-double border-journal-ink py-4 px-2">
                                <h3 className="font-display font-black text-xl uppercase tracking-widest text-journal-ink text-center mb-4">
                                    In This Issue
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {[
                                        { value: '100+', label: 'Projects Catalogued', icon: 'mdi:file-document-multiple-outline' },
                                        { value: '12+', label: 'Departments', icon: 'mdi:domain' },
                                        { value: '50+', label: 'Supervisors', icon: 'mdi:account-tie' },
                                    ].map((s, i) => (
                                        <div key={s.label} className={`flex items-center justify-between ${i !== 0 ? 'border-t border-journal-rule border-dashed pt-3' : ''}`}>
                                            <div className="flex items-center gap-2">
                                                <Icon icon={s.icon} className="text-journal-sepia text-lg" />
                                                <span className="text-xs uppercase tracking-wider font-bold text-journal-ink">{s.label}</span>
                                            </div>
                                            <span className="font-display text-xl font-bold text-journal-burgundy">{s.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Features List */}
                            <div>
                                <h3 className="font-display font-bold text-sm uppercase tracking-widest border-b-2 border-journal-ink pb-1 mb-3">Admin Directory</h3>
                                <ul className="space-y-3">
                                    {features.slice(4).map((f) => (
                                        <li key={f.title}>
                                            <h4 className="font-bold text-journal-ink text-xs uppercase mb-0.5">{f.title}</h4>
                                            <p className="text-[11px] text-journal-ink-light leading-snug">
                                                {f.description}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Advertisement / Final CTA */}
                            <div className="mt-auto border-4 border-journal-ink p-4 text-center bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]">
                                <h3 className="font-display font-black text-2xl uppercase leading-none mb-2">Wanted</h3>
                                <p className="text-xs uppercase font-bold tracking-wider mb-3">Brilliant Minds & Fresh Ideas</p>
                                <p className="text-[10px] leading-tight mb-4 text-justify text-journal-ink-light">
                                    The catalog is actively seeking submissions from dedicated students. Secure your legacy in the university archives.
                                </p>
                                {!auth?.user ? (
                                    <Link href={register()} className="block">
                                        <Button className="w-full rounded-none uppercase tracking-[0.2em] text-[10px] border-2 border-journal-ink bg-transparent text-journal-ink hover:bg-journal-ink hover:text-journal-paper font-black">
                                            Apply Within
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/projects/create" className="block">
                                        <Button className="w-full rounded-none uppercase tracking-[0.2em] text-[10px] border-2 border-journal-ink bg-transparent text-journal-ink hover:bg-journal-ink hover:text-journal-paper font-black">
                                            Submit Now
                                        </Button>
                                    </Link>
                                )}
                            </div>

                        </aside>

                    </main>

                    {/* ── Footer ── */}
                    <footer className="mt-8 border-t-4 border-double border-journal-ink pt-4 pb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.15em] text-journal-sepia">
                        <p>© {new Date().getFullYear()} Project Catalog · UCSMGY. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="/projects" className="hover:text-journal-ink transition-colors">Index</Link>
                            {!auth?.user && <Link href={login()} className="hover:text-journal-ink transition-colors">Log In</Link>}
                            <span className="hidden sm:inline">Printed in Magway</span>
                        </div>
                    </footer>

                </div>
            </div>
        </>
    );
}

const features = [
    { icon: 'mdi:magnify', title: 'Smart Search', description: 'Filter by department, semester, supervisor, team members, or programming language.' },
    { icon: 'mdi:clipboard-check-outline', title: 'Approval Workflow', description: 'Projects go through supervisor review before publication, ensuring quality.' },
    { icon: 'mdi:comment-text-outline', title: 'Community Feedback', description: 'Comment on projects, react with likes, and engage with fellow students\' work.' },
    { icon: 'mdi:bookmark-multiple-outline', title: 'Save for Later', description: 'Bookmark interesting projects to revisit them any time.' },
    { icon: 'mdi:chart-bar', title: 'Admin Control', description: 'Full administrative oversight over users, roles, departments, courses, and management.' },
    { icon: 'mdi:file-document-edit-outline', title: 'Rich Docs', description: 'Write detailed project reports with a full rich-text editor.' },
];
