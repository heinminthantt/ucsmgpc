import { Icon } from '@iconify/react';
import { Head, Link } from '@inertiajs/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    Badge, Button,
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui';
import { useMe, usePendingProjects } from '@/hooks/useCatalog';
import api from '@/lib/api';
import type { Project } from '@/types/catalog';

interface SubmissionItem {
    id: number;
    stage: string;
    version: number;
    status: string;
    submittedAt?: string;
    submittedByName?: string;
    reviews?: unknown[];
}

/**
 * Stage review panel (Phase 1).
 * Loads a project's submissions on demand, picks the latest one still in
 * 'submitted' status, and posts a review decision for it.
 */
function StageReviewPanel({ projectId, onReviewed }: { projectId: number; onReviewed: () => void }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
    const [comment, setComment] = useState('');
    const [reviewing, setReviewing] = useState(false);

    const loadSubmissions = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await api.get(`/projects/${projectId}/submissions`);
            const list = Array.isArray(res.data)
                ? res.data
                : (res.data?.data ?? res.data?.submissions ?? []);
            setSubmissions(Array.isArray(list) ? list : []);
        } catch {
            setError('Could not load submissions for this project.');
            setSubmissions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        setOpen(true);
        loadSubmissions();
    };

    // Highest id is the most recently created submission.
    const latest = submissions
        .filter((s) => s.status === 'submitted')
        .sort((a, b) => b.id - a.id)[0];

    const handleReview = async (decision: 'accept' | 'request_changes' | 'decline') => {
        if (!latest) {
return;
}

        if (decision !== 'accept' && !comment.trim()) {
            toast.error('A comment is required for this decision.');

            return;
        }

        setReviewing(true);

        try {
            await api.post(`/submissions/${latest.id}/review`, {
                decision,
                ...(comment.trim() ? { comment: comment.trim() } : {}),
            });
            toast.success(
                decision === 'accept'
                    ? 'Submission accepted.'
                    : decision === 'request_changes'
                        ? 'Changes requested.'
                        : 'Submission declined.',
            );
            setComment('');
            onReviewed();
            loadSubmissions();
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Review failed');
        } finally {
            setReviewing(false);
        }
    };

    if (!open) {
        return (
            <Button type="button" size="sm" variant="outline" className="w-full" onClick={handleOpen}>
                Review
            </Button>
        );
    }

    return (
        <div className="space-y-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
            <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-stone-900">Stage review</p>
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-xs text-stone-500 hover:underline"
                >
                    Close
                </button>
            </div>

            {loading ? (
                <p className="flex items-center gap-2 text-[13px] text-stone-500">
                    <Icon icon="mdi:loading" className="animate-spin" aria-hidden="true" /> Loading submissions...
                </p>
            ) : error ? (
                <p className="text-[13px] text-red-600">{error}</p>
            ) : !latest ? (
                <p className="text-[13px] text-stone-500">No submission is waiting for a stage review.</p>
            ) : (
                <>
                    <div className="space-y-1 text-[13px] text-stone-600">
                        <p>
                            Stage: <span className="font-medium text-stone-900">{latest.stage.replace(/_/g, ' ')}</span>
                            {' · '}Version {latest.version}
                        </p>
                        {latest.submittedByName && <p>Submitted by {latest.submittedByName}</p>}
                        {latest.submittedAt && (
                            <p>Submitted {new Date(latest.submittedAt).toLocaleString()}</p>
                        )}
                    </div>

                    <textarea
                        rows={3}
                        className="w-full resize-none rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-300"
                        placeholder="Comment (required for request changes and decline)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <div className="flex flex-wrap gap-2">
                        <Button type="button" size="sm" disabled={reviewing} onClick={() => handleReview('accept')}>
                            Accept
                        </Button>
                        <Button type="button" size="sm" variant="outline" disabled={reviewing} onClick={() => handleReview('request_changes')}>
                            Request changes
                        </Button>
                        <Button type="button" size="sm" variant="destructive" disabled={reviewing} onClick={() => handleReview('decline')}>
                            Decline
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

export default function SupervisorDashboard() {
    const qc = useQueryClient();
    const { data: me } = useMe();
    const { data: pending, isLoading, isError } = usePendingProjects();
    const [rejectProject, setRejectProject] = useState<Project | null>(null);
    const [reason, setReason] = useState('');

    const canAccess = me?.role === 'SUPERVISOR' || me?.role === 'ADMIN';

    const refreshPending = () => qc.invalidateQueries({ queryKey: ['pendingProjects'] });

    const approveMutation = useMutation({
        mutationFn: (id: number) => api.post(`/supervisor/projects/${id}/approve`),
        onSuccess: () => {
            refreshPending();
            toast.success('Project approved!');
        },
        onError: () => toast.error('Approval failed'),
    });

    const rejectMutation = useMutation({
        mutationFn: ({ id, reason }: { id: number; reason: string }) =>
            api.post(`/supervisor/projects/${id}/reject`, { reason }),
        onSuccess: () => {
            refreshPending();
            toast.success('Project rejected');
            setRejectProject(null);
            setReason('');
        },
        onError: () => toast.error('Rejection failed'),
    });

    if (!canAccess) {
        return (
            <>
                <Head title="Access denied" />
                <div className="flex h-[60vh] items-center justify-center px-4">
                    <div className="w-full max-w-md space-y-3 rounded-xl border border-stone-200 bg-white p-8 text-center">
                        <Icon icon="mdi:shield-lock-outline" className="mx-auto text-4xl text-stone-400" />
                        <h2 className="text-base font-medium text-stone-900">Access denied</h2>
                        <p className="text-sm text-stone-500">You don't have supervisor access.</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Supervisor dashboard" />
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-xl font-semibold text-stone-900">Supervisor dashboard</h1>
                            <p className="text-sm text-stone-500">Review and approve pending student projects.</p>
                        </div>
                        <div className="rounded-xl border border-stone-200 bg-white px-5 py-3 text-center">
                            <div className="text-2xl font-semibold text-stone-900">{pending?.length ?? 0}</div>
                            <div className="text-xs text-stone-500">Pending</div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <Icon icon="mdi:loading" className="animate-spin text-3xl text-stone-400" />
                        </div>
                    ) : isError ? (
                        <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-8 text-center">
                            <Icon icon="mdi:alert-circle-outline" className="mx-auto text-3xl text-red-600" />
                            <p className="text-sm font-medium text-stone-900">Failed to load projects</p>
                            <Button variant="outline" size="sm" onClick={refreshPending}>Retry</Button>
                        </div>
                    ) : !pending?.length ? (
                        <div className="space-y-2 rounded-xl border border-stone-200 bg-white p-10 text-center">
                            <Icon icon="mdi:check-circle-outline" className="mx-auto text-4xl text-stone-400" />
                            <h2 className="text-base font-medium text-stone-900">All caught up</h2>
                            <p className="text-sm text-stone-500">No projects are waiting for your review.</p>
                        </div>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {pending.map((project: Project) => (
                                <div key={project.id} className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-5">
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="line-clamp-2 text-sm font-medium text-stone-900">{project.title}</h3>
                                            <Badge variant="secondary" className="shrink-0 text-xs">Pending</Badge>
                                        </div>
                                        <p className="line-clamp-2 text-[13px] leading-relaxed text-stone-500">{project.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 rounded-lg bg-stone-50 p-3 text-center">
                                        <div>
                                            <p className="text-xs text-stone-400">Academic year</p>
                                            <p className="mt-0.5 text-sm font-medium text-stone-900">{project.academic_year ?? '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-stone-400">Semester</p>
                                            <p className="mt-0.5 text-sm font-medium text-stone-900">{project.student_year ?? '—'}</p>
                                        </div>
                                    </div>

                                    {project.objectives && (
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-stone-700">Objectives</p>
                                            <p className="line-clamp-3 border-l-2 border-stone-200 pl-3 text-[13px] leading-relaxed text-stone-500">
                                                {project.objectives}
                                            </p>
                                        </div>
                                    )}

                                    {project.tags?.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {project.tags.slice(0, 4).map((t) => (
                                                <Badge key={t} variant="outline" className="py-0 text-xs">{t}</Badge>
                                            ))}
                                            {project.tags.length > 4 && (
                                                <Badge variant="outline" className="py-0 text-xs">+{project.tags.length - 4}</Badge>
                                            )}
                                        </div>
                                    )}

                                    <div className="mt-auto space-y-3 border-t border-stone-100 pt-4">
                                        <div className="grid grid-cols-3 gap-2">
                                            <Button size="sm" className="gap-1"
                                                disabled={approveMutation.isPending}
                                                onClick={() => approveMutation.mutate(project.id)}>
                                                Approve
                                            </Button>
                                            <Button size="sm" variant="destructive" className="gap-1"
                                                onClick={() => setRejectProject(project)}>
                                                Reject
                                            </Button>
                                            <Link href={`/projects/${project.id}/view`}>
                                                <Button size="sm" variant="outline" className="w-full gap-1">
                                                    View
                                                </Button>
                                            </Link>
                                        </div>

                                        <div className="space-y-1.5">
                                            <p className="text-xs font-medium text-stone-700">Stage review</p>
                                            <StageReviewPanel projectId={project.id} onReviewed={refreshPending} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={!!rejectProject} onOpenChange={(o) => !o && setRejectProject(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base">
                            <Icon icon="mdi:alert-circle-outline" />Reject project
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <p className="text-sm text-stone-500">
                            Provide a reason for rejecting <span className="font-medium text-stone-900">"{rejectProject?.title}"</span>.
                        </p>
                        <textarea rows={4} className="w-full resize-none rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-300"
                            placeholder="Detailed rejection reason..."
                            value={reason} onChange={(e) => setReason(e.target.value)} />
                        <p className="rounded-lg bg-stone-50 p-3 text-[13px] text-stone-500">
                            Provide constructive feedback to help the student improve their project.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectProject(null)}>Cancel</Button>
                        <Button disabled={!reason.trim() || rejectMutation.isPending}
                            onClick={() => rejectProject && rejectMutation.mutate({ id: rejectProject.id, reason })}>
                            {rejectMutation.isPending ? 'Rejecting...' : 'Reject project'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
