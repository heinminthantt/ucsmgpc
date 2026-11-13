import { Icon } from '@iconify/react';
import { Head } from '@inertiajs/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { ProjectCard } from '@/components/project-card';
import {
    Button, Avatar, AvatarFallback, Input, Label, Badge,
} from '@/components/ui';
import { useMe, useUserProjects } from '@/hooks/useCatalog';
import api from '@/lib/api';

const sectionClass = 'rounded-xl border border-border bg-card p-5 sm:p-6 space-y-5';

export default function ProfilePage() {
    const qc = useQueryClient();
    const { data: me } = useMe();
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

        if (pwForm.newPassword !== pwForm.confirmPassword) {
 toast.error('Passwords do not match');

 return; 
}

        setPwLoading(true);

        try {
            await api.post(`/users/${me?.id}/change-password`, { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword });
            toast.success('Password changed!');
            setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Change password failed');
        } finally {
 setPwLoading(false); 
}
    };

    if (!me) {
return (
        <div className="flex h-64 items-center justify-center">
            <Icon icon="mdi:loading" className="animate-spin text-3xl text-muted-foreground/70" />
        </div>
    );
}

    return (
        <>
            <Head title="Profile" />

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="space-y-8">
                    <header>
                        <h1 className="text-3xl font-semibold text-foreground">{me.name}</h1>
                        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                            Your account details, password, and the projects you have added to the catalog.
                        </p>
                    </header>

                    <section className={sectionClass}>
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-sm font-medium text-foreground">Profile details</h2>
                            {!editing && (
                                <Button variant="outline" size="sm" onClick={startEdit}>
                                    Edit profile
                                </Button>
                            )}
                        </div>

                        <div className="flex flex-col items-start gap-6 md:flex-row">
                            <div className="flex w-full shrink-0 flex-col items-center gap-3 rounded-lg border border-border bg-muted/40 p-5 text-center md:w-52">
                                <Avatar size="lg" className="size-20">
                                    <AvatarFallback className="bg-muted text-2xl font-medium text-foreground/85">
                                        {me.name[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <Badge variant="secondary" className="text-xs">
                                    {me.role}
                                </Badge>
                            </div>

                            <div className="w-full flex-1">
                                {editing ? (
                                    <div className="space-y-5">
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <Label>Full name</Label>
                                                <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label>Email address</Label>
                                                <Input value={me.email} disabled className="opacity-60" />
                                                <p className="text-[13px] text-muted-foreground">Your email address cannot be changed.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label>Bio</Label>
                                            <textarea rows={4} className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-border"
                                                placeholder="Share a short summary about your background and work..."
                                                value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} />
                                        </div>
                                        <div className="flex gap-2 border-t border-border/70 pt-4">
                                            <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                                            <Button onClick={() => updateMutation.mutate({ name: form.name, bio: form.bio, avatar_url: form.avatar_url })}
                                                disabled={updateMutation.isPending}>
                                                {updateMutation.isPending ? 'Saving...' : 'Save changes'}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="rounded-lg border border-border px-4 py-3">
                                                <p className="text-xs text-muted-foreground/70">Name</p>
                                                <p className="mt-1 text-sm font-medium text-foreground">{me.name}</p>
                                            </div>
                                            <div className="rounded-lg border border-border px-4 py-3">
                                                <p className="text-xs text-muted-foreground/70">Email</p>
                                                <p className="mt-1 text-sm font-medium text-foreground">{me.email}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="mb-1.5 text-xs text-muted-foreground/70">Bio</p>
                                            {me.bio ? (
                                                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                                                    {me.bio}
                                                </p>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">
                                                    No bio yet. Use Edit profile to add one.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Projects', value: myProjects?.length ?? 0 },
                            { label: 'Role', value: me.role },
                            { label: 'Status', value: 'Active' },
                        ].map((s) => (
                            <div key={s.label} className="rounded-xl border border-border bg-card px-4 py-4">
                                <p className="text-xs text-muted-foreground/70">{s.label}</p>
                                <p className="mt-1 truncate text-lg font-semibold text-foreground">{s.value}</p>
                            </div>
                        ))}
                    </div>

                    <section className={sectionClass}>
                        <div className="space-y-1">
                            <h2 className="text-sm font-medium text-foreground">Password</h2>
                            <p className="text-[13px] text-muted-foreground">Change your account password.</p>
                        </div>
                        <form onSubmit={handleChangePassword} className="max-w-2xl space-y-5">
                            <div className="grid gap-4 sm:grid-cols-3">
                                {[
                                    { id: 'old', label: 'Current password', key: 'oldPassword' },
                                    { id: 'new', label: 'New password', key: 'newPassword' },
                                    { id: 'confirm', label: 'Confirm password', key: 'confirmPassword' },
                                ].map(({ id, label, key }) => (
                                    <div key={id} className="space-y-1.5">
                                        <Label htmlFor={id}>{label}</Label>
                                        <Input id={id} type="password" required value={(pwForm as any)[key]}
                                            onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))} />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end border-t border-border/70 pt-4">
                                <Button type="submit" disabled={pwLoading} size="sm">
                                    {pwLoading ? 'Updating...' : 'Update password'}
                                </Button>
                            </div>
                        </form>
                    </section>

                    <section className={sectionClass}>
                        <h2 className="text-sm font-medium text-foreground">My projects ({myProjects?.length ?? 0})</h2>
                        {projectsLoading ? (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-60 animate-pulse rounded-xl border border-border bg-muted/40" />)}
                            </div>
                        ) : !myProjects?.length ? (
                            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-12 text-center">
                                <Icon icon="mdi:folder-outline" className="text-4xl text-muted-foreground/45" />
                                <p className="text-sm font-medium text-foreground">No projects yet</p>
                                <p className="text-[13px] text-muted-foreground">You have not added any projects to the catalog yet.</p>
                                <a href="/projects/create">
                                    <Button size="sm">Create project</Button>
                                </a>
                            </div>
                        ) : (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {myProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}
