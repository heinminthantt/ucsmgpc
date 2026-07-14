import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import {
    Button, Input,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui';
import {Text, Heading , OrnamentalDivider} from 'journal-ds';
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

    return (
        <>
            <Head title="Explore Projects" />
            <div className="mx-auto max-w-7xl px-8 lg:px-12 py-12">
                {/* Header */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <Heading level="h1" className="text-3xl text-journal-ink">Explore Projects</Heading>
                            <Text variant="muted" className="mt-1">
                                {data?.totalElements != null
                                    ? `${data.totalElements} approved projects`
                                    : 'Discover student projects from UCSMGY'}
                            </Text>
                        </div>
                    </div>

                    {/* Filter toolbar — stacked below title on small screens */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Inline keyword search */}
                        <div className="relative flex-1 min-w-[200px] max-w-xs">
                            <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-journal-sepia text-base" />
                            <Input
                                className="pl-9 w-full"
                                placeholder="Search projects..."
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
                            <SelectTrigger className="w-40 shrink-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created_at:desc">Newest first</SelectItem>
                                <SelectItem value="created_at:asc">Oldest first</SelectItem>
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

                <OrnamentalDivider variant="simple" className="mb-8" />

                {/* Grid */}
                {isLoading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-72 rounded-sm bg-muted skeleton-shimmer" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center py-24 text-center gap-4">
                        <Icon icon="mdi:alert-circle-outline" className="text-5xl text-destructive" />
                        <Text className="text-lg font-medium">Failed to load projects</Text>
                        <Button variant="outline" onClick={() => window.location.reload()}>Try again</Button>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="flex flex-col items-center py-24 text-center gap-4">
                        <Icon icon="mdi:folder-search-outline" className="text-6xl text-journal-sepia" />
                        <Heading level="h2" className="text-xl text-journal-ink">No projects found</Heading>
                        <Text variant="muted">Try adjusting your filters or search terms.</Text>
                        <Button variant="outline" onClick={() => setFilters(initialFilters)}>
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
                    <div className="mt-12 flex items-center justify-center gap-2">
                        <Button
                            variant="outline" size="sm"
                            disabled={filters.page === 0}
                            onClick={() => change('page', filters.page - 1)}
                        >
                            <Icon icon="mdi:chevron-left" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                            <Button
                                key={p}
                                variant={p === filters.page ? 'default' : 'outline'}
                                size="sm"
                                className="min-w-9"
                                onClick={() => change('page', p)}
                            >
                                {p + 1}
                            </Button>
                        ))}
                        <Button
                            variant="outline" size="sm"
                            disabled={filters.page >= totalPages - 1}
                            onClick={() => change('page', filters.page + 1)}
                        >
                            <Icon icon="mdi:chevron-right" />
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
