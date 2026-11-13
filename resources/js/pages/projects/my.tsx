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
import api from '@/lib/api';
import type { Project } from '@/types/catalog';

type ProjectWithStatus = Project & { status?: string };

type SubmissionReview = {
    id: number;
    reviewerName?: string;
    decision: string;
    comment?: string | null;
    createdAt?: string;
};

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
            supervisorId: project.supervisorId ? String(project.supervisorId) : '',
        });
    }

    const [busy, setBusy] = useState<string | null>(null);


    const { data: submissions } = useQuery<Submission[]>({
        queryKey: ['submissions', project?.id],
        queryFn: () => api.get(`/projects/${project!.id}/submissions`).then((r) => r.data),
        enabled: !!project,
    });

    const set = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

    const refresh = async () => {
        await queryClient.invalidateQueries({ queryKey: ['userProjects'] });
        await queryClient.invalidateQueries({ queryKey: ['submissions'] });
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

    const submitStage = async (stage: 'proposal' | 'final') => {
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
            } else {
                await api.post(`/projects/${project.id}/submit`, { ...draftPayload(), stage });
            }

            toast.success(stage === 'proposal' ? 'Proposal submitted' : 'Final submission sent');
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
                    <h1 className="text-2xl font-semibold">My project</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Work on your proposal and final submission, and see feedback from your supervisor.</p>
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
                                <Label htmlFor="mp-title">Title</Label>
                                <Input id="mp-title" value={form.title} onChange={(e) => set('title', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="mp-description">Description / abstract</Label>
                                <textarea id="mp-description" rows={3} className={textareaClass} value={form.description} onChange={(e) => set('description', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="mp-objectives">Objectives</Label>
                                <textarea id="mp-objectives" rows={3} className={textareaClass} value={form.objectives} onChange={(e) => set('objectives', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="mp-benefits">Benefits</Label>
                                <textarea id="mp-benefits" rows={2} className={textareaClass} value={form.benefits} onChange={(e) => set('benefits', e.target.value)} />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="mp-github">GitHub link</Label>
                                    <Input id="mp-github" placeholder="https://github.com/..." value={form.githubLink} onChange={(e) => set('githubLink', e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Supervisor</Label>
                                    <Select value={form.supervisorId} onValueChange={(v) => set('supervisorId', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a supervisor" />
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
                                <Label htmlFor="mp-report">Final report (PDF, for final submission)</Label>
                                <Input id="mp-report" type="file" accept=".pdf" onChange={(e) => setReportFile(e.target.files?.[0] ?? null)} />
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1">
                                <Button variant="outline" onClick={saveDraft} disabled={busy !== null}>
                                    {busy === 'draft' ? 'Saving...' : 'Save draft'}
                                </Button>
                                <Button onClick={() => submitStage('proposal')} disabled={busy !== null}>
                                    {busy === 'proposal' ? 'Submitting...' : 'Submit proposal'}
                                </Button>
                                <Button variant="secondary" onClick={() => submitStage('final')} disabled={busy !== null}>
                                    {busy === 'final' ? 'Submitting...' : 'Submit final'}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Proposal needs a title, description, objectives and a supervisor. Final submission needs a description plus a report PDF (uploaded here, or already on the project) or a GitHub link.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-base font-medium">Submission history</h2>
                            {(submissions ?? []).length === 0 && <p className="text-sm text-muted-foreground">Nothing submitted yet.</p>}
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
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
