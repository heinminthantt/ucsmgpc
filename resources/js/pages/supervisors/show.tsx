import { Head, Link } from '@inertiajs/react';
import { ProjectCard } from '@/components/project-card';
import { useT } from '@/i18n';
import type { Project } from '@/types/catalog';

type Props = {
    supervisor: {
        id: number;
        name: string;
        bio?: string | null;
        avatarUrl?: string | null;
        departmentId?: number | null;
        departmentName?: string | null;
    };
    counts: { publishedProjects: number };
    projects: Project[];
};

/** Public supervisor page (Phase 3, S7): published supervised work only. */
export default function SupervisorShow({ supervisor, counts, projects }: Props) {
    const t = useT();

    return (
        <>
            <Head title={supervisor.name} />
            <div className="space-y-8">
                <header className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stone-200 text-base font-medium text-stone-700">
                        {supervisor.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-stone-900">{supervisor.name}</h1>
                        {supervisor.departmentName && (
                            <p className="mt-0.5 text-sm text-stone-500">
                                {supervisor.departmentId ? (
                                    <Link href={`/departments/${supervisor.departmentId}`} className="hover:text-stone-900 hover:underline">
                                        {supervisor.departmentName}
                                    </Link>
                                ) : (
                                    supervisor.departmentName
                                )}
                            </p>
                        )}
                        {supervisor.bio && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">{supervisor.bio}</p>}
                        <p className="mt-2 text-[13px] text-stone-500">
                            {counts.publishedProjects} {t('sup.supervised')}
                        </p>
                    </div>
                </header>

                <section>
                    <h2 className="mb-3 text-base font-medium text-stone-900">{t('dept.published_projects')}</h2>
                    {projects.length === 0 ? (
                        <p className="text-sm text-stone-500">{t('catalog.empty_title')}</p>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {projects.map((p) => (
                                <ProjectCard key={p.id} project={p} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
