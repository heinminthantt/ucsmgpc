import { Link } from '@inertiajs/react';
import { ArrowRight, Building2, Calendar, GraduationCap, Heart, UserRoundCheck } from 'lucide-react';
import { Badge } from '@/components/ui';
import { useT } from '@/i18n';
import type { Project } from '@/types/catalog';

interface Props {
    project: Project;
}

const statusConfig = {
    APPROVED: { label: 'Approved', variant: 'secondary' as const },
    PENDING: { label: 'Pending', variant: 'outline' as const },
    REJECTED: { label: 'Rejected', variant: 'destructive' as const },
};

export function ProjectCard({ project }: Props) {
    const t = useT();
    const status = statusConfig[project.approvalStatus] ?? statusConfig.PENDING;

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white transition-colors hover:border-stone-300">
            <div className="relative h-36 shrink-0 overflow-hidden bg-stone-100">
                <img
                    src={project.coverImageUrl || 'https://i.ibb.co/3yYHDr3s/6306486.jpg'}
                    alt={project.title}
                    className="h-full w-full object-cover"
                />
                <Badge variant={status.variant} className="absolute top-2 right-2 bg-white/90">
                    {status.label}
                </Badge>
                {project.isFeatured && (
                    <Badge className="absolute top-2 left-2 bg-[#C15F3C] text-white hover:bg-[#C15F3C]">
                        {t('card.featured')}
                    </Badge>
                )}
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex flex-wrap gap-1.5">
                    {project.departmentName && (
                        <Badge variant="outline" className="gap-1 font-normal">
                            <Building2 />
                            {project.departmentName}
                        </Badge>
                    )}
                    {project.courseName && (
                        <Badge variant="outline" className="font-normal">
                            {project.courseName}
                        </Badge>
                    )}
                </div>

                <h3 className="mb-1.5 line-clamp-2 text-[15px] leading-snug font-medium text-stone-900">
                    {project.title}
                </h3>

                <p className="mb-3 line-clamp-2 flex-1 text-[13px] leading-relaxed text-stone-500">
                    {project.description}
                </p>

                <div className="mb-3 space-y-1 border-t border-stone-100 pt-3">
                    {project.publishedAt && (
                        <div className="flex items-center gap-1.5 text-[13px] text-stone-500">
                            <Calendar className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                            {t('card.published')} {new Date(project.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Yangon' })}
                        </div>
                    )}
                    {project.academic_year && (
                        <div className="flex items-center gap-1.5 text-[13px] text-stone-500">
                            <Calendar className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                            {project.academic_year}
                        </div>
                    )}
                    {project.student_year && (
                        <div className="flex items-center gap-1.5 text-[13px] text-stone-500">
                            <GraduationCap className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                            {project.student_year}
                        </div>
                    )}
                    {project.supervisorName && (
                        <div className="flex items-center gap-1.5 text-[13px] text-stone-500">
                            <UserRoundCheck className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                            {project.supervisorName}
                        </div>
                    )}
                </div>

                {project.tags?.length > 0 && (
                    <div className="mt-auto mb-3 flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 3).map((tag: any) => (
                            <Badge key={tag.id ?? tag.name} variant="secondary" className="font-normal">
                                {typeof tag === 'object' ? tag.name : tag}
                            </Badge>
                        ))}
                        {project.tags.length > 3 && (
                            <Badge variant="secondary" className="font-normal">+{project.tags.length - 3}</Badge>
                        )}
                    </div>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-3">
                    <div className="flex items-center gap-1.5 text-[13px] text-stone-500">
                        <Heart className="h-3.5 w-3.5" />
                        {project.reactionCount ?? 0} {t('card.likes')}
                    </div>
                    <Link
                        href={`/projects/${project.id}/view`}
                        className="flex items-center gap-1 text-[13px] font-medium text-stone-700 hover:text-stone-900"
                    >
                        {t('card.view_details')} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
