import { Head } from '@inertiajs/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMe, useSupervisors, useUserProjects } from '@/hooks/useCatalog';
import { useT } from '@/i18n';
import api from '@/lib/api';
import type { Project } from '@/types/catalog';

type ProjectWithStatus = Project & { status?: string };

type SubmissionReview = {
    id: number;
    reviewerName?: string;
    reviewer_role?: string;
    decision: string;
    comment?: string | null;
    createdAt?: string;
    // Present only when the viewer may see rubric scores (staff, or the
    // team after the final result is confirmed).
    scores?: { criterion_key: string; score: number; comment?: string | null }[] | null;
    weightedTotal?: number | null;
};

type LogbookEntry = {
    id: number;
    authorName?: string;
    body: string;
    link?: string | null;
    createdAt?: string;
};

type EvaluationView = {
    resultConfirmed: boolean;
    evaluationConflict: boolean;
    rubricTemplate?: { criteria: { key: string; label: string; weight: number; max: number }[] };
    reviews?: { id: number; reviewerName?: string; reviewer_role?: string; weightedTotal?: number | null }[];
    defense?: { scheduledAt?: string; venue?: string | null; note?: string | null } | null;
};

/** Phase 2 logbook: append-only progress entries written by the team. */
function LogbookSection({ projectId }: { projectId: number }) {
    const t = useT();
    const queryClient = useQueryClient();
    const [body, setBody] = useState('');
    const [link, setLink] = useState('');
    const [posting, setPosting] = useState(false);

    const { data: entries } = useQuery<LogbookEntry[]>({
        queryKey: ['logbook', projectId],
        queryFn: () => api.get(`/projects/${projectId}/logbook`).then((r) => r.data),
    });

    const addEntry = async () => {
        if (!body.trim()) {
            return;
        }

        setPosting(true);

        try {
            await api.post(`/projects/${projectId}/logbook`, { body: body.trim(), link: link.trim() || null });
            setBody('');
            setLink('');
            toast.success('Logbook entry added');
            await queryClient.invalidateQueries({ queryKey: ['logbook', projectId] });
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? 'Could not add the logbook entry');
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className="space-y-3">
            <h2 className="text-base font-medium">{t('my.logbook')}</h2>
            {(entries ?? []).length === 0 && <p className="text-sm text-muted-foreground">{t('my.logbook_empty')}</p>}
            {(entries ?? []).map((e) => (
                <div key={e.id} className="rounded-xl border border-border bg-card p-4 text-sm">
                    <p className="whitespace-pre-wrap">{e.body}</p>
                    {e.link && (
                        <p className="mt-1">
                            <a className="text-primary underline" href={e.link} target="_blank" rel="noreferrer">
                                {e.link}
                            </a>
                        </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                        {e.authorName} {e.createdAt ? `· ${new Date(e.createdAt).toLocaleString()}` : ''}
                    </p>
                </div>
            ))}
            <div className="space-y-2 rounded-xl border border-border bg-card p-4">
                <textarea
                    rows={3}
                    className={textareaClass}
                    placeholder={t('my.logbook_placeholder')}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
                <Input placeholder={t('my.logbook_link')} value={link} onChange={(e) => setLink(e.target.value)} />
                <Button size="sm" onClick={addEntry} disabled={posting || !body.trim()}>
                    {posting ? 'Adding...' : 'Add entry'}
                </Button>
                <p className="text-xs text-muted-foreground">{t('my.logbook_note')}</p>
            </div>
        </div>
    );
}

type Submission = {
    id: number;
    stage: string;
    version: number;
    status: string;
    is_late?: boolean;
    submittedByName?: string;
    submittedAt?: string;
    files?: { id: number; name: string; kind: string; url: string }[];
    reviews?: SubmissionReview[];
};

const STATUS_LABELS: Record<string, string> = {
    draft: 'Draft',
    proposal_submitted: 'Proposal submitted',
    proposal_changes_requested: 'Changes requested',
    proposal_declined: 'Proposal declined',
    in_progress: 'In progress',
    mid_review_submitted: 'Mid review submitted',
    final_submitted: 'Final submitted',
    under_evaluation: 'Under evaluation',
    revision_required: 'Revision required',
    approved_published: 'Published',
    not_passed: 'Not passed',
    archived: 'Archived',
};

const textareaClass =
    'w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring';

export default function MyProject() {
    const t = useT();
    const queryClient = useQueryClient();
    const { data: me } = useMe();
    const { data: myProjects } = useUserProjects(me?.id);
    const { data: supervisors } = useSupervisors();

    const projects = (myProjects ?? []) as ProjectWithStatus[];
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const project = projects.find((p) => p.id === selectedId) ?? projects[0] ?? null;

    const [form, setForm] = useState({
        title: project?.title ?? '',
        description: project?.description ?? '',
        objectives: project?.objectives ?? '',
        benefits: project?.benefits ?? '',
        githubLink: project?.githubLink ?? '',
        demoVideoUrl: project?.demoVideoUrl ?? '',
        supervisorId: project?.supervisorId ? String(project.supervisorId) : '',
    });
    const [reportFile, setReportFile] = useState<File | null>(null);

    // Reset the form when the selected project changes (render-phase state
    // adjustment, the React docs pattern for prop-derived state).
    const [formProjectId, setFormProjectId] = useState<number | null>(null);

    if (project && formProjectId !== project.id) {
        setFormProjectId(project.id);
        setForm({
            title: project.title ?? '',
            description: project.description ?? '',
            objectives: project.objectives ?? '',
            benefits: project.benefits ?? '',
            githubLink: project.githubLink ?? '',
            demoVideoUrl: project.demoVideoUrl ?? '',
            supervisorId: project.supervisorId ? String(project.supervisorId) : '',
        });
    }

    const [busy, setBusy] = useState<string | null>(null);


    const { data: submissions } = useQuery<Submission[]>({
        queryKey: ['submissions', project?.id],
        queryFn: () => api.get(`/projects/${project!.id}/submissions`).then((r) => r.data),
        enabled: !!project,
    });

    const { data: evaluation } = useQuery<EvaluationView>({
        queryKey: ['evaluation', project?.id],
        queryFn: () => api.get(`/projects/${project!.id}/evaluation`).then((r) => r.data),
        enabled: !!project,
    });

    const [midSummary, setMidSummary] = useState('');

    const set = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

    const refresh = async () => {
        await queryClient.invalidateQueries({ queryKey: ['userProjects'] });
        await queryClient.invalidateQueries({ queryKey: ['submissions'] });
        await queryClient.invalidateQueries({ queryKey: ['evaluation'] });
    };

    const errorMessage = (err: any, fallback: string) => {
        const data = err?.response?.data;

        if (data?.missing?.length) {
return `${data.message ?? fallback} Missing: ${data.missing.join(', ')}`;
}

        return data?.message ?? fallback;
    };

    const draftPayload = () => ({
        title: form.title,
        description: form.description,
        objectives: form.objectives,
        benefits: form.benefits || null,
        github_link: form.githubLink || null,
        demo_video_url: form.demoVideoUrl || null,
        supervisor_id: form.supervisorId ? parseInt(form.supervisorId) : null,
    });

    const saveDraft = async () => {
        if (!project) {
return;
}

        setBusy('draft');

        try {
            await api.put(`/projects/${project.id}/draft`, draftPayload());
            toast.success('Draft saved');
            await refresh();
        } catch (err: any) {
            toast.error(errorMessage(err, 'Could not save draft'));
        } finally {
            setBusy(null);
        }
    };

    const submitStage = async (stage: 'proposal' | 'final' | 'mid_review') => {
        if (!project) {
return;
}

        setBusy(stage);

        try {
            if (stage === 'final' && reportFile) {
                const fd = new FormData();
                fd.append('stage', 'final');
                Object.entries(draftPayload()).forEach(([k, v]) => {
                    if (v !== null && v !== '') {
fd.append(k, String(v));
}
                });
                fd.append('project_files[]', reportFile);
                fd.append('file_kind', 'report_pdf');
                await api.post(`/projects/${project.id}/submit`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else if (stage === 'mid_review') {
                await api.post(`/projects/${project.id}/submit`, {
                    ...draftPayload(),
                    stage,
                    payload: { progress_summary: midSummary.trim() },
                });
                setMidSummary('');
            } else {
                await api.post(`/projects/${project.id}/submit`, { ...draftPayload(), stage });
            }

            toast.success(
                stage === 'proposal' ? 'Proposal submitted' : stage === 'mid_review' ? 'Mid-review submitted' : 'Final submission sent',
            );
            await refresh();
        } catch (err: any) {
            toast.error(errorMessage(err, 'Submission failed'));
        } finally {
            setBusy(null);
        }
    };

    const reopen = async () => {
        if (!project) {
return;
}

        setBusy('reopen');

        try {
            await api.post(`/projects/${project.id}/reopen`);
            toast.success('Project reopened as draft');
            await refresh();
        } catch (err: any) {
            toast.error(errorMessage(err, 'Could not reopen'));
        } finally {
            setBusy(null);
        }
    };

    return (
        <>
            <Head title="My project" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">{t('nav.my_project')}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{t('my.subtitle')}</p>
                </div>

                {projects.length === 0 && (
                    <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
                        You do not have a project yet. Create one from <span className="font-medium text-foreground">New project</span> in the sidebar.
                    </div>
                )}

                {projects.length > 1 && (
                    <div className="max-w-sm space-y-1.5">
                        <Label>Project</Label>
                        <Select value={String(project?.id ?? '')} onValueChange={(v) => setSelectedId(parseInt(v))}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {project && (
                    <>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">{STATUS_LABELS[project.status ?? ''] ?? project.approvalStatus}</Badge>
                            {project.supervisorName && <span className="text-sm text-muted-foreground">Supervisor: {project.supervisorName}</span>}
                            {project.status === 'proposal_declined' && (
                                <Button size="sm" variant="outline" onClick={reopen} disabled={busy !== null}>
                                    Reopen as draft
                                </Button>
                            )}
                        </div>

                        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="mp-title">{t('my.title_label')}</Label>
                                <Input id="mp-title" value={form.title} onChange={(e) => set('title', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="mp-description">{t('my.description_label')}</Label>
                                <textarea id="mp-description" rows={3} className={textareaClass} value={form.description} onChange={(e) => set('description', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="mp-objectives">{t('my.objectives_label')}</Label>
                                <textarea id="mp-objectives" rows={3} className={textareaClass} value={form.objectives} onChange={(e) => set('objectives', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="mp-benefits">{t('my.benefits_label')}</Label>
                                <textarea id="mp-benefits" rows={2} className={textareaClass} value={form.benefits} onChange={(e) => set('benefits', e.target.value)} />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="mp-github">{t('my.github_label')}</Label>
                                    <Input id="mp-github" placeholder="https://github.com/..." value={form.githubLink} onChange={(e) => set('githubLink', e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="mp-demo">{t('my.demo_label')}</Label>
                                    <Input id="mp-demo" placeholder="https://www.youtube.com/watch?v=..." value={form.demoVideoUrl} onChange={(e) => set('demoVideoUrl', e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>{t('my.supervisor_label')}</Label>
                                    <Select value={form.supervisorId} onValueChange={(v) => set('supervisorId', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('my.select_supervisor')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(supervisors ?? []).map((s: any) => (
                                                <SelectItem key={s.id} value={String(s.id)}>
                                                    {s.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="mp-report">{t('my.report_label')}</Label>
                                <Input id="mp-report" type="file" accept=".pdf" onChange={(e) => setReportFile(e.target.files?.[0] ?? null)} />
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1">
                                <Button variant="outline" onClick={saveDraft} disabled={busy !== null}>
                                    {busy === 'draft' ? 'Saving...' : t('my.save_draft')}
                                </Button>
                                <Button onClick={() => submitStage('proposal')} disabled={busy !== null}>
                                    {busy === 'proposal' ? 'Submitting...' : t('my.submit_proposal')}
                                </Button>
                                <Button variant="secondary" onClick={() => submitStage('final')} disabled={busy !== null}>
                                    {busy === 'final' ? 'Submitting...' : t('my.submit_final')}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Proposal needs a title, description, objectives and a supervisor. Final submission needs a description plus a report PDF (uploaded here, or already on the project) or a GitHub link.
                            </p>
                        </div>

                        {project.status === 'in_progress' && (
                            <div className="space-y-3 rounded-xl border border-border bg-card p-5">
                                <h2 className="text-base font-medium">{t('my.mid_review')}</h2>
                                <p className="text-sm text-muted-foreground">
                                    Send a short progress summary to your supervisor for the mid-review checkpoint.
                                </p>
                                <textarea
                                    rows={3}
                                    className={textareaClass}
                                    placeholder={t('my.mid_placeholder')}
                                    value={midSummary}
                                    onChange={(e) => setMidSummary(e.target.value)}
                                />
                                <Button variant="secondary" onClick={() => submitStage('mid_review')} disabled={busy !== null || !midSummary.trim()}>
                                    {busy === 'mid_review' ? 'Submitting...' : 'Submit mid-review'}
                                </Button>
                            </div>
                        )}

                        {evaluation && (evaluation.resultConfirmed || evaluation.defense || evaluation.evaluationConflict) && (
                            <div className="space-y-2 rounded-xl border border-border bg-card p-5">
                                <h2 className="text-base font-medium">{t('my.evaluation')}</h2>
                                {evaluation.evaluationConflict && (
                                    <p className="text-sm text-muted-foreground">
                                        Your supervisor and examiner disagreed on the result. A department admin is resolving it.
                                    </p>
                                )}
                                {evaluation.resultConfirmed && (
                                    <div className="space-y-1 text-sm">
                                        {(evaluation.reviews ?? []).map((r) => (
                                            <p key={r.id} className="flex justify-between gap-4">
                                                <span className="text-muted-foreground">
                                                    {r.reviewerName ?? 'Reviewer'} ({(r.reviewer_role ?? '').replace(/_/g, ' ')})
                                                </span>
                                                <span className="font-medium">
                                                    {r.weightedTotal != null ? `${r.weightedTotal} / 100` : 'No rubric scores'}
                                                </span>
                                            </p>
                                        ))}
                                        <p className="text-xs text-muted-foreground">Per-criterion marks are in the submission history below.</p>
                                    </div>
                                )}
                                {evaluation.defense && (
                                    <p className="text-sm text-muted-foreground">
                                        Defense: {evaluation.defense.scheduledAt ? new Date(evaluation.defense.scheduledAt).toLocaleString() : ''}
                                        {evaluation.defense.venue ? ` · ${evaluation.defense.venue}` : ''}
                                        {evaluation.defense.note ? ` · ${evaluation.defense.note}` : ''}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="space-y-3">
                            <h2 className="text-base font-medium">{t('my.history')}</h2>
                            {(submissions ?? []).length === 0 && <p className="text-sm text-muted-foreground">{t('my.history_empty')}</p>}
                            {(submissions ?? []).map((s) => (
                                <div key={s.id} className="rounded-xl border border-border bg-card p-4">
                                    <div className="flex flex-wrap items-center gap-2 text-sm">
                                        <span className="font-medium">
                                            {s.stage} · v{s.version}
                                        </span>
                                        <Badge variant="outline">{s.status}</Badge>
                                        {s.is_late && <Badge variant="destructive">late</Badge>}
                                        <span className="text-muted-foreground">
                                            {s.submittedByName} {s.submittedAt ? `· ${new Date(s.submittedAt).toLocaleString()}` : ''}
                                        </span>
                                    </div>
                                    {(s.files ?? []).length > 0 && (
                                        <p className="mt-2 text-[13px] text-muted-foreground">Files: {s.files!.map((f) => f.name).join(', ')}</p>
                                    )}
                                    {(s.reviews ?? []).map((r) => (
                                        <div key={r.id} className="mt-3 rounded-lg bg-muted px-3 py-2 text-sm">
                                            <span className="font-medium">{r.reviewerName ?? 'Reviewer'}</span> · {r.decision}
                                            {r.comment && <p className="mt-1 text-muted-foreground">{r.comment}</p>}
                                            {r.scores && r.scores.length > 0 && (
                                                <div className="mt-2 space-y-0.5 border-t border-border/60 pt-2 text-[13px]">
                                                    {r.scores.map((sc) => (
                                                        <p key={sc.criterion_key} className="flex justify-between gap-4">
                                                            <span className="text-muted-foreground">
                                                                {evaluation?.rubricTemplate?.criteria.find((c) => c.key === sc.criterion_key)?.label ??
                                                                    sc.criterion_key.replace(/_/g, ' ')}
                                                            </span>
                                                            <span className="font-medium">{sc.score}</span>
                                                        </p>
                                                    ))}
                                                    {r.weightedTotal != null && (
                                                        <p className="flex justify-between gap-4 font-medium">
                                                            <span>Weighted total</span>
                                                            <span>{r.weightedTotal} / 100</span>
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <LogbookSection projectId={project.id} />
                    </>
                )}
            </div>
        </>
    );
}
