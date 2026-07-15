import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import {
    Button, Input,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui';
import { Eyebrow } from 'journal-ds';
import { useProjects } from '@/hooks/useCatalog';
import { useDebounce } from '@/hooks/useDebounce';
import { FilterModal } from '@/components/filter-modal';
import { ProjectCard } from '@/components/project-card';
import type { Filters } from '@/types/catalog';

const initialFilters: Filters = {
    keyword: '', departmentId: '', courseId: '',
    academicYear: '', studentYear: '', tags: '',
    supervisor: '', members: '',
    page: 0, size: 12,
    sortBy: 'created_at', sortDirection: 'desc',
};

export default function ProjectsIndex() {
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const debouncedKeyword = useDebounce(filters.keyword, 300);

    const change = (field: keyof Filters, value: string | number) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
            ...(field !== 'page' && { page: 0 }),
        }));
    };

    const queryFilters = { ...filters, keyword: debouncedKeyword };
    const { data, isLoading, isError } = useProjects(queryFilters);

    const projects = data?.content ?? [];
    const totalPages = data?.totalPages ?? 0;
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            <Head title="Project Index" />

            <div className="min-h-screen bg-journal-paper font-serif text-journal-ink flex flex-col">
                {/* ── Top Bar ── */}
                <div className="bg-journal-ink text-journal-paper text-xs uppercase tracking-widest py-1.5 px-4 flex justify-between items-center font-bold">
                    <div className="flex gap-4 items-center">
                        <Link href="/" className="hover:text-journal-burgundy transition-colors flex items-center gap-1">
                            <Icon icon="mdi:home" /> Front Page
                        </Link>
                    </div>
                    <div className="flex gap-4">
                        <span className="hidden sm:inline">The Official Student Archive</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex-grow flex flex-col">

                    {/* ── Masthead ── */}
                    <header className="border-b-4 border-double border-journal-ink pb-4 mb-6">
                        <div className="text-center mb-4">
                            <Eyebrow className="tracking-[0.2em] text-journal-sepia text-xs sm:text-sm uppercase mb-2">
                                Directory of Innovations
                            </Eyebrow>
                            <h1 className="font-display font-black text-5xl sm:text-7xl md:text-8xl leading-[0.85] tracking-tighter text-journal-ink uppercase mt-2 mb-4">
                                Project Index
                            </h1>
                        </div>

                        <div className="w-full flex justify-between items-center border-y-2 border-journal-ink py-1.5 text-xs sm:text-sm font-bold uppercase tracking-[0.1em] text-journal-ink">
                            <span className="w-1/3 text-left hidden sm:block">Archive Access</span>
                            <span className="w-1/2 sm:w-1/3 text-left sm:text-center italic font-serif normal-case font-normal text-journal-sepia">{currentDate}</span>
                            <span className="w-1/2 sm:w-1/3 text-right">
                                {data?.totalElements != null ? `${data.totalElements} Records` : 'Indexing...'}
                            </span>
                        </div>
                    </header>

                    {/* Filter toolbar styled as a control panel */}
                    <div className="border-2 border-journal-ink bg-journal-paper-dark p-4 mb-8 flex flex-col sm:flex-row items-center gap-4">
                        <div className="text-xs uppercase font-bold tracking-widest text-journal-sepia shrink-0">Search Records</div>

                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1">
                            {/* Inline keyword search */}
                            <div className="relative flex-1 min-w-[200px] max-w-sm">
                                <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-journal-sepia text-base" />
                                <Input
                                    className="pl-9 w-full border-journal-ink rounded-none bg-journal-paper font-sans text-sm h-9 focus-visible:ring-journal-burgundy"
                                    placeholder="Search by keyword..."
                                    value={filters.keyword}
                                    onChange={(e) => change('keyword', e.target.value)}
                                />
                            </div>

                            {/* Sort */}
                            <Select
                                value={`${filters.sortBy}:${filters.sortDirection}`}
                                onValueChange={(v) => {
                                    const [sortBy, sortDirection] = v.split(':');
                                    setFilters((prev) => ({ ...prev, sortBy, sortDirection, page: 0 }));
                                }}
                            >
                                <SelectTrigger className="w-40 shrink-0 border-journal-ink rounded-none bg-journal-paper font-sans text-sm h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none border-journal-ink font-sans">
                                    <SelectItem value="created_at:desc">Newest First</SelectItem>
                                    <SelectItem value="created_at:asc">Oldest First</SelectItem>
                                    <SelectItem value="title:asc">Title A–Z</SelectItem>
                                    <SelectItem value="title:desc">Title Z–A</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Filter modal */}
                            <FilterModal
                                filters={filters}
                                onFilterChange={change}
                                onClearFilters={() => setFilters(initialFilters)}
                            />
                        </div>
                    </div>

                    {/* Grid */}
                    {isLoading ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="h-72 border-2 border-journal-ink bg-journal-paper-dark/30 animate-pulse" />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center py-24 text-center gap-4 border-2 border-journal-ink border-dashed p-8">
                            <Icon icon="mdi:alert-circle-outline" className="text-5xl text-journal-burgundy" />
                            <h2 className="text-xl font-display font-black uppercase text-journal-ink">Failed to load projects</h2>
                            <Button className="rounded-none uppercase tracking-widest text-[10px] border-2 border-journal-ink bg-journal-ink text-journal-paper font-bold" onClick={() => window.location.reload()}>Try again</Button>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center py-24 text-center gap-4 border-2 border-journal-ink border-dashed p-8">
                            <Icon icon="mdi:folder-search-outline" className="text-6xl text-journal-sepia" />
                            <h2 className="text-xl font-display font-black uppercase text-journal-ink">No projects found</h2>
                            <p className="text-sm italic text-journal-sepia">Try adjusting your filters or search terms.</p>
                            <Button className="rounded-none uppercase tracking-widest text-[10px] border-2 border-journal-ink bg-transparent text-journal-ink hover:bg-journal-ink hover:text-journal-paper font-bold mt-2" onClick={() => setFilters(initialFilters)}>
                                Clear filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-12 mb-8 flex items-center justify-center gap-2 border-t-2 border-journal-ink pt-6">
                            <Button
                                className="rounded-none border-2 border-journal-ink bg-transparent text-journal-ink hover:bg-journal-ink hover:text-journal-paper disabled:opacity-50"
                                size="sm"
                                disabled={filters.page === 0}
                                onClick={() => change('page', filters.page - 1)}
                            >
                                <Icon icon="mdi:chevron-left" />
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                                <Button
                                    key={p}
                                    className={`rounded-none border-2 border-journal-ink font-bold min-w-9 ${p === filters.page ? 'bg-journal-ink text-journal-paper' : 'bg-transparent text-journal-ink hover:bg-journal-ink hover:text-journal-paper'}`}
                                    size="sm"
                                    onClick={() => change('page', p)}
                                >
                                    {p + 1}
                                </Button>
                            ))}
                            <Button
                                className="rounded-none border-2 border-journal-ink bg-transparent text-journal-ink hover:bg-journal-ink hover:text-journal-paper disabled:opacity-50"
                                size="sm"
                                disabled={filters.page >= totalPages - 1}
                                onClick={() => change('page', filters.page + 1)}
                            >
                                <Icon icon="mdi:chevron-right" />
                            </Button>
                        </div>
                    )}

                    {/* ── Footer ── */}
                    <footer className="mt-auto border-t-4 border-double border-journal-ink pt-4 pb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.15em] text-journal-sepia">
                        <p>© {new Date().getFullYear()} Project Catalog · UCSMGY. All rights reserved.</p>
                        <div className="flex gap-6">
                            <span className="hidden sm:inline">Printed in Magway</span>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
