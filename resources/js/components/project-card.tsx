import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, GraduationCap, Heart, UserRoundCheck } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Badge } from '@/components/ui';
import { useLocale, useT } from '@/i18n';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/catalog';

interface Props {
    project: Project;
}

const statusStyles = {
    APPROVED: 'border-emerald-700/20 bg-emerald-50/95 text-emerald-800',
    PENDING: 'border-amber-600/25 bg-amber-50/95 text-amber-800',
    REJECTED: 'border-red-700/20 bg-red-50/95 text-red-700',
};

export function ProjectCard({ project }: Props) {
    const t = useT();
    const { locale } = useLocale();
    const statusLabel = {
        APPROVED: t('card.approved'),
        PENDING: t('card.pending'),
        REJECTED: t('card.rejected'),
    }[project.approvalStatus] ?? t('card.pending');

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-[0_18px_40px_-24px_rgba(19,42,69,0.35)]">
            <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-muted">
                <Link href={`/projects/${project.id}/view`} aria-label={project.title} className="block h-full w-full">
                    {project.coverImageUrl ? (
                        <img
                            src={project.coverImageUrl}
                            alt={project.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--secondary),color-mix(in_srgb,var(--gold)_14%,var(--secondary)))]">
                            <AppLogoIcon className="size-16 opacity-25" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,30,51,0.28),transparent_55%)]" />
                </Link>

                <span className={cn('absolute top-3 right-3 rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wide backdrop-blur', statusStyles[project.approvalStatus] ?? statusStyles.PENDING)}>
                    {statusLabel}
                </span>
                {project.isFeatured && (
                    <span className="absolute top-3 left-3 rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary">
                        {t('card.featured')}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                {(project.departmentName || project.courseName) && (
                    <p className="truncate text-[10px] font-medium tracking-[0.16em] text-gold uppercase">
                        {project.departmentName ?? project.courseName}
                    </p>
                )}

                <h3 className="font-display mt-2 line-clamp-2 text-lg leading-snug font-medium text-foreground">
                    <Link href={`/projects/${project.id}/view`} className="transition-colors hover:text-primary dark:hover:text-gold">
                        {project.title}
                    </Link>
                </h3>

                <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                    {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
                    {project.publishedAt && (
                        <span className="flex items-center gap-1.5">
                            <Calendar className="size-3.5 text-gold/80" />
                            {new Date(project.publishedAt).toLocaleDateString(locale === 'my' ? 'my-MM' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Yangon' })}
                        </span>
                    )}
                    {(project.academic_year || project.student_year) && (
                        <span className="flex items-center gap-1.5">
                            <GraduationCap className="size-3.5 text-gold/80" />
                            {[project.academic_year, project.student_year].filter(Boolean).join(' · ')}
                        </span>
                    )}
                    {project.supervisorName && (
                        <span className="flex min-w-0 items-center gap-1.5">
                            <UserRoundCheck className="size-3.5 shrink-0 text-gold/80" />
                            <span className="truncate">{project.supervisorName}</span>
                        </span>
                    )}
                </div>

                {project.tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
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

                <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3">
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Heart className="size-3.5 text-gold/80" />
                        {project.reactionCount ?? 0} {t('card.likes')}
                    </span>
                    <Link
                        href={`/projects/${project.id}/view`}
                        className="flex items-center gap-1 text-[12px] font-medium text-foreground transition-colors hover:text-gold"
                    >
                        {t('card.view_details')} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
