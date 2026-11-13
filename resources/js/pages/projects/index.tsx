import { Head } from '@inertiajs/react';
import { AlertCircle, ChevronLeft, ChevronRight, FolderSearch, Search } from 'lucide-react';
import { useState } from 'react';
import { FilterModal } from '@/components/filter-modal';
import { ProjectCard } from '@/components/project-card';
import {
    Button, Input, Skeleton,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui';
import { useProjects } from '@/hooks/useCatalog';
import { useDebounce } from '@/hooks/useDebounce';
import { useT } from '@/i18n';
import type { Filters } from '@/types/catalog';

const initialFilters: Filters = {
    keyword: '', departmentId: '', courseId: '',
    academicYear: '', studentYear: '', semester: '', tags: '',
    supervisor: '', members: '',
    page: 0, size: 12,
    sortBy: 'created_at', sortDirection: 'desc',
};

export default function ProjectsIndex() {
    const t = useT();
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

    // Phase 3: Featured section, shown at the top when browsing unfiltered.
    const showFeatured = !filters.keyword && !filters.departmentId && !filters.courseId
        && !filters.academicYear && !filters.studentYear && !filters.semester
        && !filters.tags && !filters.supervisor && !filters.members && filters.page === 0;
    const { data: featuredData } = useProjects({ featured: '1', size: 4, page: 0 } as Partial<Filters>);
    const featured = showFeatured ? (featuredData?.content ?? []) : [];

    return (
        <>
            <Head title="Projects" />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold text-stone-900">{t('catalog.title')}</h1>
                    <p className="mt-1 text-sm text-stone-500">
                        {data?.totalElements != null ? `${data.totalElements} ${t('catalog.count_suffix')}` : t('catalog.subtitle')}
                    </p>
                </header>

                <div className="mb-6 flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-3 sm:flex-row sm:items-center">
                    <div className="relative min-w-[200px] flex-1 sm:max-w-sm">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone-400" />
                        <Input
                            className="w-full pl-9"
                            placeholder={t('catalog.search_placeholder')}
                            value={filters.keyword}
                            onChange={(e) => change('keyword', e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Select
                            value={`${filters.sortBy}:${filters.sortDirection}`}
                            onValueChange={(v) => {
                                const [sortBy, sortDirection] = v.split(':');
                                setFilters((prev) => ({ ...prev, sortBy, sortDirection, page: 0 }));
                            }}
                        >
                            <SelectTrigger className="w-40 shrink-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created_at:desc">{t('catalog.sort_newest')}</SelectItem>
                                <SelectItem value="created_at:asc">{t('catalog.sort_oldest')}</SelectItem>
                                <SelectItem value="title:asc">{t('catalog.sort_title_az')}</SelectItem>
                                <SelectItem value="title:desc">{t('catalog.sort_title_za')}</SelectItem>
                            </SelectContent>
                        </Select>

                        <FilterModal
                            filters={filters}
                            onFilterChange={change}
                            onClearFilters={() => setFilters(initialFilters)}
                        />
                    </div>
                </div>

                {featured.length > 0 && (
                    <section className="mb-8">
                        <h2 className="mb-3 text-base font-medium text-stone-900">{t('catalog.featured')}</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {featured.map((p) => <ProjectCard key={p.id} project={p} />)}
                        </div>
                    </section>
                )}

                {isLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-72 rounded-xl" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-stone-200 bg-white px-6 py-16 text-center">
                        <AlertCircle className="h-8 w-8 text-stone-300" />
                        <h2 className="text-sm font-medium text-stone-900">{t('catalog.failed_title')}</h2>
                        <p className="text-[13px] text-stone-500">{t('catalog.failed_desc')}</p>
                        <Button size="sm" onClick={() => window.location.reload()}>{t('catalog.try_again')}</Button>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-stone-200 bg-white px-6 py-16 text-center">
                        <FolderSearch className="h-8 w-8 text-stone-300" />
                        <h2 className="text-sm font-medium text-stone-900">{t('catalog.empty_title')}</h2>
                        <p className="text-[13px] text-stone-500">{t('catalog.empty_desc')}</p>
                        <Button variant="outline" size="sm" onClick={() => setFilters(initialFilters)}>
                            {t('catalog.clear_filters')}
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-1.5">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={filters.page === 0}
                            onClick={() => change('page', filters.page - 1)}
                            aria-label="Previous page"
                        >
                            <ChevronLeft />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                            <Button
                                key={p}
                                variant={p === filters.page ? 'default' : 'outline'}
                                size="sm"
                                className="min-w-8"
                                onClick={() => change('page', p)}
                            >
                                {p + 1}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={filters.page >= totalPages - 1}
                            onClick={() => change('page', filters.page + 1)}
                            aria-label="Next page"
                        >
                            <ChevronRight />
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
