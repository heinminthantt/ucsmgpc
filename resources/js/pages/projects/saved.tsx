import { Head } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { Button, Heading, Text, OrnamentalDivider } from 'journal-ds';
import { useSavedProjects } from '@/hooks/useCatalog';
import { ProjectCard } from '@/components/project-card';
import { Link } from '@inertiajs/react';

export default function SavedProjects() {
    const { data: projects, isLoading } = useSavedProjects();

    return (
        <>
            <Head title="Saved Projects" />
            <div className="mx-auto max-w-5xl px-6 lg:px-8 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Heading level="h1" className="text-3xl text-journal-ink">Saved Projects</Heading>
                        <Text variant="muted" className="mt-1">Projects you've bookmarked for later.</Text>
                    </div>
                    <Link href="/projects">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Icon icon="mdi:compass-outline" />Browse more
                        </Button>
                    </Link>
                </div>

                <OrnamentalDivider variant="simple" className="mb-8" />

                {isLoading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-72 rounded-sm bg-muted skeleton-shimmer" />
                        ))}
                    </div>
                ) : !projects?.length ? (
                    <div className="flex flex-col items-center py-24 text-center gap-4">
                        <Icon icon="mdi:bookmark-outline" className="text-7xl text-journal-sepia" />
                        <Heading level="h2" className="text-2xl text-journal-ink">No saved projects yet</Heading>
                        <Text variant="muted" className="max-w-sm">Browse projects and click the bookmark icon to save them here.</Text>
                        <Link href="/projects">
                            <Button className="gap-2 mt-2"><Icon icon="mdi:compass-outline" />Explore Projects</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
                    </div>
                )}
            </div>
        </>
    );
}
