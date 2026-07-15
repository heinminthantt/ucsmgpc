import { Head } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    Badge, Button, Card, CardContent, CardHeader,
    Avatar, AvatarFallback, AvatarImage,
    Input, Label, Separator,
    Heading, Text,
    OrnamentalDivider,
} from 'journal-ds';
import { useMe, useUserProjects } from '@/hooks/useCatalog';
import { ProjectCard } from '@/components/project-card';
import api from '@/lib/api';

export default function ProfilePage() {
    const qc = useQueryClient();
    const { data: me, refetch: refetchMe } = useMe();
    const { data: myProjects, isLoading: projectsLoading } = useUserProjects(me?.id);

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', bio: '', avatar_url: '' });

    const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [pwLoading, setPwLoading] = useState(false);

    const startEdit = () => {
        setForm({ name: me?.name ?? '', bio: me?.bio ?? '', avatar_url: me?.avatar_url ?? '' });
        setEditing(true);
    };

    const updateMutation = useMutation({
        mutationFn: (data: { name?: string; bio?: string; avatar_url?: string }) =>
            api.put(`/users/${me?.id}`, data),
        onSuccess: () => {
            toast.success('Profile updated!');
            qc.invalidateQueries({ queryKey: ['me'] });
            setEditing(false);
        },
        onError: () => toast.error('Update failed'),
    });


    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
        setPwLoading(true);
        try {
            await api.post(`/users/${me?.id}/change-password`, { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword });
            toast.success('Password changed!');
            setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Change password failed');
        } finally { setPwLoading(false); }
    };

    const roleColors: Record<string, string> = {
        ADMIN: 'destructive', SUPERVISOR: 'warning', USER: 'secondary',
    };

    if (!me) return (
        <div className="flex items-center justify-center h-64">
            <Icon icon="mdi:loading" className="animate-spin text-3xl text-journal-sepia" />
        </div>
    );


    return (
        <>
            <Head title="Profile" />

            <div className="mx-auto max-w-5xl px-6 lg:px-8 py-12">
                <div className="space-y-12">

                    {/* ── Editorial Masthead ─────────────────────────────────── */}
                    <header className="text-center space-y-3">
                        <p className="journal-eyebrow">Author Dossier &middot; Profile</p>
                        <Heading level="h1" className="font-display text-5xl tracking-tight text-journal-ink">
                            {me.name}
                        </Heading>
                        <Text variant="muted" italic className="font-serif text-base max-w-xl mx-auto">
                            A curated record of your credentials, secured account environment, and the works
                            you have committed to the catalog.
                        </Text>
                        <OrnamentalDivider variant="ornamental" glyph="❦" className="mx-auto pt-2" />
                    </header>

                    {/* ── Author Plate ───────────────────────────────────────── */}
                    <Card withVignette withTexture className="border-journal-rule overflow-hidden">
                        <CardHeader className="border-b border-journal-rule/40 bg-journal-warm/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <Icon icon="mdi:account-circle-outline" className="text-journal-burgundy text-2xl" />
                                    <Heading level="h2" className="font-display text-xl text-journal-ink">Identity Details</Heading>
                                </div>
                                {!editing && (
                                    <Button variant="outline" size="sm" onClick={startEdit} className="gap-1.5">
                                        <Icon icon="mdi:pencil-outline" /> Edit Profile
                                    </Button>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="pt-8">
                            <div className="flex flex-col gap-8 md:flex-row items-start">

                                {/* Avatar column */}
                                <div className="flex flex-col items-center text-center gap-3 w-full md:w-52 shrink-0 p-5 rounded-[var(--radius-lg)] bg-journal-warm/10 border border-journal-rule/30">
                                    <div className="relative">
                                        {/* Decorative burgundy frame */}
                                        <div className="absolute -inset-1.5 rounded-full border border-journal-burgundy/25" aria-hidden="true" />
                                        <Avatar size="xl" className="size-28 border-2 border-journal-burgundy/30 shadow-md">
                                            <AvatarFallback className="text-4xl font-display bg-journal-burgundy text-journal-paper">
                                                {me.name[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <Badge variant={(roleColors[me.role] as any) ?? 'secondary'} className="text-xs tracking-wider uppercase px-2.5 py-0.5 mt-2">
                                        {me.role}
                                    </Badge>
                                </div>

                                {/* Details column */}
                                <div className="flex-1 w-full">
                                    {editing ? (
                                        <div className="space-y-6">
                                            <div className="grid gap-6 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label className="font-semibold text-journal-ink">Full Name</Label>
                                                    <Input className="focus:ring-1 bg-background" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-semibold text-journal-ink">Email Address</Label>
                                                    <Input value={me.email} disabled className="opacity-60 bg-journal-warm/20" />
                                                    <p className="text-xs italic text-journal-sepia">System email identity cannot be altered.</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-semibold text-journal-ink">Biography</Label>
                                                <textarea rows={4} className="w-full resize-none rounded-md border border-input bg-background px-4 py-3 font-serif text-sm focus:border-journal-burgundy focus:outline-none focus:ring-1 focus:ring-journal-burgundy transition-all duration-200"
                                                    placeholder="Share a short summary about your background and architectural works..."
                                                    value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} />
                                            </div>
                                            <div className="flex gap-2 pt-2 border-t border-journal-rule/30">
                                                <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                                                <Button onClick={() => updateMutation.mutate({ name: form.name, bio: form.bio, avatar_url: form.avatar_url })}
                                                    disabled={updateMutation.isPending} className="gap-1.5">
                                                    {updateMutation.isPending ? <><Icon icon="mdi:loading" className="animate-spin" /> Saving...</> : <><Icon icon="mdi:check" /> Save Changes</>}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="rounded-md bg-journal-warm/15 border border-journal-rule/20 px-5 py-4">
                                                    <p className="journal-eyebrow mb-1">Name</p>
                                                    <p className="font-serif text-lg font-medium text-journal-ink">{me.name}</p>
                                                </div>
                                                <div className="rounded-md bg-journal-warm/15 border border-journal-rule/20 px-5 py-4">
                                                    <p className="journal-eyebrow mb-1">Email</p>
                                                    <p className="font-serif text-lg font-medium text-journal-ink">{me.email}</p>
                                                </div>
                                            </div>

                                            {/* Biography — editorial drop-cap on the left margin */}
                                            <div className="journal-margin-line">
                                                <p className="journal-eyebrow mb-2">Biography</p>
                                                {me.bio ? (
                                                    <p className="journal-drop-cap font-serif text-sm text-journal-ink-light leading-relaxed whitespace-pre-line">
                                                        {me.bio}
                                                    </p>
                                                ) : (
                                                    <p className="font-serif text-sm italic text-journal-sepia/70 leading-relaxed">
                                                        No biography details provided yet. Click edit to compose your author&apos;s note.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Ledger Stats Band ──────────────────────────────────── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 rounded-[var(--radius-lg)] border border-journal-rule bg-card divide-x divide-y lg:divide-y-0 divide-journal-rule/50 overflow-hidden">
                        {[
                            { icon: 'mdi:book-open-page-variant-outline', label: 'Published Works', value: myProjects?.length ?? 0 },
                            { icon: 'mdi:shield-account-outline', label: 'Access Role', value: me.role },
                            { icon: 'mdi:check-decagram-outline', label: 'Status', value: 'Active' },
                        ].map((s) => (
                            <div key={s.label} className="px-6 py-6 flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-journal-burgundy">
                                    <Icon icon={s.icon} className="text-lg" />
                                    <span className="journal-eyebrow text-[0.6rem]">{s.label}</span>
                                </div>
                                <span className="font-display text-2xl font-bold text-journal-ink leading-none truncate">
                                    {s.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* ── Security Panel ─────────────────────────────────────── */}
                    <Card withVignette className="border-journal-rule overflow-hidden">
                        <CardHeader className="border-b border-journal-rule/40 bg-journal-warm/5">
                            <div className="flex items-center gap-2.5">
                                <Icon icon="mdi:lock-outline" className="text-journal-burgundy text-2xl" />
                                <Heading level="h2" className="font-display text-xl text-journal-ink">Security &amp; Credentials</Heading>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleChangePassword} className="max-w-2xl space-y-5">
                                <div className="grid gap-5 sm:grid-cols-3">
                                    {[
                                        { id: 'old', label: 'Current Password', key: 'oldPassword' },
                                        { id: 'new', label: 'New Password', key: 'newPassword' },
                                        { id: 'confirm', label: 'Confirm Password', key: 'confirmPassword' },
                                    ].map(({ id, label, key }) => (
                                        <div key={id} className="space-y-2">
                                            <Label htmlFor={id} className="font-medium text-journal-ink">{label}</Label>
                                            <Input id={id} type="password" required value={(pwForm as any)[key]} className="bg-background focus:ring-1"
                                                onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))} />
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-3 border-t border-journal-rule/30 flex justify-end">
                                    <Button type="submit" disabled={pwLoading} size="sm" className="gap-1.5">
                                        {pwLoading ? <><Icon icon="mdi:loading" className="animate-spin" /> Updating...</> : 'Update Password'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <OrnamentalDivider variant="ornamental" glyph="❉" className="my-2 opacity-70" />

                    {/* ── Published Works ────────────────────────────────────── */}
                    <Card withVignette className="border-journal-rule overflow-hidden">
                        <CardHeader className="border-b border-journal-rule/40 bg-journal-warm/5">
                            <div className="flex items-center gap-2.5">
                                <Icon icon="mdi:folder-multiple-outline" className="text-journal-burgundy text-2xl" />
                                <Heading level="h2" className="font-display text-xl text-journal-ink">My Published Works ({myProjects?.length ?? 0})</Heading>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {projectsLoading ? (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-60 rounded-md bg-journal-warm/10 skeleton-shimmer border border-journal-rule/20" />)}
                                </div>
                            ) : !myProjects?.length ? (
                                <div className="flex flex-col items-center py-14 text-center gap-4 bg-journal-warm/5 rounded-md border border-dashed border-journal-rule">
                                    <Icon icon="mdi:folder-outline" className="text-5xl text-journal-sepia/70" />
                                    <div className="space-y-1">
                                        <Text className="font-medium text-journal-ink text-base">Your portfolio is empty</Text>
                                        <Text variant="muted" className="text-xs italic">You have not index-cataloged any journal entries or records yet.</Text>
                                    </div>
                                    <a href="/projects/create">
                                        <Button size="sm" className="gap-1.5 mt-2">
                                            <Icon icon="mdi:plus" /> Create Project Record
                                        </Button>
                                    </a>
                                </div>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {myProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
