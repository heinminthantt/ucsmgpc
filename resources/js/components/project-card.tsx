import { Link } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { Badge, Button, Card, CardContent, Caption } from 'journal-ds';
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
        <Card withVignette className="group flex flex-col overflow-hidden h-full transition-all hover:shadow-lg hover:-translate-y-0.5">
            {/* Cover */}
            <div className="relative h-36 overflow-hidden bg-journal-warm/20 shrink-0">
                <img
                    src={project.coverImageUrl || 'https://i.ibb.co/3yYHDr3s/6306486.jpg'}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-2.5 right-2.5">
                    <Badge className="text-xs shadow-sm">{status.label}</Badge>
                </div>
            </div>

            <CardContent className="flex flex-col flex-1 gap-3 p-5">
                {/* Dept / Course */}
                <div className="flex flex-wrap gap-1.5">
                    {project.departmentName && (
                        <Badge variant="secondary" className="text-xs gap-1 py-0.5">
                            <Icon icon="mdi:office-building-outline" className="text-[10px]" />
                            {project.departmentName}
                        </Badge>
                    )}
                    {project.courseName && (
                        <Badge variant="outline" className="text-xs py-0.5">{project.courseName}</Badge>
                    )}
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-base leading-snug line-clamp-2 text-journal-ink group-hover:text-journal-burgundy transition-colors">
                    {project.title}
                </h3>

                {/* Description */}
                <p className="font-serif text-sm text-journal-ink-light line-clamp-2 flex-1 leading-relaxed">
                    {project.description}
                </p>

                {/* Meta */}
                <div className="space-y-1.5">
                    {project.academic_year && (
                        <Caption variant="meta" className="flex items-center gap-1.5">
                            <Icon icon="mdi:calendar-outline" className="shrink-0" />
                            {project.academic_year}
                        </Caption>
                    )}
                    {project.student_year && (
                        <Caption variant="meta" className="flex items-center gap-1.5">
                            <Icon icon="mdi:school-outline" className="shrink-0" />
                            {project.student_year}
                        </Caption>
                    )}
                    {project.supervisorName && (
                        <Caption variant="meta" className="flex items-center gap-1.5">
                            <Icon icon="mdi:account-tie-outline" className="shrink-0" />
                            {project.supervisorName}
                        </Caption>
                    )}
                </div>

                {/* Tags — FIX: Target the tag.id and tag.name object values */}
                {project.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag: any) => (
                            <Badge key={tag.id ?? tag.name} variant="outline" className="text-xs py-0 px-1.5">
                                {typeof tag === 'object' ? tag.name : tag}
                            </Badge>
                        ))}
                        {project.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs py-0 px-1.5">+{project.tags.length - 3}</Badge>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-journal-rule/50 mt-auto">
                    <div className="flex items-center gap-1 text-xs text-journal-sepia">
                        <Icon icon="mdi:heart-outline" />
                        {project.reactionCount ?? 0}
                    </div>
                    <Link href={`/projects/${project.id}/view`}>
                        <Button size="sm" className="gap-1 text-xs">
                            View
                            <Icon icon="mdi:arrow-right" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}