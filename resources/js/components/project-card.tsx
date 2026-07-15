import { Link } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import type { Project } from '@/types/catalog';

interface Props {
    project: Project;
}

const statusConfig = {
    APPROVED: { label: 'Approved', cls: 'success' as const },
    PENDING: { label: 'Pending', cls: 'warning' as const },
    REJECTED: { label: 'Rejected', cls: 'destructive' as const },
};

export function ProjectCard({ project }: Props) {
    const status = statusConfig[project.approvalStatus] ?? statusConfig.PENDING;

    return (
        <article className="group flex flex-col h-full border-2 border-journal-ink bg-journal-paper-dark/50 transition-all hover:bg-journal-paper">
            {/* Cover */}
            <div className="relative h-36 border-b-2 border-journal-ink bg-journal-warm/20 shrink-0 p-1">
                <img
                    src={project.coverImageUrl || 'https://i.ibb.co/3yYHDr3s/6306486.jpg'}
                    alt={project.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-2 right-2 bg-journal-paper border border-journal-ink px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-widest shadow-sm">
                    {status.label}
                </div>
            </div>

            <div className="flex flex-col flex-1 p-3">
                {/* Dept / Course */}
                <div className="flex flex-wrap gap-1 mb-2">
                    {project.departmentName && (
                        <span className="border border-journal-ink px-1 py-0.5 text-[9px] uppercase font-bold tracking-widest flex items-center gap-1">
                            <Icon icon="mdi:office-building-outline" />
                            {project.departmentName}
                        </span>
                    )}
                    {project.courseName && (
                        <span className="border border-journal-ink border-dashed px-1 py-0.5 text-[9px] uppercase font-bold tracking-widest">
                            {project.courseName}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="font-display font-black text-xl leading-none line-clamp-2 text-journal-ink group-hover:text-journal-burgundy transition-colors uppercase mb-2">
                    {project.title}
                </h3>

                {/* Description */}
                <p className="font-serif text-xs text-journal-ink-light line-clamp-2 flex-1 leading-snug text-justify mb-3">
                    {project.description}
                </p>

                {/* Meta */}
                <div className="space-y-1 mb-3 pt-2 border-t border-journal-rule border-dashed">
                    {project.academic_year && (
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-journal-sepia">
                            <Icon icon="mdi:calendar-outline" className="text-sm shrink-0" />
                            {project.academic_year}
                        </div>
                    )}
                    {project.student_year && (
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-journal-sepia">
                            <Icon icon="mdi:school-outline" className="text-sm shrink-0" />
                            {project.student_year}
                        </div>
                    )}
                    {project.supervisorName && (
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-journal-sepia">
                            <Icon icon="mdi:account-tie-outline" className="text-sm shrink-0" />
                            {project.supervisorName}
                        </div>
                    )}
                </div>

                {/* Tags */}
                {project.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3 mt-auto">
                        {project.tags.slice(0, 3).map((tag: any) => (
                            <span key={tag.id ?? tag.name} className="bg-journal-ink text-journal-paper px-1 py-0.5 text-[8px] uppercase tracking-widest font-bold">
                                {typeof tag === 'object' ? tag.name : tag}
                            </span>
                        ))}
                        {project.tags.length > 3 && (
                            <span className="bg-journal-ink text-journal-paper px-1 py-0.5 text-[8px] uppercase tracking-widest font-bold">+{project.tags.length - 3}</span>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t-2 border-journal-ink mt-auto">
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-journal-sepia">
                        <Icon icon="mdi:heart-outline" className="text-sm" />
                        {project.reactionCount ?? 0} Likes
                    </div>
                    <Link href={`/projects/${project.id}/view`}>
                        <button className="bg-transparent border-2 border-journal-ink text-journal-ink px-3 py-1 text-[10px] uppercase font-bold tracking-widest hover:bg-journal-ink hover:text-journal-paper transition-colors flex items-center gap-1">
                            Read Details <Icon icon="mdi:arrow-right" className="text-sm" />
                        </button>
                    </Link>
                </div>
            </div>
        </article>
    );
}