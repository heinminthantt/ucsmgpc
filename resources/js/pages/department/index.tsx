import { Head } from '@inertiajs/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDepartments, useMe } from '@/hooks/useCatalog';
import api from '@/lib/api';

type Cycle = {
    id: number;
    departmentName?: string;
    academic_year: string;
    semester: string;
    project_type: string;
    team_min: number;
    team_max: number;
    supervisor_capacity: number;
    proposal_deadline: string;
    final_deadline: string;
    rubric_template_id?: number | null;
    status: string;
};

type RubricTemplate = {
    id: number;
    name: string;
    passThreshold: number;
    criteria: { key: string; label: string; weight: number; max: number }[];
};

type Analytics = {
    cycleLabel?: string | null;
    totalProjects: number;
    byStatus: Record<string, number>;
    passRate?: number | null;
    evaluatedProjects: number;
    averageRubricTotal?: number | null;
    averageDaysProposalToPublished?: number | null;
    supervisorLoad: { supervisorId: number; supervisorName?: string | null; projects: number }[];
    topTags: { tag: string; projects: number }[];
};

type BoardProject = {
    id: number;
    title: string;
    status: string;
    stage: string;
    teamLeaderName?: string | null;
    supervisorName?: string | null;
    examinerName?: string | null;
    evaluationConflict?: boolean;
    waitingDays?: number | null;
    waitingOver7Days?: boolean;
};

type BoardData = {
    counts: Record<string, number>;
    total: number;
    projects: BoardProject[];
};

/** Phase 2 department board: status counts + per-project waiting time. */
function BoardSection({ cycles }: { cycles: Cycle[] }) {
    const [cycleId, setCycleId] = useState<string>('');

    const { data: board } = useQuery<BoardData>({
        queryKey: ['department-board', cycleId],
        queryFn: () =>
            api
                .get('/department/board', { params: cycleId ? { cycle_id: parseInt(cycleId) } : {} })
                .then((r) => r.data),
    });

    const countEntries = Object.entries(board?.counts ?? {}).filter(([, n]) => n > 0);

    return (
        <section className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-base font-medium">Board</h2>
                <Select value={cycleId || 'all'} onValueChange={(v) => setCycleId(v === 'all' ? '' : v)}>
                    <SelectTrigger className="w-56">
                        <SelectValue placeholder="All cycles" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All cycles</SelectItem>
                        {cycles.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                                {c.academic_year} · {c.semester}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">{board?.total ?? 0} {(board?.total ?? 0) === 1 ? 'project' : 'projects'}</span>
            </div>

            {countEntries.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {countEntries.map(([status, n]) => (
                        <Badge key={status} variant="secondary">
                            {status.replace(/_/g, ' ')}: {n}
                        </Badge>
                    ))}
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-border bg-card">
                {(board?.projects ?? []).length === 0 && (
                    <p className="px-4 py-3 text-sm text-muted-foreground">No projects match.</p>
                )}
                {(board?.projects ?? []).map((p, i) => (
                    <div key={p.id} className={`flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm ${i > 0 ? 'border-t border-border' : ''}`}>
                        <span className="font-medium">{p.title}</span>
                        <Badge variant="outline">{p.status.replace(/_/g, ' ')}</Badge>
                        <span className="text-muted-foreground">Stage: {p.stage.replace(/_/g, ' ')}</span>
                        {p.supervisorName && <span className="text-muted-foreground">Supervisor: {p.supervisorName}</span>}
                        {p.waitingDays != null && (
                            <span className="text-muted-foreground">Waiting {p.waitingDays} day(s)</span>
                        )}
                        {p.waitingOver7Days && <Badge variant="destructive">Waiting over 7 days</Badge>}
                        {p.evaluationConflict && <Badge variant="destructive">Evaluation conflict</Badge>}
                    </div>
                ))}
            </div>
        </section>
    );
}


/** Rubric template picker for the cycle form. */
function RubricSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const { data: templates } = useQuery<RubricTemplate[]>({
        queryKey: ['rubric-templates'],
        queryFn: () => api.get('/rubric-templates').then((r) => r.data),
    });

    return (
        <Select value={value || 'default'} onValueChange={(v) => onChange(v === 'default' ? '' : v)}>
            <SelectTrigger>
                <SelectValue placeholder="Default rubric" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="default">Default rubric</SelectItem>
                {(templates ?? []).map((tpl) => (
                    <SelectItem key={tpl.id} value={String(tpl.id)}>
                        {tpl.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

/** Phase 3 analytics: per-cycle outcome numbers for the department office. */
function AnalyticsSection({ cycles }: { cycles: Cycle[] }) {
    const [cycleId, setCycleId] = useState<string>('');

    const { data: analytics } = useQuery<Analytics>({
        queryKey: ['department-analytics', cycleId],
        queryFn: () =>
            api
                .get('/department/analytics', { params: cycleId ? { cycle_id: parseInt(cycleId) } : {} })
                .then((r) => r.data),
    });

    const maxLoad = Math.max(1, ...(analytics?.supervisorLoad ?? []).map((l) => l.projects));

    return (
        <section className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-base font-medium">Analytics</h2>
                <Select value={cycleId || 'latest'} onValueChange={(v) => setCycleId(v === 'latest' ? '' : v)}>
                    <SelectTrigger className="w-56">
                        <SelectValue placeholder="Latest cycle" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="latest">Latest cycle</SelectItem>
                        {cycles.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                                {c.academic_year} · {c.semester}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {analytics?.cycleLabel && <span className="text-sm text-muted-foreground">{analytics.cycleLabel}</span>}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: 'Projects', value: analytics?.totalProjects ?? 0 },
                    { label: 'Pass rate', value: analytics?.passRate != null ? `${analytics.passRate}%` : 'n/a' },
                    { label: 'Average rubric total', value: analytics?.averageRubricTotal ?? 'n/a' },
                    { label: 'Avg days, proposal to published', value: analytics?.averageDaysProposalToPublished ?? 'n/a' },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
                        <div className="text-xl font-semibold">{stat.value}</div>
                        <div className="text-[13px] text-muted-foreground">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-4">
                    <h3 className="mb-3 text-sm font-medium">Projects by status</h3>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(analytics?.byStatus ?? {}).map(([status, n]) => (
                            <Badge key={status} variant="secondary">
                                {status.replace(/_/g, ' ')}: {n}
                            </Badge>
                        ))}
                        {(analytics?.totalProjects ?? 0) === 0 && <p className="text-sm text-muted-foreground">No projects in this cycle yet.</p>}
                    </div>
                    {(analytics?.topTags ?? []).length > 0 && (
                        <>
                            <h3 className="mt-4 mb-2 text-sm font-medium">Top tags (published)</h3>
                            <div className="flex flex-wrap gap-2">
                                {analytics!.topTags.map((t) => (
                                    <Badge key={t.tag} variant="outline">
                                        {t.tag}: {t.projects}
                                    </Badge>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                    <h3 className="mb-3 text-sm font-medium">Supervisor load</h3>
                    <div className="space-y-2">
                        {(analytics?.supervisorLoad ?? []).map((load) => (
                            <div key={load.supervisorId} className="flex items-center gap-3 text-sm">
                                <span className="w-40 truncate">{load.supervisorName ?? `Supervisor ${load.supervisorId}`}</span>
                                <div className="h-2 flex-1 rounded bg-muted">
                                    <div className="h-2 rounded bg-gold" style={{ width: `${(load.projects / maxLoad) * 100}%` }} />
                                </div>
                                <span className="text-muted-foreground">{load.projects}</span>
                            </div>
                        ))}
                        {(analytics?.supervisorLoad ?? []).length === 0 && <p className="text-sm text-muted-foreground">No supervised projects yet.</p>}
                    </div>
                </div>
            </div>
        </section>
    );
}

/** Phase 3 rubric template management: list, create and edit templates. */
function RubricSection() {
    const queryClient = useQueryClient();
    const { data: templates } = useQuery<RubricTemplate[]>({
        queryKey: ['rubric-templates'],
        queryFn: () => api.get('/rubric-templates').then((r) => r.data),
    });

    const emptyCriterion = { key: '', label: '', weight: '10', max: '100' };
    const [editingId, setEditingId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [passThreshold, setPassThreshold] = useState('50');
    const [criteria, setCriteria] = useState<{ key: string; label: string; weight: string; max: string }[]>([{ ...emptyCriterion }]);
    const [saving, setSaving] = useState(false);

    const startEdit = (tpl: RubricTemplate) => {
        setEditingId(tpl.id);
        setName(tpl.name);
        setPassThreshold(String(tpl.passThreshold));
        setCriteria(tpl.criteria.map((c) => ({ key: c.key, label: c.label, weight: String(c.weight), max: String(c.max) })));
    };

    const reset = () => {
        setEditingId(null);
        setName('');
        setPassThreshold('50');
        setCriteria([{ ...emptyCriterion }]);
    };

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const payload = {
            name,
            pass_threshold: parseFloat(passThreshold),
            criteria: criteria.map((c) => ({ key: c.key, label: c.label, weight: parseFloat(c.weight), max: parseFloat(c.max) })),
        };

        try {
            if (editingId) {
                await api.put(`/rubric-templates/${editingId}`, payload);
            } else {
                await api.post('/rubric-templates', payload);
            }

            toast.success('Rubric template saved');
            reset();
            await queryClient.invalidateQueries({ queryKey: ['rubric-templates'] });
        } catch (err: any) {
            const errors = err?.response?.data?.errors;
            toast.error(errors ? Object.values(errors).flat().join(' ') : (err?.response?.data?.message ?? 'Could not save template'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="space-y-4 rounded-xl border border-border bg-card p-5">
            <div>
                <h2 className="text-base font-medium">Rubric templates</h2>
                <p className="mt-1 text-[13px] text-muted-foreground">
                    Cycles use one template each. Editing a template that a cycle already uses changes future scoring for that cycle, so prefer a new template for the next cycle.
                </p>
            </div>

            <div className="space-y-2">
                {(templates ?? []).map((tpl) => (
                    <div key={tpl.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border px-3 py-2 text-sm">
                        <span className="font-medium">{tpl.name}</span>
                        <span className="text-muted-foreground">Pass at {tpl.passThreshold}</span>
                        <span className="text-muted-foreground">{tpl.criteria.map((c) => `${c.label} ${c.weight}%`).join(' · ')}</span>
                        <Button size="sm" variant="outline" className="ml-auto" onClick={() => startEdit(tpl)}>
                            Edit
                        </Button>
                    </div>
                ))}
            </div>

            <form onSubmit={save} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="rt-name">{editingId ? 'Template name' : 'New template name'}</Label>
                        <Input id="rt-name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="rt-pass">Pass threshold (0 to 100)</Label>
                        <Input id="rt-pass" type="number" min={0} max={100} value={passThreshold} onChange={(e) => setPassThreshold(e.target.value)} required />
                    </div>
                </div>
                <div className="space-y-2">
                    {criteria.map((c, i) => (
                        <div key={i} className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                            <Input placeholder="key, e.g. implementation" value={c.key} onChange={(e) => setCriteria((prev) => prev.map((x, j) => (j === i ? { ...x, key: e.target.value } : x)))} required />
                            <Input placeholder="Label" value={c.label} onChange={(e) => setCriteria((prev) => prev.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} required />
                            <Input placeholder="Weight" type="number" min={0} step="any" value={c.weight} onChange={(e) => setCriteria((prev) => prev.map((x, j) => (j === i ? { ...x, weight: e.target.value } : x)))} required />
                            <Input placeholder="Max score" type="number" min={0} step="any" value={c.max} onChange={(e) => setCriteria((prev) => prev.map((x, j) => (j === i ? { ...x, max: e.target.value } : x)))} required />
                            <Button type="button" variant="outline" size="sm" onClick={() => setCriteria((prev) => prev.filter((_, j) => j !== i))} disabled={criteria.length <= 1}>
                                Remove
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => setCriteria((prev) => [...prev, { ...emptyCriterion }])}>
                        Add criterion
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button type="submit" disabled={saving}>
                        {saving ? 'Saving...' : editingId ? 'Save changes' : 'Create template'}
                    </Button>
                    {editingId && (
                        <Button type="button" variant="outline" onClick={reset}>
                            Cancel editing
                        </Button>
                    )}
                </div>
            </form>
        </section>
    );
}

type ImportError = { row?: number; line?: number; message?: string; [key: string]: unknown };
type ImportPreview = {
    type: string;
    totalRows: number;
    validRows: number;
    errorRows: number;
    errors: ImportError[];
};

export default function Department() {
    const queryClient = useQueryClient();
    const { data: me } = useMe();
    const { data: departments } = useDepartments();
    const role = (me?.role ?? '').toString().toUpperCase();
    // System admins use the /api/admin aliases; department admins the canonical routes.
    const base = role === 'ADMIN' ? '/admin' : '/department';

    const { data: cycles } = useQuery<Cycle[]>({
        queryKey: ['cycles', base],
        queryFn: () => api.get(`${base}/cycles`).then((r) => (Array.isArray(r.data) ? r.data : (r.data.data ?? r.data.cycles ?? []))),
        enabled: !!me,
    });

    const [form, setForm] = useState({
        department_id: '',
        academic_year: '',
        semester: '',
        project_type: 'final_year_project',
        team_min: '3',
        team_max: '5',
        supervisor_capacity: '6',
        proposal_deadline: '',
        mid_deadline: '',
        final_deadline: '',
        report_pdf_visibility: 'university',
        rubric_template_id: '',
        status: 'open',
    });
    const [creating, setCreating] = useState(false);
    const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

    const createCycle = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        try {
            await api.post(`${base}/cycles`, {
                department_id: parseInt(form.department_id),
                academic_year: form.academic_year,
                semester: form.semester,
                project_type: form.project_type,
                team_min: parseInt(form.team_min),
                team_max: parseInt(form.team_max),
                supervisor_capacity: parseInt(form.supervisor_capacity),
                proposal_deadline: form.proposal_deadline,
                mid_deadline: form.mid_deadline || null,
                final_deadline: form.final_deadline,
                report_pdf_visibility: form.report_pdf_visibility,
                rubric_template_id: form.rubric_template_id ? parseInt(form.rubric_template_id) : null,
                status: form.status,
            });
            toast.success('Cycle created');
            await queryClient.invalidateQueries({ queryKey: ['cycles'] });
        } catch (err: any) {
            const errors = err?.response?.data?.errors;
            toast.error(errors ? Object.values(errors).flat().join(' ') : (err?.response?.data?.message ?? 'Could not create cycle'));
        } finally {
            setCreating(false);
        }
    };

    const closeCycle = async (id: number) => {
        try {
            await api.post(`${base}/cycles/${id}/close`);
            toast.success('Cycle closed');
            await queryClient.invalidateQueries({ queryKey: ['cycles'] });
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? 'Could not close cycle');
        }
    };

    // ── CSV import ──
    const [importType, setImportType] = useState<'students' | 'supervisors'>('students');
    const [importFile, setImportFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<ImportPreview | null>(null);
    const [importBusy, setImportBusy] = useState<string | null>(null);

    const buildFormData = () => {
        const fd = new FormData();
        fd.append('type', importType);

        if (importFile) {
fd.append('file', importFile);
}

        return fd;
    };

    const doPreview = async () => {
        if (!importFile) {
return toast.error('Choose a CSV file first');
}

        setImportBusy('preview');

        try {
            const res = await api.post(`${base}/import/preview`, buildFormData(), { headers: { 'Content-Type': 'multipart/form-data' } });
            setPreview(res.data);
            toast.success(`Preview: ${res.data.validRows} valid, ${res.data.errorRows} with errors`);
        } catch (err: any) {
            toast.error(err?.response?.data?.message ?? 'Preview failed');
        } finally {
            setImportBusy(null);
        }
    };

    const doConfirm = async () => {
        if (!importFile) {
return toast.error('Choose a CSV file first');
}

        setImportBusy('confirm');

        try {
            const res = await api.post(`${base}/import/confirm`, buildFormData(), { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success(res.data?.message ?? 'Import complete');
            setPreview(null);
            setImportFile(null);
        } catch (err: any) {
            const data = err?.response?.data;

            if (data?.errors) {
setPreview({ type: importType, totalRows: 0, validRows: 0, errorRows: data.errors.length, errors: data.errors });
}

            toast.error(data?.message ?? 'Import failed');
        } finally {
            setImportBusy(null);
        }
    };

    return (
        <>
            <Head title="Department" />
            <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div>
                    <h1 className="text-3xl font-semibold">Department</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Academic cycles and cohort import for your department.</p>
                </div>

                <section className="space-y-3">
                    <h2 className="text-base font-medium">Cycles</h2>
                    {(cycles ?? []).length === 0 && <p className="text-sm text-muted-foreground">No cycles yet. Create the first one below.</p>}
                    {(cycles ?? []).length > 0 && (
                        <div className="overflow-hidden rounded-xl border border-border bg-card">
                            {(cycles ?? []).map((c, i) => (
                                <div key={c.id} className={`flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm ${i > 0 ? 'border-t border-border' : ''}`}>
                                    <span className="font-medium">
                                        {c.academic_year} · {c.semester}
                                    </span>
                                    <span className="text-muted-foreground">{c.departmentName}</span>
                                    <span className="text-muted-foreground">{c.project_type === 'final_year_project' ? 'Final year project' : 'Course project'}</span>
                                    <span className="text-muted-foreground">
                                        Teams {c.team_min}–{c.team_max} · Final deadline {new Date(c.final_deadline).toLocaleDateString()}
                                    </span>
                                    <span className="ml-auto flex items-center gap-2">
                                        <Badge variant="secondary">{c.status}</Badge>
                                        <a href={`/api/cycles/${c.id}/export?format=csv`}>
                                            <Button size="sm" variant="outline" type="button">
                                                Export CSV
                                            </Button>
                                        </a>
                                        {c.status !== 'closed' && c.status !== 'archived' && (
                                            <Button size="sm" variant="outline" onClick={() => closeCycle(c.id)}>
                                                Close
                                            </Button>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <BoardSection cycles={cycles ?? []} />

                <AnalyticsSection cycles={cycles ?? []} />

                <section className="space-y-4 rounded-xl border border-border bg-card p-5">
                    <h2 className="text-base font-medium">Create cycle</h2>
                    <form onSubmit={createCycle} className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label>Department</Label>
                            <Select value={form.department_id} onValueChange={(v) => set('department_id', v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(departments ?? []).map((d: any) => (
                                        <SelectItem key={d.id} value={String(d.id)}>
                                            {d.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="cy-year">Academic year</Label>
                            <Input id="cy-year" placeholder="2026-2027" value={form.academic_year} onChange={(e) => set('academic_year', e.target.value)} required />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="cy-semester">Semester</Label>
                            <Input id="cy-semester" placeholder="Semester I" value={form.semester} onChange={(e) => set('semester', e.target.value)} required />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Project type</Label>
                            <Select value={form.project_type} onValueChange={(v) => set('project_type', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="final_year_project">Final year project</SelectItem>
                                    <SelectItem value="course_project">Course project</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="cy-min">Team min</Label>
                                <Input id="cy-min" type="number" min={1} value={form.team_min} onChange={(e) => set('team_min', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="cy-max">Team max</Label>
                                <Input id="cy-max" type="number" min={1} value={form.team_max} onChange={(e) => set('team_max', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="cy-cap">Capacity</Label>
                                <Input id="cy-cap" type="number" min={1} value={form.supervisor_capacity} onChange={(e) => set('supervisor_capacity', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Report PDF visibility</Label>
                            <Select value={form.report_pdf_visibility} onValueChange={(v) => set('report_pdf_visibility', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="university">University only</SelectItem>
                                    <SelectItem value="public">Public</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="cy-proposal">Proposal deadline</Label>
                            <Input id="cy-proposal" type="datetime-local" value={form.proposal_deadline} onChange={(e) => set('proposal_deadline', e.target.value)} required />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="cy-mid">Mid review deadline (optional)</Label>
                            <Input id="cy-mid" type="datetime-local" value={form.mid_deadline} onChange={(e) => set('mid_deadline', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="cy-final">Final deadline</Label>
                            <Input id="cy-final" type="datetime-local" value={form.final_deadline} onChange={(e) => set('final_deadline', e.target.value)} required />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Rubric template</Label>
                            <RubricSelect value={form.rubric_template_id} onChange={(v) => set('rubric_template_id', v)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Status</Label>
                            <Select value={form.status} onValueChange={(v) => set('status', v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="setup">Setup</SelectItem>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in_progress">In progress</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="sm:col-span-2">
                            <Button type="submit" disabled={creating}>
                                {creating ? 'Creating...' : 'Create cycle'}
                            </Button>
                        </div>
                    </form>
                </section>

                <section className="space-y-4 rounded-xl border border-border bg-card p-5">
                    <div>
                        <h2 className="text-base font-medium">Import cohort (CSV)</h2>
                        <p className="mt-1 text-[13px] text-muted-foreground">
                            Students: roll_number, name, email, department, student_year. Supervisors: name, email, department, capacity.{' '}
                            <a className="text-primary hover:underline" href={`/api${base}/import/template?type=${importType}`}>
                                Download template
                            </a>
                        </p>
                    </div>
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="space-y-1.5">
                            <Label>Type</Label>
                            <Select value={importType} onValueChange={(v) => {
 setImportType(v as 'students' | 'supervisors'); setPreview(null); 
}}>
                                <SelectTrigger className="w-44">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="students">Students</SelectItem>
                                    <SelectItem value="supervisors">Supervisors</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="import-file">CSV file</Label>
                            <Input id="import-file" type="file" accept=".csv" onChange={(e) => {
 setImportFile(e.target.files?.[0] ?? null); setPreview(null); 
}} />
                        </div>
                        <Button variant="outline" onClick={doPreview} disabled={importBusy !== null}>
                            {importBusy === 'preview' ? 'Checking...' : 'Preview'}
                        </Button>
                        <Button onClick={doConfirm} disabled={importBusy !== null || !preview || preview.errorRows > 0}>
                            {importBusy === 'confirm' ? 'Importing...' : 'Confirm import'}
                        </Button>
                    </div>
                    {preview && (
                        <div className="space-y-2 text-sm">
                            <p>
                                {preview.validRows} valid row(s), {preview.errorRows} with errors. Nothing is imported until you confirm.
                            </p>
                            {preview.errors.map((err, i) => (
                                <p key={i} className="rounded-lg bg-muted px-3 py-2 text-[13px]">
                                    Row {err.row ?? err.line ?? '?'}: {err.message ?? JSON.stringify(err)}
                                </p>
                            ))}
                        </div>
                    )}
                </section>

                <RubricSection />
            </div>
        </>
    );
}
