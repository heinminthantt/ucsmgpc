import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    Badge, Button, Card, CardContent, CardHeader, CardDescription,
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
    Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
    Tabs, TabsContent, TabsList, TabsTrigger,
    Separator,
    Heading, Text,
    OrnamentalDivider,
} from 'journal-ds';
import { useMe, useAdminUsers, useAdminProjects, useDepartments, useAllCourses } from '@/hooks/useCatalog';
import api from '@/lib/api';
import type { User, Project } from '@/types/catalog';

export default function AdminDashboard() {
    const qc = useQueryClient();
    const { data: me } = useMe();
    const { data: usersData, isLoading: usersLoading } = useAdminUsers();
    const { data: projectsData, isLoading: projectsLoading } = useAdminProjects();
    const { data: departments } = useDepartments();
    const { data: allCourses } = useAllCourses();

    const [userSearch, setUserSearch] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('all');
    const [projectSearch, setProjectSearch] = useState('');
    const [projectStatusFilter, setProjectStatusFilter] = useState('all');

    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [deleteProject, setDeleteProject] = useState<Project | null>(null);
    const [roleUser, setRoleUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState('');

    // Dept/Course management state
    const [newDeptName, setNewDeptName] = useState('');
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseCode, setNewCourseCode] = useState('');
    const [newCourseDeptId, setNewCourseDeptId] = useState('');

    const users: User[] = usersData?.content ?? [];
    const projects: Project[] = projectsData?.content ?? [];

    const filteredUsers = useMemo(() => users.filter((u) => {
        const search = userSearch.toLowerCase();
        const matchSearch = !search || u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search);
        const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
        return matchSearch && matchRole && (u.is_active !== false);
    }), [users, userSearch, userRoleFilter]);

    const filteredProjects = useMemo(() => projects.filter((p) => {
        const search = projectSearch.toLowerCase();
        const matchSearch = !search || p.title.toLowerCase().includes(search) || p.description?.toLowerCase().includes(search);
        const matchStatus = projectStatusFilter === 'all' || p.approvalStatus === projectStatusFilter;
        return matchSearch && matchStatus;
    }), [projects, projectSearch, projectStatusFilter]);

    const stats = useMemo(() => ({
        total: users.filter((u) => u.is_active).length,
        admins: users.filter((u) => u.role === 'ADMIN').length,
        supervisors: users.filter((u) => u.role === 'SUPERVISOR').length,
        regular: users.filter((u) => u.role === 'USER').length,
        totalProjects: projects.length,
        approved: projects.filter((p) => p.approvalStatus === 'APPROVED').length,
        pending: projects.filter((p) => p.approvalStatus === 'PENDING').length,
        depts: departments?.length ?? 0,
        courses: allCourses?.length ?? 0,
    }), [users, projects, departments, allCourses]);

    const deactivateMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/users/${id}`),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['adminUsers'] }); setDeleteUser(null); toast.success('User deactivated'); },
    });

    const deleteProjectMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/projects/${id}`),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['adminProjects'] }); setDeleteProject(null); toast.success('Project deleted'); },
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ id, role }: { id: number; role: string }) => api.put(`/admin/users/${id}/role`, { role }),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['adminUsers'] }); setRoleUser(null); toast.success('Role updated'); },
    });

    const addDeptMutation = useMutation({
        mutationFn: () => api.post('/departments', { name: newDeptName }),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['departments'] }); setNewDeptName(''); toast.success('Department added'); },
    });

    const deleteDeptMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/departments/${id}`),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['departments'] }); toast.success('Department deleted'); },
    });

    const addCourseMutation = useMutation({
        mutationFn: () => api.post('/courses', { name: newCourseName, code: newCourseCode, department_id: newCourseDeptId }),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['courses'] }); setNewCourseName(''); setNewCourseCode(''); toast.success('Course added'); },
    });

    const deleteCourseMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/courses/${id}`),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['courses'] }); toast.success('Course deleted'); },
    });

    const roleBadge = (role: string) => {
        const v = role === 'ADMIN' ? 'destructive' : role === 'SUPERVISOR' ? 'warning' : 'secondary';
        return <Badge variant={v as any} className="text-xs">{role}</Badge>;
    };

    const statusBadge = (s: string) => {
        const v = s === 'APPROVED' ? 'success' : s === 'REJECTED' ? 'destructive' : 'warning';
        return <Badge variant={v as any} className="text-xs">{s}</Badge>;
    };

    if (me?.role !== 'ADMIN') {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Card className="max-w-md text-center p-10 space-y-4">
                    <Icon icon="mdi:shield-lock-outline" className="text-5xl text-destructive mx-auto" />
                    <Heading level="h2" className="text-xl text-destructive">Access Denied</Heading>
                    <Text variant="muted">Admin access required.</Text>
                </Card>
            </div>
        );
    }

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="mx-auto max-w-5xl px-6 lg:px-8 py-12">
                <div className="space-y-8">
                    <div>
                        <Heading level="h1" className="text-4xl text-journal-ink">Admin Dashboard</Heading>
                        <Text variant="muted" className="mt-1">Manage users, projects, departments, and courses.</Text>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {[
                            { label: 'Users', value: stats.total, color: 'text-journal-burgundy', bg: 'bg-journal-burgundy/10' },
                            { label: 'Supervisors', value: stats.supervisors, color: 'text-journal-ink-light', bg: 'bg-journal-warm/30' },
                            { label: 'Projects', value: stats.totalProjects, color: 'text-journal-gold', bg: 'bg-journal-gold/10' },
                            { label: 'Approved', value: stats.approved, color: 'text-journal-forest', bg: 'bg-journal-forest/10' },
                            { label: 'Pending', value: stats.pending, color: 'text-journal-gold', bg: 'bg-journal-gold/10' },
                        ].map((s) => (
                            <Card key={s.label} className="p-4 text-center">
                                <div className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</div>
                                <div className="journal-eyebrow mt-1">{s.label}</div>
                            </Card>
                        ))}
                    </div>

                    <OrnamentalDivider variant="ornamental" />

                    <Tabs defaultValue="users">
                        <TabsList className="grid w-full grid-cols-4 max-w-lg mx-auto">
                            <TabsTrigger value="users" className="gap-1.5 text-xs sm:text-sm">
                                <Icon icon="mdi:account-group" className="text-sm" />Users
                            </TabsTrigger>
                            <TabsTrigger value="projects" className="gap-1.5 text-xs sm:text-sm">
                                <Icon icon="mdi:folder-multiple" className="text-sm" />Projects
                            </TabsTrigger>
                            <TabsTrigger value="departments" className="gap-1.5 text-xs sm:text-sm">
                                <Icon icon="mdi:school-outline" className="text-sm" />Depts
                            </TabsTrigger>
                            <TabsTrigger value="courses" className="gap-1.5 text-xs sm:text-sm">
                                <Icon icon="mdi:book-open-variant" className="text-sm" />Courses
                            </TabsTrigger>
                        </TabsList>

                        {/* ── Users ── */}
                        <TabsContent value="users" className="mt-6">
                            <Card withVignette>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <Icon icon="mdi:account-group" className="text-journal-burgundy text-xl" />
                                        <div>
                                            <Heading level="h2" className="text-lg text-journal-ink">User Management</Heading>
                                            <CardDescription>Showing {filteredUsers.length} of {stats.total} users</CardDescription>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <Input placeholder="Search by name or email…" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                                        <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All roles</SelectItem>
                                                <SelectItem value="USER">User</SelectItem>
                                                <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {usersLoading ? (
                                        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 rounded-sm bg-muted skeleton-shimmer" />)}</div>
                                    ) : filteredUsers.length === 0 ? (
                                        <p className="text-center py-10 font-serif text-journal-sepia">No users match your filters.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {filteredUsers.map((u: User) => (
                                                <div key={u.id} className="flex items-center justify-between rounded-sm border border-journal-rule/50 px-4 py-3 hover:bg-journal-warm/10 transition-colors">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-journal-burgundy/10 text-journal-burgundy text-sm font-bold">
                                                            {u.name[0].toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-serif font-medium text-sm truncate text-journal-ink">{u.name}</p>
                                                            <p className="text-xs text-journal-sepia truncate">{u.email}</p>
                                                        </div>
                                                        <div className="hidden sm:block">{roleBadge(u.role)}</div>
                                                    </div>
                                                    <div className="flex gap-2 shrink-0">
                                                        <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => { setRoleUser(u); setSelectedRole(u.role.toLowerCase()); }}>
                                                            <Icon icon="mdi:account-cog" />Role
                                                        </Button>
                                                        <Button size="sm" variant="destructive" className="gap-1 text-xs" onClick={() => setDeleteUser(u)}>
                                                            <Icon icon="mdi:delete-outline" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ── Projects ── */}
                        <TabsContent value="projects" className="mt-6">
                            <Card withVignette>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <Icon icon="mdi:folder-multiple" className="text-journal-burgundy text-xl" />
                                        <div>
                                            <Heading level="h2" className="text-lg text-journal-ink">Project Management</Heading>
                                            <CardDescription>Showing {filteredProjects.length} of {stats.totalProjects} projects</CardDescription>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <Input placeholder="Search projects…" value={projectSearch} onChange={(e) => setProjectSearch(e.target.value)} />
                                        <Select value={projectStatusFilter} onValueChange={setProjectStatusFilter}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All status</SelectItem>
                                                <SelectItem value="PENDING">Pending</SelectItem>
                                                <SelectItem value="APPROVED">Approved</SelectItem>
                                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {projectsLoading ? (
                                        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 rounded-sm bg-muted skeleton-shimmer" />)}</div>
                                    ) : filteredProjects.length === 0 ? (
                                        <p className="text-center py-10 font-serif text-journal-sepia">No projects match your filters.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {filteredProjects.map((p: Project) => (
                                                <div key={p.id} className="flex items-center justify-between rounded-sm border border-journal-rule/50 px-4 py-3 hover:bg-journal-warm/10 transition-colors">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-journal-gold/10">
                                                            <Icon icon="mdi:folder" className="text-journal-gold" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-serif font-medium text-sm truncate text-journal-ink">{p.title}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                {statusBadge(p.approvalStatus)}
                                                                {p.submittedByName && <span className="text-xs text-journal-sepia">by {p.submittedByName}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button size="sm" variant="destructive" className="shrink-0 gap-1 text-xs" onClick={() => setDeleteProject(p)}>
                                                        <Icon icon="mdi:delete-outline" />Delete
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ── Departments ── */}
                        <TabsContent value="departments" className="mt-6">
                            <Card withVignette>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <Icon icon="mdi:school-outline" className="text-journal-burgundy text-xl" />
                                        <Heading level="h2" className="text-lg text-journal-ink">Departments ({departments?.length ?? 0})</Heading>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Add */}
                                    <div className="flex gap-2">
                                        <Input placeholder="Department name" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && newDeptName.trim() && addDeptMutation.mutate()} />
                                        <Button size="sm" onClick={() => newDeptName.trim() && addDeptMutation.mutate()} disabled={!newDeptName.trim() || addDeptMutation.isPending} className="gap-1">
                                            <Icon icon="mdi:plus" />Add
                                        </Button>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        {departments?.map((d) => (
                                            <div key={d.id} className="flex items-center justify-between rounded-sm border border-journal-rule/50 px-4 py-3">
                                                <span className="font-serif text-sm font-medium text-journal-ink">{d.name}</span>
                                                <Button size="sm" variant="destructive" className="gap-1 text-xs h-7" onClick={() => deleteDeptMutation.mutate(d.id)}>
                                                    <Icon icon="mdi:delete-outline" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ── Courses ── */}
                        <TabsContent value="courses" className="mt-6">
                            <Card withVignette>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <Icon icon="mdi:book-open-variant" className="text-journal-burgundy text-xl" />
                                        <Heading level="h2" className="text-lg text-journal-ink">Courses ({allCourses?.length ?? 0})</Heading>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Add */}
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                        <Input placeholder="Course name" value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} className="sm:col-span-1" />
                                        <Input placeholder="Code (e.g. CST-11)" value={newCourseCode} onChange={(e) => setNewCourseCode(e.target.value)} />
                                        <Select value={newCourseDeptId} onValueChange={setNewCourseDeptId}>
                                            <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
                                            <SelectContent>{departments?.map((d) => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <Button size="sm" onClick={() => newCourseName.trim() && newCourseDeptId && addCourseMutation.mutate()}
                                            disabled={!newCourseName.trim() || !newCourseDeptId || addCourseMutation.isPending} className="gap-1">
                                            <Icon icon="mdi:plus" />Add
                                        </Button>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                                        {allCourses?.map((c) => (
                                            <div key={c.id} className="flex items-center justify-between rounded-sm border border-journal-rule/50 px-4 py-3">
                                                <div>
                                                    <span className="font-serif text-sm font-medium text-journal-ink">{c.name}</span>
                                                    {c.code && <span className="ml-2 text-xs text-journal-sepia">({c.code})</span>}
                                                    <span className="ml-2 text-xs text-journal-sepia">— {(c as any).department?.name}</span>
                                                </div>
                                                <Button size="sm" variant="destructive" className="gap-1 text-xs h-7" onClick={() => deleteCourseMutation.mutate(c.id)}>
                                                    <Icon icon="mdi:delete-outline" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Delete user dialog */}
            <Dialog open={!!deleteUser} onOpenChange={(o) => !o && setDeleteUser(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader><DialogTitle className="font-display">Deactivate User</DialogTitle></DialogHeader>
                    <Text variant="muted" className="text-sm">Deactivate <span className="font-medium text-journal-ink">"{deleteUser?.name}"</span>? This hides them from the system.</Text>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancel</Button>
                        <Button variant="destructive" disabled={deactivateMutation.isPending} onClick={() => deleteUser && deactivateMutation.mutate(deleteUser.id)}>
                            {deactivateMutation.isPending ? 'Deactivating...' : 'Deactivate'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete project dialog */}
            <Dialog open={!!deleteProject} onOpenChange={(o) => !o && setDeleteProject(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader><DialogTitle className="text-destructive font-display">Delete Project</DialogTitle></DialogHeader>
                    <Text variant="muted" className="text-sm">Permanently delete <span className="font-medium text-journal-ink">"{deleteProject?.title}"</span>? This cannot be undone.</Text>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteProject(null)}>Cancel</Button>
                        <Button variant="destructive" disabled={deleteProjectMutation.isPending} onClick={() => deleteProject && deleteProjectMutation.mutate(deleteProject.id)}>
                            {deleteProjectMutation.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update role dialog */}
            <Dialog open={!!roleUser} onOpenChange={(o) => !o && setRoleUser(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader><DialogTitle className="font-display">Update Role</DialogTitle></DialogHeader>
                    <Text variant="muted" className="text-sm mb-3">Changing role for <span className="font-medium text-journal-ink">{roleUser?.name}</span>.</Text>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRoleUser(null)}>Cancel</Button>
                        <Button disabled={!selectedRole || updateRoleMutation.isPending} onClick={() => roleUser && updateRoleMutation.mutate({ id: roleUser.id, role: selectedRole })}>
                            {updateRoleMutation.isPending ? 'Updating...' : 'Update Role'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
