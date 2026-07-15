import { Head, router } from '@inertiajs/react';
import { useState, useMemo, lazy, Suspense, useRef } from 'react';
import { Icon } from '@iconify/react';
import {
    Button, Badge, Card, CardContent, CardHeader,
    Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
    Heading, Text, OrnamentalDivider,
} from 'journal-ds';
import { toast } from 'sonner';
import { useDepartments, useAllCourses, useSupervisors } from '@/hooks/useCatalog';
import api from '@/lib/api';
import 'react-quill-new/dist/quill.snow.css';
import { ErrorBoundary } from '@/components/error-boundary';

const ReactQuill = lazy(() => import('react-quill-new'));

interface Member { name: string; rollNumber: string }

const SEMESTERS = [
    'Semester I','Semester II','Semester III','Semester IV',
    'Semester V','Semester VI','Semester VII','Semester VIII',
    'Semester IX','Internship','Final Project',
];

const SEMESTER_PREFIXES: Record<string, string[]> = {
    'Semester I': ['CST-11','CS-11','CT-11'],
    'Semester II': ['CST-12','CS-12','CT-12'],
    'Semester III': ['CST-21','CS-21','CT-21'],
    'Semester IV': ['CST-22','CS-22','CT-22'],
    'Semester V': ['CST-31','CS-31','CT-31'],
    'Semester VI': ['CST-32','CS-32','CT-32'],
    'Semester VII': ['CST-41','CS-41','CT-41'],
    'Semester VIII': ['CST-42','CS-42','CT-42'],
    'Semester IX': ['CST-51','CS-51','CT-51'],
    'Internship': ['Internship','In Campus'],
    'Final Project': ['Final'],
};



/* Editorial section header used across every card for a consistent rhythm */
function SectionHeader({ icon, step, title, hint }: { icon: string; step: string; title: string; hint?: string }) {
    return (
        <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
                <Icon icon={icon} className="text-journal-burgundy text-xl shrink-0" />
                <div>
                    <h2 className="font-display text-base font-semibold text-journal-ink leading-tight">{title}</h2>
                    {hint && <p className="text-xs italic font-serif text-journal-sepia mt-0.5">{hint}</p>}
                </div>
            </div>
            <span className="journal-eyebrow text-[0.6rem] text-journal-sepia/70 shrink-0 pt-1">{step}</span>
        </div>
    );
}

export default function ProjectCreate() {
    const { data: departments } = useDepartments();
    const { data: allCourses } = useAllCourses();
    const { data: supervisors } = useSupervisors();

    const quillRef = useRef<any>(null);

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: '1' }, { header: '2' }],
                ['bold','italic','underline','strike','blockquote','code-block'],
                [{ list: 'ordered' },{ list: 'bullet' }],
                [{ indent: '-1' },{ indent: '+1' }],
                [{ align: '' },{ align: 'center' },{ align: 'right' }],
                ['link','image'],
            ],
            handlers: {
                image: () => {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.click();
                    input.onchange = async () => {
                        const file = input.files ? input.files[0] : null;
                        if (!file) return;
                        if (file.size > 10 * 1024 * 1024) {
                            toast.error('Image exceeds 10MB limit');
                            return;
                        }
                        const formData = new FormData();
                        formData.append('image', file);
                        try {
                            const res = await api.post('/projects/upload-image', formData, {
                                headers: { 'Content-Type': 'multipart/form-data' }
                            });
                            const url = res.data.url;
                            const quill = quillRef.current?.getEditor();
                            if (quill) {
                                const range = quill.getSelection(true);
                                quill.insertEmbed(range.index, 'image', url);
                            }
                        } catch (err: any) {
                            toast.error(err.response?.data?.message || 'Failed to upload image');
                        }
                    };
                }
            }
        }
    }), []);

    const [form, setForm] = useState({
        title: '', description: '', objectives: '', benefits: '',
        body: '', githubLink: '', academic_year: '', student_year: '',
        departmentId: '', courseId: '', supervisorId: '',
    });
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [members, setMembers] = useState<Member[]>([{ name: '', rollNumber: '' }]);
    const [files, setFiles] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const academicYears = useMemo(() => {
        const list: string[] = [];
        for (let y = 2020; y <= new Date().getFullYear() - 1; y++) list.push(`${y}-${y + 1}`);
        return list.reverse();
    }, []);

    const filteredCourses = useMemo(() => {
        if (!form.departmentId || !form.student_year || !allCourses) return [];
        const prefixes = SEMESTER_PREFIXES[form.student_year] ?? [];
        return allCourses.filter(
            (c) => c.department_id === parseInt(form.departmentId) &&
                   prefixes.some((p) => c.code?.startsWith(p)),
        );
    }, [form.departmentId, form.student_year, allCourses]);

    const set = (field: string, value: string) =>
        setForm((p) => ({ ...p, [field]: value }));

    const addTag = () => {
        const t = tagInput.trim().toLowerCase();
        if (t && !tags.includes(t) && tags.length < 5) {
            setTags([...tags, t]);
            setTagInput('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const fd = new FormData();

        fd.append('title', form.title);
        fd.append('description', form.description);
        fd.append('objectives', form.objectives);
        if (form.benefits) fd.append('benefits', form.benefits);
        if (form.body) fd.append('body', form.body);
        if (form.githubLink) fd.append('github_link', form.githubLink);
        fd.append('academic_year', form.academic_year);
        fd.append('student_year', form.student_year);
        fd.append('department_id', form.departmentId);
        fd.append('course_id', form.courseId);
        if (form.supervisorId) fd.append('supervisor_id', form.supervisorId);

        tags.forEach((tag) => fd.append('tags[]', tag));

        const validMembers = members.filter((m) => m.name.trim());
        if (validMembers.length) {
            const membersMap = validMembers.reduce((acc, m) => ({ ...acc, [m.name]: m.rollNumber }), {});
            fd.append('members_json', JSON.stringify(membersMap));
        }

        files.forEach((f) => fd.append('project_files[]', f));

        try {
            const res = await api.post('/projects', fd, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
            });
            toast.success('Project submitted for review!');
            router.visit(`/projects/${res.data.id}/view`);
        } catch (err: any) {
            if (err.response?.status === 422 && err.response?.data?.errors) {
                const validationErrors = Object.values(err.response.data.errors).flat().join('\n');
                toast.error(validationErrors || 'Validation failed.');
                console.error('Validation errors:', err.response.data.errors);
            } else {
                toast.error(err.response?.data?.message ?? 'Submission failed');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const textareaClass =
        'w-full resize-none rounded-md border border-input bg-background px-3 py-2 font-serif text-sm leading-relaxed focus:border-journal-burgundy focus:outline-none focus:ring-1 focus:ring-journal-burgundy transition-colors duration-200';

    return (
        <>
            <Head title="Create Project" />
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

                {/* ── Editorial Masthead ─────────────────────────────────── */}
                <header className="text-center space-y-3 mb-10">
                    <p className="journal-eyebrow">New Entry &middot; Catalog Submission</p>
                    <Heading level="h1" className="font-display text-4xl tracking-tight text-journal-ink text-balance">
                        Create New Project
                    </Heading>
                    <Text variant="muted" italic className="font-serif text-base max-w-xl mx-auto text-pretty">
                        Complete the record details on the left, compose your report on the right,
                        and submit the entry to your supervisor for review.
                    </Text>
                    <OrnamentalDivider variant="ornamental" glyph="❦" className="mx-auto pt-2" />
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-[1fr_2fr] items-start">
                        {/* ── Left column ── */}
                        <div className="space-y-5">
                            {/* General info */}
                            <Card withVignette className="border-journal-rule overflow-hidden">
                                <CardHeader className="border-b border-journal-rule/40 bg-journal-warm/5">
                                    <SectionHeader icon="mdi:information-outline" step="01" title="General Information" hint="Title, summary, and objectives" />
                                </CardHeader>
                                <CardContent className="space-y-4 pt-5">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="title" className="font-medium text-journal-ink">
                                            Title <span className="text-journal-burgundy" aria-hidden="true">*</span>
                                        </Label>
                                        <Input id="title" required maxLength={255} placeholder="AI-Powered Chatbot"
                                            className="bg-background focus:ring-1"
                                            value={form.title} onChange={(e) => set('title', e.target.value)} />
                                        <p className={`text-xs text-right tabular-nums ${form.title.length > 230 ? 'text-journal-burgundy' : 'text-journal-sepia/70'}`}>
                                            {form.title.length}/255
                                        </p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="description" className="font-medium text-journal-ink">
                                            Short Description <span className="text-journal-burgundy" aria-hidden="true">*</span>
                                        </Label>
                                        <textarea id="description" required rows={3}
                                            className={textareaClass}
                                            placeholder="A brief summary readers will see on the catalog card..."
                                            value={form.description} onChange={(e) => set('description', e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="objectives" className="font-medium text-journal-ink">
                                            Objectives <span className="text-journal-burgundy" aria-hidden="true">*</span>
                                        </Label>
                                        <textarea id="objectives" required rows={3}
                                            className={textareaClass}
                                            placeholder="What does this project aim to achieve?"
                                            value={form.objectives} onChange={(e) => set('objectives', e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="githubLink" className="font-medium text-journal-ink">GitHub Link</Label>
                                        <div className="relative">
                                            <Icon icon="mdi:github" className="absolute left-3 top-1/2 -translate-y-1/2 text-journal-sepia" aria-hidden="true" />
                                            <Input id="githubLink" type="url" placeholder="https://github.com/..."
                                                className="pl-9 bg-background focus:ring-1"
                                                value={form.githubLink} onChange={(e) => set('githubLink', e.target.value)} />
                                        </div>
                                        <p className="text-xs italic font-serif text-journal-sepia/70">Optional — link the source repository if available.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Academic settings */}
                            <Card withVignette className="border-journal-rule overflow-hidden">
                                <CardHeader className="border-b border-journal-rule/40 bg-journal-warm/5">
                                    <SectionHeader icon="mdi:school-outline" step="02" title="Academic Settings" hint="Year, semester, department, and course" />
                                </CardHeader>
                                <CardContent className="space-y-4 pt-5">
                                    {[
                                        { label: 'Academic Year', required: true, field: 'academic_year', items: academicYears.map((y) => ({ v: y, l: y })), placeholder: 'Select year' },
                                        { label: 'Semester', required: true, field: 'student_year', items: SEMESTERS.map((s) => ({ v: s, l: s })), placeholder: 'Select semester' },
                                    ].map(({ label, required, field, items, placeholder }) => (
                                        <div key={field} className="space-y-1.5">
                                            <Label className="font-medium text-journal-ink">
                                                {label} {required && <span className="text-journal-burgundy" aria-hidden="true">*</span>}
                                            </Label>
                                            <Select value={(form as any)[field]} onValueChange={(v) => {
                                                set(field, v);
                                                if (field === 'student_year') set('courseId', '');
                                            }}>
                                                <SelectTrigger className="w-full bg-background"><SelectValue placeholder={placeholder} /></SelectTrigger>
                                                <SelectContent>
                                                    {items.map(({ v, l }) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                    <div className="space-y-1.5">
                                        <Label className="font-medium text-journal-ink">
                                            Department <span className="text-journal-burgundy" aria-hidden="true">*</span>
                                        </Label>
                                        <Select value={form.departmentId} onValueChange={(v) => { set('departmentId', v); set('courseId', ''); }}>
                                            <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select department" /></SelectTrigger>
                                            <SelectContent>
                                                {departments?.map((d) => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="font-medium text-journal-ink">
                                            Course <span className="text-journal-burgundy" aria-hidden="true">*</span>
                                        </Label>
                                        <Select value={form.courseId} onValueChange={(v) => set('courseId', v)}
                                            disabled={!form.departmentId || !form.student_year}>
                                            <SelectTrigger className="w-full bg-background disabled:opacity-60">
                                                <SelectValue placeholder={!form.departmentId ? 'Select department first' : !form.student_year ? 'Select semester first' : 'Select course'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filteredCourses.length === 0
                                                    ? <SelectItem disabled value="_">No courses for this semester</SelectItem>
                                                    : filteredCourses.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.code} — {c.name}</SelectItem>)
                                                }
                                            </SelectContent>
                                        </Select>
                                        {(!form.departmentId || !form.student_year) && (
                                            <p className="text-xs italic font-serif text-journal-sepia/70">
                                                Courses unlock after choosing a department and semester.
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="font-medium text-journal-ink">Supervisor</Label>
                                        <Select value={form.supervisorId} onValueChange={(v) => set('supervisorId', v)}>
                                            <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select supervisor" /></SelectTrigger>
                                            <SelectContent>
                                                {supervisors?.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tags */}
                            <Card withVignette className="border-journal-rule overflow-hidden">
                                <CardHeader className="border-b border-journal-rule/40 bg-journal-warm/5">
                                    <SectionHeader icon="mdi:tag-multiple-outline" step="03" title="Languages &amp; Tools" hint="Up to five technology tags" />
                                </CardHeader>
                                <CardContent className="space-y-3 pt-5">
                                    <div className="flex gap-2">
                                        <Input placeholder="e.g. react, python" value={tagInput}
                                            className="bg-background focus:ring-1"
                                            aria-label="Add a technology tag"
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                                                    e.preventDefault();
                                                    addTag();
                                                }
                                            }}
                                            disabled={tags.length >= 5} />
                                        <Button type="button" variant="outline" size="sm" onClick={addTag} disabled={tags.length >= 5 || !tagInput.trim()}>
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-journal-sepia/70 tabular-nums">{tags.length}/5 tags</p>
                                        {tags.length >= 5 && <p className="text-xs italic font-serif text-journal-burgundy">Tag limit reached</p>}
                                    </div>
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {tags.map((t) => (
                                                <Badge key={t} variant="secondary" className="gap-1 pr-1">
                                                    {t}
                                                    <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}
                                                        className="ml-1 rounded-full px-1 hover:bg-journal-burgundy/15 hover:text-journal-burgundy transition-colors"
                                                        aria-label={`Remove tag ${t}`}>
                                                        ×
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Members */}
                            <Card withVignette className="border-journal-rule overflow-hidden">
                                <CardHeader className="border-b border-journal-rule/40 bg-journal-warm/5">
                                    <SectionHeader icon="mdi:account-group-outline" step="04" title="Team Members" hint="Credit every contributor" />
                                </CardHeader>
                                <CardContent className="space-y-3 pt-5">
                                    {members.map((m, i) => (
                                        <div key={i} className="rounded-md border border-journal-rule/40 bg-journal-warm/5 p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="journal-eyebrow text-[0.6rem]">Member {i + 1}</span>
                                                {members.length > 1 && (
                                                    <button type="button" onClick={() => setMembers(members.filter((_, j) => j !== i))}
                                                        className="text-xs text-destructive hover:underline underline-offset-2 transition-colors"
                                                        aria-label={`Remove member ${i + 1}`}>
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                    <Label className="text-xs font-medium text-journal-ink">
                                                        Name <span className="text-journal-burgundy" aria-hidden="true">*</span>
                                                    </Label>
                                                    <Input required placeholder="Full name" value={m.name}
                                                        className="bg-background focus:ring-1"
                                                        onChange={(e) => {
                                                            const n = [...members]; n[i] = { ...n[i], name: e.target.value };
                                                            setMembers(n);
                                                        }} />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs font-medium text-journal-ink">Roll Number</Label>
                                                    <Input placeholder="e.g. UCSMG-001" value={m.rollNumber}
                                                        className="bg-background focus:ring-1"
                                                        onChange={(e) => {
                                                            const n = [...members]; n[i] = { ...n[i], rollNumber: e.target.value };
                                                            setMembers(n);
                                                        }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" className="w-full gap-1.5"
                                        onClick={() => members.length < 8 && setMembers([...members, { name: '', rollNumber: '' }])}
                                        disabled={members.length >= 8}>
                                        <Icon icon="mdi:plus" />Add Member ({members.length}/8)
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Files */}
                            <Card withVignette className="border-journal-rule overflow-hidden">
                                <CardHeader className="border-b border-journal-rule/40 bg-journal-warm/5">
                                    <SectionHeader icon="mdi:file-upload-outline" step="05" title="Project Files" hint="ZIP archives only, max 50 MB each" />
                                </CardHeader>
                                <CardContent className="space-y-3 pt-5">
                                    <label className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-journal-rule bg-journal-warm/5 px-4 py-6 text-center cursor-pointer hover:bg-journal-warm/15 hover:border-journal-burgundy/40 transition-colors">
                                        <Icon icon="mdi:cloud-upload-outline" className="text-2xl text-journal-sepia" aria-hidden="true" />
                                        <span className="text-sm font-medium text-journal-ink">Click to choose ZIP files</span>
                                        <span className="text-xs italic font-serif text-journal-sepia/70">ZIP files only &middot; max 50 MB each</span>
                                        <input type="file" accept=".zip" multiple className="sr-only"
                                            onChange={(e) => {
                                                if (!e.target.files) return;
                                                const newFiles = Array.from(e.target.files);
                                                const validFiles = newFiles.filter(f => {
                                                    if (f.size > 50 * 1024 * 1024) {
                                                        toast.error(`File ${f.name} exceeds 50MB limit`);
                                                        return false;
                                                    }
                                                    return true;
                                                });
                                                setFiles(prev => [...prev, ...validFiles]);
                                            }} />
                                    </label>
                                    {files.length > 0 && (
                                        <ul className="space-y-1.5">
                                            {files.map((f, i) => (
                                                <li key={i} className="flex items-center gap-2 rounded-md bg-journal-warm/10 border border-journal-rule/30 px-3 py-2 text-xs text-journal-ink-light">
                                                    <Icon icon="mdi:folder-zip-outline" className="text-journal-burgundy shrink-0" aria-hidden="true" />
                                                    <span className="truncate flex-1">{f.name}</span>
                                                    <span className="tabular-nums text-journal-sepia shrink-0">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* ── Right column — Report editor ── */}
                        <Card withVignette className="flex flex-col border-journal-rule overflow-hidden lg:sticky lg:top-6">
                            <CardHeader className="border-b border-journal-rule/40 bg-journal-warm/5">
                                <SectionHeader icon="mdi:file-document-edit-outline" step="06" title="Project Report" hint="The full written manuscript of your work" />
                            </CardHeader>
                            <CardContent className="flex flex-col flex-1 gap-4 pt-5">
                                <div className="rounded-md border border-journal-rule overflow-hidden bg-background" style={{ minHeight: 520 }}>
                                    <ErrorBoundary>
                                        <Suspense fallback={
                                            <div className="flex items-center justify-center h-64 text-journal-sepia font-serif italic">
                                                <Icon icon="mdi:loading" className="animate-spin mr-2" aria-hidden="true" />Loading editor...
                                            </div>
                                        }>
                                            <ReactQuill
                                                ref={quillRef}
                                                theme="snow"
                                                modules={modules}
                                                placeholder="Write your detailed project report here..."
                                                value={form.body}
                                                onChange={(v) => set('body', v)}
                                                style={{ height: 480 }}
                                            />
                                        </Suspense>
                                    </ErrorBoundary>
                                </div>

                                <OrnamentalDivider variant="ornamental" glyph="❉" className="mx-auto opacity-70" />

                                {/* Submission plate */}
                                <div className="rounded-md border border-journal-rule bg-journal-warm/10 p-6 text-center space-y-3">
                                    <p className="journal-eyebrow">Final Step</p>
                                    <h3 className="font-display text-lg font-semibold text-journal-ink">Ready to submit?</h3>
                                    <p className="font-serif text-sm italic text-journal-sepia max-w-sm mx-auto text-pretty">
                                        Your project will be committed to the catalog and sent to your supervisor for review.
                                    </p>
                                    <Button type="submit" size="lg" disabled={submitting} className="px-10 gap-2">
                                        {submitting ? (
                                            <><Icon icon="mdi:loading" className="animate-spin" aria-hidden="true" />Submitting...</>
                                        ) : (
                                            <><Icon icon="mdi:send-outline" aria-hidden="true" />Submit Project</>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </>
    );
}
