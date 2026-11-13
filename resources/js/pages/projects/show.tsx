import { Head, Link } from '@inertiajs/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft, BadgeCheck, Bookmark, FileDown, Github, Heart, Loader2, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge, Button } from '@/components/ui';
import { useMe, useReactionStatus, useSavedStatus, useComments } from '@/hooks/useCatalog';
import { useT } from '@/i18n';
import api from '@/lib/api';
import type { Project, Comment } from '@/types/catalog';
import 'react-quill-new/dist/quill.snow.css';

interface Props {
    project: Project;
}

export default function ProjectShow({ project }: Props) {
    const t = useT();
    const qc = useQueryClient();
    const { data: me } = useMe();
    const { data: reactionData, refetch: refetchReaction } = useReactionStatus(project.id);
    const { data: savedData, refetch: refetchSaved } = useSavedStatus(project.id);
    const { data: comments, isLoading: commentsLoading } = useComments(project.id);
    const [newComment, setNewComment] = useState('');

    const canEdit = me && project.userId === me.id && project.approvalStatus !== 'APPROVED';

    const members: { name: string; rollNumber?: string }[] = project.membersJson
        ? JSON.parse(project.membersJson)
        : [];

    const reactionMutation = useMutation({
        mutationFn: () => api.post('/reactions/toggle', { project_id: project.id }),
        onSuccess: () => refetchReaction(),
    });

    const saveMutation = useMutation({
        mutationFn: () => api.post('/saved-projects/toggle', { project_id: project.id }),
        onSuccess: () => refetchSaved(),
    });

    const addCommentMutation = useMutation({
        mutationFn: (text: string) => api.post('/comments', { project_id: project.id, comment: text }),
        onSuccess: () => {
            setNewComment('');
            qc.invalidateQueries({ queryKey: ['comments', project.id] });
        },
    });

    const featureMutation = useMutation({
        mutationFn: (featured: boolean) => api.post(`/projects/${project.id}/feature`, { is_featured: featured }),
        onSuccess: () => window.location.reload(),
    });
    const canFeature = me && (me.role === 'ADMIN' || me.role === 'DEPARTMENT_ADMIN');

    const deleteCommentMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/comments/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', project.id] }),
    });

    return (
        <>
            <Head title={project.title} />
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <Link href="/projects" className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900">
                    <ArrowLeft className="h-4 w-4" /> {t('show.back')}
                </Link>

                <header className="mb-8">
                    {project.departmentName && (
                        <p className="mb-2 text-[13px] text-stone-500">
                            {project.departmentId ? (
                                <Link href={`/departments/${project.departmentId}`} className="hover:text-stone-900 hover:underline">{project.departmentName}</Link>
                            ) : project.departmentName}
                        </p>
                    )}
                    <h1 className="text-2xl leading-tight font-semibold text-stone-900 sm:text-3xl">
                        {project.title}
                    </h1>
                    {project.description && (
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-500">
                            {project.description}
                        </p>
                    )}
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-stone-500">
                        <Badge variant="secondary" className="font-normal">{project.approvalStatus}</Badge>
                        {project.isFeatured && (
                            <Badge className="bg-[#C15F3C] font-normal text-white hover:bg-[#C15F3C]">{t('card.featured')}</Badge>
                        )}
                        {project.publishedAt && (
                            <span>{t('card.published')} {format(new Date(project.publishedAt), 'MMM d, yyyy')}</span>
                        )}
                        {(project.courseCode || project.courseName) && (
                            <span>{project.courseCode || project.courseName}</span>
                        )}
                        {project.academic_year && <span>{project.academic_year}</span>}
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <article className="space-y-8 lg:col-span-2">
                        <div className="flex flex-wrap gap-8 rounded-xl border border-stone-200 bg-white p-5">
                            <div>
                                <p className="text-[13px] text-stone-500">{t('show.supervisor')}</p>
                                <p className="mt-0.5 text-sm font-medium text-stone-900">
                                    {project.supervisorName && project.supervisorId ? (
                                        <Link href={`/supervisors/${project.supervisorId}`} className="hover:underline">{project.supervisorName}</Link>
                                    ) : (project.supervisorName || t('show.unassigned'))}
                                </p>
                            </div>
                            <div>
                                <p className="text-[13px] text-stone-500">{t('show.submitted_by')}</p>
                                <p className="mt-0.5 text-sm font-medium text-stone-900">{project.submittedByName || t('show.unknown')}</p>
                            </div>
                        </div>

                        {(project.objectives || project.benefits) && (
                            <div className="grid gap-6 sm:grid-cols-2">
                                {project.objectives && (
                                    <div>
                                        <h2 className="mb-2 text-sm font-medium text-stone-900">{t('show.objectives')}</h2>
                                        <p className="text-sm leading-relaxed text-stone-600">{project.objectives}</p>
                                    </div>
                                )}
                                {project.benefits && (
                                    <div>
                                        <h2 className="mb-2 text-sm font-medium text-stone-900">{t('show.benefits')}</h2>
                                        <p className="text-sm leading-relaxed text-stone-600">{project.benefits}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {project.body && (
                            <div>
                                <h2 className="mb-3 text-base font-medium text-stone-900">{t('show.report')}</h2>
                                <div
                                    className="ql-editor max-w-none p-0 text-sm leading-relaxed text-stone-700"
                                    dangerouslySetInnerHTML={{ __html: project.body }}
                                />
                            </div>
                        )}
                        {project.demoVideoEmbedUrl && (
                            <div>
                                <h2 className="mb-3 text-base font-medium text-stone-900">{t('show.demo_video')}</h2>
                                <div className="aspect-video overflow-hidden rounded-xl border border-stone-200 bg-black">
                                    <iframe
                                        src={project.demoVideoEmbedUrl}
                                        title={t('show.demo_video')}
                                        className="h-full w-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )}
                    </article>

                    <aside className="flex flex-col gap-4">
                        {me && (
                            <div className="rounded-xl border border-stone-200 bg-white p-5">
                                <h2 className="mb-4 text-sm font-medium text-stone-900">{t('show.actions')}</h2>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant={reactionData?.reacted ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => reactionMutation.mutate()}
                                        title={reactionData?.reacted ? 'Unlike' : 'Like'}
                                    >
                                        <Heart className={reactionData?.reacted ? 'fill-current' : ''} />
                                        {reactionData?.count ?? 0} likes
                                    </Button>

                                    <Button
                                        variant={savedData ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => saveMutation.mutate()}
                                        title={savedData ? 'Unsave' : 'Save'}
                                    >
                                        <Bookmark className={savedData ? 'fill-current' : ''} />
                                        {savedData ? 'Saved' : 'Save'}
                                    </Button>

                                    {(me?.id === project.userId || me?.role === 'ADMIN') && (
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/projects/${project.id}/edit`} title="Edit project">
                                                <Pencil /> Edit
                                            </Link>
                                        </Button>
                                    )}
                                </div>

                                {canEdit && (
                                    <Button asChild className="mt-3 w-full" size="sm">
                                        <Link href={`/projects/${project.id}/edit`}>Edit report</Link>
                                    </Button>
                                )}

                                {canFeature && !!project.publishedAt && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-3 w-full"
                                        disabled={featureMutation.isPending}
                                        onClick={() => featureMutation.mutate(!project.isFeatured)}
                                    >
                                        {project.isFeatured ? 'Remove featured' : 'Mark as featured'}
                                    </Button>
                                )}
                            </div>
                        )}

                        {members.length > 0 && (
                            <div className="rounded-xl border border-stone-200 bg-white p-5">
                                <h2 className="mb-3 text-sm font-medium text-stone-900">{t('show.team_members')}</h2>
                                <ul className="divide-y divide-stone-100">
                                    {members.map((m, i) => (
                                        <li key={i} className="flex items-center justify-between py-2 text-sm first:pt-0 last:pb-0">
                                            <span className="text-stone-700">{m.name}</span>
                                            {m.rollNumber && <span className="text-[13px] text-stone-500">{m.rollNumber}</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {project.tags?.length > 0 && (
                            <div className="rounded-xl border border-stone-200 bg-white p-5">
                                <h2 className="mb-3 text-sm font-medium text-stone-900">{t('show.tags')}</h2>
                                <div className="flex flex-wrap gap-1.5">
                                    {project.tags.map((t) => (
                                        <Badge key={t} variant="secondary" className="font-normal">
                                            {t}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(project.githubLink || project.projectFiles?.length > 0) && (
                            <div className="rounded-xl border border-stone-200 bg-white p-5">
                                <h2 className="mb-3 text-sm font-medium text-stone-900">{t('show.links_files')}</h2>
                                <div className="space-y-2">
                                    {project.githubLink && (
                                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center justify-between text-sm text-stone-700 hover:text-stone-900">
                                            <span>{t('show.source_code')}</span>
                                            <Github className="h-4 w-4 text-stone-400" />
                                        </a>
                                    )}
                                    {project.githubLink && project.githubVerifiedAt && (
                                        <p className="flex items-center gap-1.5 text-[13px] text-emerald-700">
                                            <BadgeCheck className="h-4 w-4" /> {t('show.github_verified')}
                                        </p>
                                    )}
                                    {project.projectFiles?.length > 0 && (
                                        <div className="space-y-2 border-t border-stone-100 pt-2">
                                            {[...project.projectFiles].reverse().map((url, i) => (
                                                <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center justify-between text-sm text-stone-700 hover:text-stone-900">
                                                    <span>Document {i + 1}</span>
                                                    <FileDown className="h-4 w-4 text-stone-400" />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>

                {me && (
                    <section className="mt-10 border-t border-stone-200 pt-8">
                        <h2 className="mb-1 text-base font-medium text-stone-900">{t('show.comments')}</h2>
                        <p className="mb-6 text-[13px] text-stone-500">Share feedback on this project.</p>

                        <div className="max-w-3xl space-y-8">
                            <div className="rounded-xl border border-stone-200 bg-white p-4">
                                <label htmlFor="new-comment" className="mb-2 block text-sm font-medium text-stone-900">Add a comment</label>
                                <textarea
                                    id="new-comment"
                                    rows={3}
                                    className="w-full resize-none rounded-lg border border-stone-200 bg-white p-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-300 focus:ring-0 focus:outline-none"
                                    placeholder="Write your feedback..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <div className="mt-2 flex justify-end">
                                    <Button
                                        size="sm"
                                        disabled={!newComment.trim() || addCommentMutation.isPending}
                                        onClick={() => newComment.trim() && addCommentMutation.mutate(newComment)}
                                    >
                                        {addCommentMutation.isPending ? 'Posting...' : 'Post comment'}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {commentsLoading ? (
                                    <div className="flex justify-center py-6">
                                        <Loader2 className="h-5 w-5 animate-spin text-stone-400" />
                                    </div>
                                ) : (comments ?? []).length === 0 ? (
                                    <p className="py-6 text-center text-sm text-stone-500">No comments yet.</p>
                                ) : (
                                    (comments ?? []).map((c: Comment) => (
                                        <div key={c.id} className="flex gap-3 border-b border-stone-100 pb-6">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-medium text-stone-600">
                                                {c.userName?.[0] ?? '?'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="mb-1.5 flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-stone-900">{c.userName ?? 'Anonymous'}</span>
                                                        {c.userId === me.id && <Badge variant="secondary" className="font-normal">You</Badge>}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[13px] text-stone-500">
                                                            {format(new Date(c.createdAt), 'MMM d, yyyy')}
                                                        </span>
                                                        {c.userId === me.id && (
                                                            <button
                                                                onClick={() => deleteCommentMutation.mutate(c.id)}
                                                                className="text-stone-400 hover:text-stone-900"
                                                                aria-label="Delete comment"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-sm leading-relaxed text-stone-700">{c.comment}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
