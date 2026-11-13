import { Head, Link } from '@inertiajs/react';
import { Bookmark, Compass } from 'lucide-react';
import { ProjectCard } from '@/components/project-card';
import { Button, Skeleton } from '@/components/ui';
import { useSavedProjects } from '@/hooks/useCatalog';

export default function SavedProjects() {
    const { data: projects, isLoading } = useSavedProjects();

    return (
        <>
            <Head title="Saved projects" />
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-foreground">Saved projects</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Projects you&apos;ve bookmarked for later reference.
                        </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/projects">
                            <Compass /> Browse more
                        </Link>
                    </Button>
                </header>

                {isLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-72 rounded-xl" />
                        ))}
                    </div>
                ) : !projects?.length ? (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-6 py-16 text-center">
                        <Bookmark className="h-8 w-8 text-muted-foreground/45" />
                        <h2 className="text-sm font-medium text-foreground">No saved projects yet</h2>
                        <p className="max-w-sm text-[13px] text-muted-foreground">Browse projects and click the bookmark icon to save them here.</p>
                        <Button asChild size="sm" className="mt-1">
                            <Link href="/projects">
                                <Compass /> Explore projects
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
                    </div>
                )}
            </div>
        </>
    );
}
