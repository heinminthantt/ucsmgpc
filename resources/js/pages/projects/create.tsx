import { Icon } from '@iconify/react';
import { Head, router } from '@inertiajs/react';
import { useState, useMemo, lazy, Suspense, useRef } from 'react';
import { toast } from 'sonner';
import { ErrorBoundary } from '@/components/error-boundary';
import {
    Button, Badge, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui';
import { useDepartments, useAllCourses, useSupervisors } from '@/hooks/useCatalog';
import api from '@/lib/api';
import 'react-quill-new/dist/quill.snow.css';

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

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
    return (
        <div>
            <h2 className="text-sm font-medium text-foreground">{title}</h2>
            {hint && <p className="mt-0.5 text-[13px] text-muted-foreground">{hint}</p>}
        </div>
    );
}

const sectionClass = 'rounded-xl border border-border bg-card p-5 space-y-4';
const textareaClass =
    'w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-border';

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

                        if (!file) {
return;
}

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
        body: '', githubLink: '', demoVideoUrl: '', academic_year: '', student_year: '',
        departmentId: '', courseId: '', supervisorId: '',
    });
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [members, setMembers] = useState<Member[]>([{ name: '', rollNumber: '' }]);
    const [files, setFiles] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const academicYears = useMemo(() => {
        const list: string[] = [];

        for (let y = 2020; y <= new Date().getFullYear() - 1; y++) {
list.push(`${y}-${y + 1}`);
}

        return list.reverse();
    }, []);

    const filteredCourses = useMemo(() => {
        if (!form.departmentId || !form.student_year || !allCourses) {
return [];
}

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

        if (form.benefits) {
fd.append('benefits', form.benefits);
}

        if (form.body) {
fd.append('body', form.body);
}

        if (form.githubLink) {
fd.append('github_link', form.githubLink);
}

        if (form.demoVideoUrl) {
fd.append('demo_video_url', form.demoVideoUrl);
}

        fd.append('academic_year', form.academic_year);
        fd.append('student_year', form.student_year);
        fd.append('department_id', form.departmentId);
        fd.append('course_id', form.courseId);

        if (form.supervisorId) {
fd.append('supervisor_id', form.supervisorId);
}

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

    return (
        <>
            <Head title="Create Project" />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold text-foreground">Create new project</h1>
                    <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                        Fill in the details, write your report, and submit the project to your supervisor for review.
                    </p>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="grid items-start gap-6 lg:grid-cols-[1fr_2fr]">
                        <div className="space-y-5">
                            <section className={sectionClass}>
                                <SectionHeader title="General information" hint="Title, summary, and objectives" />
                                <div className="space-y-1.5">
                                    <Label htmlFor="title">Title <span className="text-muted-foreground/70" aria-hidden="true">*</span></Label>
                                    <Input id="title" required maxLength={255} placeholder="AI-powered chatbot"
                                        value={form.title} onChange={(e) => set('title', e.target.value)} />
                                    <p className={`text-right text-xs tabular-nums ${form.title.length > 230 ? 'text-red-600' : 'text-muted-foreground/70'}`}>
                                        {form.title.length}/255
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="description">Short description <span className="text-muted-foreground/70" aria-hidden="true">*</span></Label>
                                    <textarea id="description" required rows={3}
                                        className={textareaClass}
                                        placeholder="A brief summary readers will see on the catalog card..."
                                        value={form.description} onChange={(e) => set('description', e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="objectives">Objectives <span className="text-muted-foreground/70" aria-hidden="true">*</span></Label>
                                    <textarea id="objectives" required rows={3}
                                        className={textareaClass}
                                        placeholder="What does this project aim to achieve?"
                                        value={form.objectives} onChange={(e) => set('objectives', e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="githubLink">GitHub link</Label>
                                    <Input id="githubLink" type="url" placeholder="https://github.com/..."
                                        value={form.githubLink} onChange={(e) => set('githubLink', e.target.value)} />
                                    <p className="text-[13px] text-muted-foreground">Optional. Use the form https://github.com/owner/repository. The link is checked when you save.</p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="demoVideoUrl">Demo video link</Label>
                                    <Input id="demoVideoUrl" type="url" placeholder="https://www.youtube.com/watch?v=..."
                                        value={form.demoVideoUrl} onChange={(e) => set('demoVideoUrl', e.target.value)} />
                                    <p className="text-[13px] text-muted-foreground">Optional. YouTube or Vimeo only. It is embedded on the public project page.</p>
                                </div>
                            </section>

                            <section className={sectionClass}>
                                <SectionHeader title="Academic settings" hint="Year, semester, department, and course" />
                                {[
                                    { label: 'Academic year', required: true, field: 'academic_year', items: academicYears.map((y) => ({ v: y, l: y })), placeholder: 'Select year' },
                                    { label: 'Semester', required: true, field: 'student_year', items: SEMESTERS.map((s) => ({ v: s, l: s })), placeholder: 'Select semester' },
                                ].map(({ label, required, field, items, placeholder }) => (
                                    <div key={field} className="space-y-1.5">
                                        <Label>{label} {required && <span className="text-muted-foreground/70" aria-hidden="true">*</span>}</Label>
                                        <Select value={(form as any)[field]} onValueChange={(v) => {
                                            set(field, v);

                                            if (field === 'student_year') {
set('courseId', '');
}
                                        }}>
                                            <SelectTrigger className="w-full"><SelectValue placeholder={placeholder} /></SelectTrigger>
                                            <SelectContent>
                                                {items.map(({ v, l }) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                                <div className="space-y-1.5">
                                    <Label>Department <span className="text-muted-foreground/70" aria-hidden="true">*</span></Label>
                                    <Select value={form.departmentId} onValueChange={(v) => {
 set('departmentId', v); set('courseId', ''); 
}}>
                                        <SelectTrigger className="w-full"><SelectValue placeholder="Select department" /></SelectTrigger>
                                        <SelectContent>
                                            {departments?.map((d) => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Course <span className="text-muted-foreground/70" aria-hidden="true">*</span></Label>
                                    <Select value={form.courseId} onValueChange={(v) => set('courseId', v)}
                                        disabled={!form.departmentId || !form.student_year}>
                                        <SelectTrigger className="w-full disabled:opacity-60">
                                            <SelectValue placeholder={!form.departmentId ? 'Select department first' : !form.student_year ? 'Select semester first' : 'Select course'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredCourses.length === 0
                                                ? <SelectItem disabled value="_">No courses for this semester</SelectItem>
                                                : filteredCourses.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.code} · {c.name}</SelectItem>)
                                            }
                                        </SelectContent>
                                    </Select>
                                    {(!form.departmentId || !form.student_year) && (
                                        <p className="text-[13px] text-muted-foreground">Courses unlock after choosing a department and semester.</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Supervisor</Label>
                                    <Select value={form.supervisorId} onValueChange={(v) => set('supervisorId', v)}>
                                        <SelectTrigger className="w-full"><SelectValue placeholder="Select supervisor" /></SelectTrigger>
                                        <SelectContent>
                                            {supervisors?.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </section>

                            <section className={sectionClass}>
                                <SectionHeader title="Languages and tools" hint="Up to five technology tags" />
                                <div className="flex gap-2">
                                    <Input placeholder="e.g. react, python" value={tagInput}
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
                                    <p className="text-xs tabular-nums text-muted-foreground/70">{tags.length}/5 tags</p>
                                    {tags.length >= 5 && <p className="text-xs text-muted-foreground">Tag limit reached</p>}
                                </div>
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {tags.map((t) => (
                                            <Badge key={t} variant="secondary" className="gap-1 pr-1">
                                                {t}
                                                <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}
                                                    className="ml-1 rounded-full px-1 hover:bg-muted"
                                                    aria-label={`Remove tag ${t}`}>
                                                    ×
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section className={sectionClass}>
                                <SectionHeader title="Team members" hint="Credit every contributor" />
                                {members.map((m, i) => (
                                    <div key={i} className="space-y-3 rounded-lg border border-border bg-muted/40 p-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[13px] font-medium text-foreground/85">Member {i + 1}</span>
                                            {members.length > 1 && (
                                                <button type="button" onClick={() => setMembers(members.filter((_, j) => j !== i))}
                                                    className="text-xs text-red-600 hover:underline"
                                                    aria-label={`Remove member ${i + 1}`}>
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Name <span className="text-muted-foreground/70" aria-hidden="true">*</span></Label>
                                                <Input required placeholder="Full name" value={m.name}
                                                    onChange={(e) => {
                                                        const n = [...members]; n[i] = { ...n[i], name: e.target.value };
                                                        setMembers(n);
                                                    }} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Roll number</Label>
                                                <Input placeholder="e.g. UCSMG-001" value={m.rollNumber}
                                                    onChange={(e) => {
                                                        const n = [...members]; n[i] = { ...n[i], rollNumber: e.target.value };
                                                        setMembers(n);
                                                    }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" className="w-full"
                                    onClick={() => members.length < 8 && setMembers([...members, { name: '', rollNumber: '' }])}
                                    disabled={members.length >= 8}>
                                    Add member ({members.length}/8)
                                </Button>
                            </section>

                            <section className={sectionClass}>
                                <SectionHeader title="Project files" hint="ZIP archives only, max 50 MB each" />
                                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-6 text-center hover:bg-muted">
                                    <Icon icon="mdi:cloud-upload-outline" className="text-2xl text-muted-foreground/70" aria-hidden="true" />
                                    <span className="text-sm font-medium text-foreground">Click to choose ZIP files</span>
                                    <span className="text-[13px] text-muted-foreground">ZIP files only · max 50 MB each</span>
                                    <input type="file" accept=".zip" multiple className="sr-only"
                                        onChange={(e) => {
                                            if (!e.target.files) {
return;
}

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
                                            <li key={i} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-foreground/85">
                                                <Icon icon="mdi:folder-zip-outline" className="shrink-0 text-muted-foreground/70" aria-hidden="true" />
                                                <span className="flex-1 truncate">{f.name}</span>
                                                <span className="shrink-0 tabular-nums text-muted-foreground/70">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        </div>

                        <section className={`${sectionClass} flex flex-col lg:sticky lg:top-6`}>
                            <SectionHeader title="Project report" hint="The full written report of your work" />
                            <div className="overflow-hidden rounded-lg border border-border bg-card" style={{ minHeight: 520 }}>
                                <ErrorBoundary>
                                    <Suspense fallback={
                                        <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                                            <Icon icon="mdi:loading" className="mr-2 animate-spin" aria-hidden="true" />Loading editor...
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

                            <div className="space-y-3 rounded-lg border border-border bg-muted/40 p-6 text-center">
                                <h3 className="text-sm font-medium text-foreground">Ready to submit?</h3>
                                <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                                    Your project will be added to the catalog and sent to your supervisor for review.
                                </p>
                                <Button type="submit" size="lg" disabled={submitting} className="px-8">
                                    {submitting ? 'Submitting...' : 'Submit project'}
                                </Button>
                            </div>
                        </section>
                    </div>
                </form>
            </div>
        </>
    );
}
