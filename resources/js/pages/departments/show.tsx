import { Head, Link } from '@inertiajs/react';
import { ProjectCard } from '@/components/project-card';
import { useT } from '@/i18n';
import type { Project } from '@/types/catalog';

type SupervisorSummary = {
    id: number;
    name: string;
    bio?: string | null;
    publishedProjectsCount: number;
};

type Props = {
    department: { id: number; name: string };
    counts: { publishedProjects: number; supervisors: number };
    projects: Project[];
    supervisors: SupervisorSummary[];
};

/** Public department page (Phase 3, S7): published projects + supervisors. */
export default function DepartmentShow({ department, counts, projects, supervisors }: Props) {
    const t = useT();

    return (
        <>
            <Head title={department.name} />
            <div className="space-y-8">
                <header>
                    <h1 className="text-2xl font-semibold text-stone-900">{department.name}</h1>
                    <p className="mt-1 text-sm text-stone-500">{t('dept.about')}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[13px] text-stone-600">
                        <span className="rounded-lg border border-stone-200 bg-white px-3 py-1.5">
                            {counts.publishedProjects} {t('dept.published_projects')}
                        </span>
                        <span className="rounded-lg border border-stone-200 bg-white px-3 py-1.5">
                            {counts.supervisors} {t('dept.supervisors')}
                        </span>
                    </div>
                </header>

                <section>
                    <h2 className="mb-3 text-base font-medium text-stone-900">{t('dept.supervisors')}</h2>
                    {supervisors.length === 0 ? (
                        <p className="text-sm text-stone-500">{t('catalog.empty_title')}</p>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
                            {supervisors.map((s, i) => (
                                <Link
                                    key={s.id}
                                    href={`/supervisors/${s.id}`}
                                    className={`flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm hover:bg-stone-50 ${i > 0 ? 'border-t border-stone-100' : ''}`}
                                >
                                    <span className="font-medium text-stone-900">{s.name}</span>
                                    {s.bio && <span className="line-clamp-1 flex-1 text-stone-500">{s.bio}</span>}
                                    <span className="text-stone-500">
                                        {s.publishedProjectsCount} {t('dept.published_projects')}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

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
