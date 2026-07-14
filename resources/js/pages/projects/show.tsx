import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
    Badge, Button, Card, CardContent, CardHeader, Separator,
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from 'journal-ds';
import { useMe, useReactionStatus, useSavedStatus, useComments } from '@/hooks/useCatalog';
import api from '@/lib/api';
import type { Project, Comment } from '@/types/catalog';
import 'react-quill-new/dist/quill.snow.css';

interface Props {
    project: Project;
}

export default function ProjectShow({ project }: Props) {
    const qc = useQueryClient();
    const { data: me } = useMe();
    const { data: reactionData, refetch: refetchReaction } = useReactionStatus(project.id);
    const { data: savedData, refetch: refetchSaved } = useSavedStatus(project.id);
    const { data: comments, isLoading: commentsLoading } = useComments(project.id);
    const [newComment, setNewComment] = useState('');

    const canEdit =
        me && project.userId === me.id && project.approvalStatus !== 'APPROVED';

    const members: { name: string; rollNumber?: string }[] = project.membersJson
        ? JSON.parse(project.membersJson)
        : [];

    // Reaction
    const reactionMutation = useMutation({
        mutationFn: () => api.post('/reactions/toggle', { project_id: project.id }),
        onSuccess: () => refetchReaction(),
    });

    // Save toggle
    const saveMutation = useMutation({
        mutationFn: () => api.post('/saved-projects/toggle', { project_id: project.id }),
        onSuccess: () => refetchSaved(),
    });

    // Comment add
    const addCommentMutation = useMutation({
        mutationFn: (text: string) => api.post('/comments', { project_id: project.id, comment: text }),
        onSuccess: () => {
            setNewComment('');
            qc.invalidateQueries({ queryKey: ['comments', project.id] });
        },
    });

    // Comment delete
    const deleteCommentMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/comments/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', project.id] }),
    });

    const statusCfg = {
        APPROVED: { label: 'Approved', variant: 'success' as const },
        PENDING: { label: 'Pending Review', variant: 'warning' as const },
        REJECTED: { label: 'Rejected', variant: 'destructive' as const },
    };
    const st = statusCfg[project.approvalStatus] ?? statusCfg.PENDING;

    return (
        <>
            <Head title={project.title} />
            <div className="relative min-h-screen bg-background">
                <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {/* Breadcrumb + badges */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                                <Icon icon="mdi:arrow-left" />
                                Projects
                            </Link>
                            <span className="text-muted-foreground">/</span>
                            {project.departmentName && (
                                <Badge variant="secondary">{project.departmentName}</Badge>
                            )}
                            {project.courseName && (
                                <Badge variant="outline">{project.courseCode ? `${project.courseCode}` : project.courseName}</Badge>
                            )}
                            {project.academic_year && <Badge variant="outline">{project.academic_year}</Badge>}
                            {project.student_year && <Badge variant="outline">{project.student_year}</Badge>}
                        </div>

                        {/* Title */}
                        <div className="space-y-3">
                            <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
                                {project.title}
                            </h1>
                            {project.description && (
                                <p className="border-l-4 border-primary pl-4 text-lg text-muted-foreground italic">
                                    {project.description}
                                </p>
                            )}
                        </div>

                        {/* Details card */}
                        <Card withVignette>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                        <Icon icon="mdi:information-outline" className="text-xl text-primary" />
                                    </div>
                                    <h2 className="text-xl font-semibold">Project Details</h2>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-8 md:grid-cols-[3fr_2fr]">
                                    {/* Left */}
                                    <div className="space-y-5">
                                        {project.objectives && (
                                            <DetailBlock icon="mdi:target" title="Objectives">
                                                <p className="text-sm leading-relaxed">{project.objectives}</p>
                                            </DetailBlock>
                                        )}
                                        {project.benefits && (
                                            <DetailBlock icon="mdi:trophy-variant-outline" title="Benefits">
                                                <p className="text-sm leading-relaxed">{project.benefits}</p>
                                            </DetailBlock>
                                        )}
                                        {project.tags?.length > 0 && (
                                            <DetailBlock icon="mdi:tag-multiple-outline" title="Languages & Tools">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {project.tags.map((t) => (
                                                        <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                                                    ))}
                                                </div>
                                            </DetailBlock>
                                        )}
                                    </div>
                                    {/* Right */}
                                    <div className="space-y-5">
                                        <DetailBlock icon="mdi:check-decagram-outline" title="Approval Status">
                                            <Badge variant={st.variant}>{st.label}</Badge>
                                            {project.submittedByName && (
                                                <p className="mt-1 text-xs text-muted-foreground">By: {project.submittedByName}</p>
                                            )}
                                            {project.supervisorName && (
                                                <p className="text-xs text-muted-foreground">Supervisor: {project.supervisorName}</p>
                                            )}
                                            {project.approvedAt && (
                                                <p className="text-xs text-muted-foreground">
                                                    {project.approvalStatus === 'APPROVED' ? 'Approved' : 'Updated'}: {format(new Date(project.approvedAt), 'MMM d, yyyy')}
                                                </p>
                                            )}
                                        </DetailBlock>

                                        {project.githubLink && (
                                            <DetailBlock icon="mdi:github" title="Source Code">
                                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                                                    View on GitHub <Icon icon="mdi:open-in-new" />
                                                </a>
                                            </DetailBlock>
                                        )}

                                        {project.projectFiles?.length > 0 && (
                                            <DetailBlock icon="mdi:file-download-outline" title="Project Files">
                                                <div className="space-y-1.5">
                                                    {[...project.projectFiles].reverse().map((url, i) => (
                                                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                                                            className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                                                            <Icon icon="mdi:file-document-outline" />
                                                            File {i + 1}
                                                            {i === 0 && <Badge variant="secondary" className="text-xs ml-1">Latest</Badge>}
                                                        </a>
                                                    ))}
                                                </div>
                                            </DetailBlock>
                                        )}

                                        {members.length > 0 && (
                                            <DetailBlock icon="mdi:account-group-outline" title="Team Members">
                                                <div className="space-y-1">
                                                    {members.map((m, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-sm">
                                                            <span>{m.name}</span>
                                                            {m.rollNumber && <span className="text-muted-foreground text-xs">({m.rollNumber})</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </DetailBlock>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Body report */}
                        {project.body && (
                            <Card withVignette>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                            <Icon icon="mdi:file-document-outline" className="text-xl text-primary" />
                                        </div>
                                        <h2 className="text-xl font-semibold">Detailed Report</h2>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Separator className="mb-6" />
                                    <div
                                        className="ql-editor prose dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: project.body }}
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Comments */}
                        {me && (
                            <Card withVignette>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                            <Icon icon="mdi:comment-outline" className="text-xl text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold">Comments</h2>
                                            <p className="text-sm text-muted-foreground">{comments?.length ?? 0} comment{(comments?.length ?? 0) !== 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    {/* Add comment */}
                                    <div className="flex gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                            {me.name[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <textarea
                                                rows={3}
                                                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                placeholder="Share your thoughts..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                            />
                                            <div className="flex justify-end">
                                                <Button
                                                    size="sm"
                                                    disabled={!newComment.trim() || addCommentMutation.isPending}
                                                    onClick={() => newComment.trim() && addCommentMutation.mutate(newComment)}
                                                >
                                                    {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* List */}
                                    {commentsLoading ? (
                                        <div className="flex justify-center py-6">
                                            <Icon icon="mdi:loading" className="animate-spin text-2xl text-muted-foreground" />
                                        </div>
                                    ) : (comments ?? []).length === 0 ? (
                                        <p className="text-center text-sm text-muted-foreground py-6">No comments yet. Be the first!</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {(comments ?? []).map((c: Comment) => (
                                                <div key={c.id} className="flex gap-3">
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                                                        {c.userName?.[0]?.toUpperCase() ?? '?'}
                                                    </div>
                                                    <div className="flex-1 rounded-lg bg-muted/40 px-3 py-2">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium">{c.userName ?? 'Unknown'}</span>
                                                                {c.userId === me.id && (
                                                                    <Badge variant="secondary" className="text-xs py-0">You</Badge>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-muted-foreground">
                                                                    {format(new Date(c.createdAt), 'MMM d, yyyy')}
                                                                </span>
                                                                {c.userId === me.id && (
                                                                    <button
                                                                        onClick={() => deleteCommentMutation.mutate(c.id)}
                                                                        className="text-muted-foreground hover:text-destructive transition-colors"
                                                                    >
                                                                        <Icon icon="mdi:delete-outline" className="text-sm" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm leading-relaxed">{c.comment}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </main>

                {/* Floating actions */}
                {me && (
                    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
                        <button
                            onClick={() => reactionMutation.mutate()}
                            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 ${
                                reactionData?.reacted
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-background border-2 border-rose-500 text-rose-500'
                            }`}
                            title={reactionData?.reacted ? 'Unlike' : 'Like'}
                        >
                            <Icon icon={reactionData?.reacted ? 'mdi:heart' : 'mdi:heart-outline'} className="text-xl" />
                        </button>
                        <span className="text-center text-xs font-medium text-muted-foreground">{reactionData?.count ?? 0}</span>

                        <button
                            onClick={() => saveMutation.mutate()}
                            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 ${
                                savedData
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-background border-2 border-amber-500 text-amber-500'
                            }`}
                            title={savedData ? 'Unsave' : 'Save'}
                        >
                            <Icon icon={savedData ? 'mdi:bookmark' : 'mdi:bookmark-outline'} className="text-xl" />
                        </button>

                        {canEdit && (
                            <Link
                                href={`/projects/${project.id}/edit`}
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 hover:bg-primary/90"
                            >
                                <Icon icon="mdi:pencil-outline" className="text-xl" />
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

function DetailBlock({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Icon icon={icon} className="text-primary text-base shrink-0" />
                <h3 className="text-sm font-semibold">{title}</h3>
            </div>
            <div className="pl-6 text-muted-foreground">{children}</div>
        </div>
    );
}
