import { Icon } from '@iconify/react';
import { Head } from '@inertiajs/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
    Badge, Button, Input,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui';
import { useMe, useAdminUsers, useAdminProjects, useDepartments, useAllCourses } from '@/hooks/useCatalog';
import api from '@/lib/api';
import type { User, Project } from '@/types/catalog';

type AdminTab = 'users' | 'projects' | 'departments' | 'courses';

const sectionClass = 'rounded-xl border border-stone-200 bg-white p-5 sm:p-6 space-y-5';
const rowClass = 'flex items-center justify-between gap-3 rounded-lg border border-stone-200 px-4 py-3 hover:bg-stone-50';

const PaginationControls = ({
    page, setPage, pageSize, setPageSize, totalItems, pageSizeOptions = [5, 10, 20, 50],
}: {
    page: number;
    setPage: (p: number) => void;
    pageSize: number;
    setPageSize: (s: number) => void;
    totalItems: number;
    pageSizeOptions?: number[];
}) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, totalItems);

    return (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t border-stone-100 pt-4 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-stone-500">
                <span>Showing <span className="font-medium text-stone-900">{totalItems > 0 ? start : 0}</span>–<span className="font-medium text-stone-900">{end}</span> of <span className="font-medium text-stone-900">{totalItems}</span></span>
                <Select value={String(pageSize)} onValueChange={(v) => {
 setPageSize(Number(v)); setPage(0); 
}}>
                    <SelectTrigger className="h-7 w-[76px] text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {pageSizeOptions.map((opt) => (
                            <SelectItem key={opt} value={String(opt)}>{opt}/page</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-1.5">
                <Button size="sm" variant="outline" className="h-8 w-8 p-0" disabled={page <= 0} onClick={() => setPage(0)}>
                    <Icon icon="mdi:chevron-double-left" className="text-sm" />
                </Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0" disabled={page <= 0} onClick={() => setPage(page - 1)}>
                    <Icon icon="mdi:chevron-left" className="text-sm" />
                </Button>
                <span className="min-w-[80px] text-center text-sm font-medium text-stone-900">
                    Page {page + 1} of {totalPages}
                </span>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                    <Icon icon="mdi:chevron-right" className="text-sm" />
                </Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0" disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>
                    <Icon icon="mdi:chevron-double-right" className="text-sm" />
                </Button>
            </div>
        </div>
    );
};

export default function AdminDashboard() {
    const qc = useQueryClient();
    const { data: me } = useMe();
    const { data: usersData, isLoading: usersLoading } = useAdminUsers();
    const { data: projectsData, isLoading: projectsLoading } = useAdminProjects();
    const { data: departments } = useDepartments();
    const { data: allCourses } = useAllCourses();

    const [activeTab, setActiveTab] = useState<AdminTab>('users');
    const [userSearch, setUserSearch] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('all');
    const [projectSearch, setProjectSearch] = useState('');
    const [projectStatusFilter, setProjectStatusFilter] = useState('all');

    const [userPage, setUserPage] = useState(0);
    const [userPageSize, setUserPageSize] = useState(10);
    const [projectPage, setProjectPage] = useState(0);
    const [projectPageSize, setProjectPageSize] = useState(10);

    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [deleteProject, setDeleteProject] = useState<Project | null>(null);
    const [confirmDeleteDept, setConfirmDeleteDept] = useState<{ id: number; name: string } | null>(null);
    const [confirmDeleteCourse, setConfirmDeleteCourse] = useState<{ id: number; name: string } | null>(null);
    const [roleUser, setRoleUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState('');

    const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
    const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
    const [isDeleteDeptOpen, setIsDeleteDeptOpen] = useState(false);
    const [isDeleteCourseOpen, setIsDeleteCourseOpen] = useState(false);
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

    const [newDeptName, setNewDeptName] = useState('');
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseCode, setNewCourseCode] = useState('');
    const [newCourseDeptId, setNewCourseDeptId] = useState('');

    const users: User[] = usersData?.content ?? [];
    const projects: Project[] = projectsData?.content ?? [];

    const normalizeRole = (role: string | undefined): string => {
        if (!role) {
return 'USER';
}

        const r = role.toUpperCase();

        if (r === 'ADMIN' || r === 'SUPERVISOR' || r === 'USER') {
return r;
}

        return 'USER';
    };

    const allFilteredUsers = useMemo(() => {
        return users.filter((u) => {
            const search = userSearch.toLowerCase();
            const matchSearch = !search || u.name?.toLowerCase().includes(search) || u.email?.toLowerCase().includes(search);
            const normalizedRole = normalizeRole(u.role);
            const matchRole = userRoleFilter === 'all' || normalizedRole === userRoleFilter;

            return matchSearch && matchRole && (u.is_active !== false);
        });
    }, [users, userSearch, userRoleFilter]);

    const allFilteredProjects = useMemo(() => {
        return projects.filter((p) => {
            const search = projectSearch.toLowerCase();
            const matchSearch = !search || p.title?.toLowerCase().includes(search) || p.description?.toLowerCase().includes(search);
            const matchStatus = projectStatusFilter === 'all' || p.approvalStatus === projectStatusFilter;

            return matchSearch && matchStatus;
        });
    }, [projects, projectSearch, projectStatusFilter]);

    const filteredUsers = useMemo(() => {
        const start = userPage * userPageSize;

        return allFilteredUsers.slice(start, start + userPageSize);
    }, [allFilteredUsers, userPage, userPageSize]);

    const filteredProjects = useMemo(() => {
        const start = projectPage * projectPageSize;

        return allFilteredProjects.slice(start, start + projectPageSize);
    }, [allFilteredProjects, projectPage, projectPageSize]);

    const stats = useMemo(() => ({
        total: users.filter((u) => u.is_active !== false).length,
        admins: users.filter((u) => normalizeRole(u.role) === 'ADMIN').length,
        supervisors: users.filter((u) => normalizeRole(u.role) === 'SUPERVISOR').length,
        regular: users.filter((u) => normalizeRole(u.role) === 'USER').length,
        totalProjects: projects.length,
        approved: projects.filter((p) => p.approvalStatus === 'APPROVED').length,
        pending: projects.filter((p) => p.approvalStatus === 'PENDING').length,
        depts: departments?.length ?? 0,
        courses: allCourses?.length ?? 0,
    }), [users, projects, departments, allCourses]);

    const deactivateMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/users/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['adminUsers'] });
            setIsDeleteUserOpen(false);
            setDeleteUser(null);
            toast.success('User deactivated');
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to deactivate user');
        },
    });

    const deleteProjectMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/projects/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['adminProjects'] });
            setIsDeleteProjectOpen(false);
            setDeleteProject(null);
            toast.success('Project deleted');
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to delete project');
        },
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ id, role }: { id: number; role: string }) => api.put(`/admin/users/${id}/role`, { role: role.toLowerCase() }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['adminUsers'] });
            setIsRoleDialogOpen(false);
            setRoleUser(null);
            setSelectedRole('');
            toast.success('Role updated');
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to update role');
        },
    });

    const addDeptMutation = useMutation({
        mutationFn: () => api.post('/departments', { name: newDeptName }),
        onSuccess: () => {
 qc.invalidateQueries({ queryKey: ['departments'] }); setNewDeptName(''); toast.success('Department added'); 
},
    });

    const deleteDeptMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/departments/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['departments'] });
            setIsDeleteDeptOpen(false);
            setConfirmDeleteDept(null);
            toast.success('Department deleted');
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to delete department');
        },
    });

    const addCourseMutation = useMutation({
        mutationFn: () => api.post('/courses', { name: newCourseName, code: newCourseCode, department_id: newCourseDeptId }),
        onSuccess: () => {
 qc.invalidateQueries({ queryKey: ['courses'] }); setNewCourseName(''); setNewCourseCode(''); toast.success('Course added'); 
},
    });

    const deleteCourseMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/courses/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['courses'] });
            setIsDeleteCourseOpen(false);
            setConfirmDeleteCourse(null);
            toast.success('Course deleted');
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Failed to delete course');
        },
    });

    const roleBadge = (role: string | undefined) => {
        const normalized = normalizeRole(role);

        if (normalized === 'ADMIN') {
return <Badge>{normalized}</Badge>;
}

        if (normalized === 'SUPERVISOR') {
return <Badge variant="secondary">{normalized}</Badge>;
}

        return <Badge variant="outline">{normalized}</Badge>;
    };

    const statusBadge = (s: string | undefined) => {
        const status = s || 'PENDING';
        const v = status === 'APPROVED' ? 'default' : status === 'REJECTED' ? 'destructive' : 'secondary';

        return <Badge variant={v as any}>{status}</Badge>;
    };

    const openDeleteUser = (u: User) => {
 setDeleteUser(u); setIsDeleteUserOpen(true); 
};
    const closeDeleteUser = () => {
 setIsDeleteUserOpen(false); setDeleteUser(null); 
};
    const openDeleteProject = (p: Project) => {
 setDeleteProject(p); setIsDeleteProjectOpen(true); 
};
    const closeDeleteProject = () => {
 setIsDeleteProjectOpen(false); setDeleteProject(null); 
};
    const openDeleteDept = (id: number, name: string) => {
 setConfirmDeleteDept({ id, name }); setIsDeleteDeptOpen(true); 
};
    const closeDeleteDept = () => {
 setIsDeleteDeptOpen(false); setConfirmDeleteDept(null); 
};
    const openDeleteCourse = (id: number, name: string) => {
 setConfirmDeleteCourse({ id, name }); setIsDeleteCourseOpen(true); 
};
    const closeDeleteCourse = () => {
 setIsDeleteCourseOpen(false); setConfirmDeleteCourse(null); 
};
    const openRoleDialog = (u: User) => {
        setRoleUser(u);
        setSelectedRole(normalizeRole(u.role).toLowerCase());
        setIsRoleDialogOpen(true);
    };
    const closeRoleDialog = () => {
 setIsRoleDialogOpen(false); setRoleUser(null); setSelectedRole(''); 
};


    if (me?.role !== 'ADMIN') {
        return (
            <div className="flex h-[60vh] items-center justify-center px-4">
                <div className="w-full max-w-md space-y-3 rounded-xl border border-stone-200 bg-white p-8 text-center">
                    <Icon icon="mdi:shield-lock-outline" className="mx-auto text-4xl text-stone-400" />
                    <h2 className="text-base font-medium text-stone-900">Access denied</h2>
                    <p className="text-sm text-stone-500">Admin access required.</p>
                </div>
            </div>
        );
    }

    const tabs: { value: AdminTab; label: string }[] = [
        { value: 'users', label: 'Users' },
        { value: 'projects', label: 'Projects' },
        { value: 'departments', label: 'Departments' },
        { value: 'courses', label: 'Courses' },
    ];

    return (
        <>
            <Head title="Admin dashboard" />

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <header className="space-y-1">
                        <h1 className="text-xl font-semibold text-stone-900">Admin dashboard</h1>
                        <p className="max-w-lg text-sm text-stone-500">
                            Manage users, projects, departments, and courses from a single place.
                        </p>
                    </header>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {[
                            { label: 'Total users', value: stats.total },
                            { label: 'Supervisors', value: stats.supervisors },
                            { label: 'Projects', value: stats.totalProjects },
                            { label: 'Approved', value: stats.approved },
                            { label: 'Pending', value: stats.pending },
                        ].map((s) => (
                            <div key={s.label} className="rounded-xl border border-stone-200 bg-white px-4 py-4">
                                <p className="text-2xl font-semibold text-stone-900">{s.value}</p>
                                <p className="mt-1 text-xs text-stone-500">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-1 rounded-xl border border-stone-200 bg-white p-1 sm:w-fit">
                        {tabs.map((t) => (
                            <button
                                key={t.value}
                                type="button"
                                onClick={() => setActiveTab(t.value)}
                                className={`rounded-lg px-3 py-1.5 text-sm ${activeTab === t.value ? 'bg-stone-100 font-medium text-stone-900' : 'text-stone-500 hover:text-stone-900'}`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'users' && (
                        <section className={sectionClass}>
                            <div className="space-y-1">
                                <h2 className="text-sm font-medium text-stone-900">Users</h2>
                                <p className="text-[13px] text-stone-500">Showing {filteredUsers.length} of {stats.total} active users</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Input placeholder="Search by name or email..." value={userSearch} onChange={(e) => {
 setUserSearch(e.target.value); setUserPage(0); 
}} />
                                <Select value={userRoleFilter} onValueChange={(v) => {
 setUserRoleFilter(v); setUserPage(0); 
}}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All roles</SelectItem>
                                        <SelectItem value="USER">User</SelectItem>
                                        <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                {usersLoading ? (
                                    <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-stone-50" />)}</div>
                                ) : filteredUsers.length === 0 ? (
                                    <p className="py-12 text-center text-sm text-stone-500">No users match your filters.</p>
                                ) : (
                                    <div className="space-y-1.5">
                                        {filteredUsers.map((u: User) => (
                                            <div key={u.id} className={rowClass}>
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-medium text-stone-700">
                                                        {(u.name?.[0] || '?').toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-stone-900">{u.name || 'Unknown'}</p>
                                                        <p className="truncate text-xs text-stone-500">{u.email || 'No email'}</p>
                                                    </div>
                                                    <div className="ml-2 hidden sm:block">{roleBadge(u.role)}</div>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-1.5">
                                                    <Button size="sm" variant="outline" onClick={() => openRoleDialog(u)}>
                                                        Role
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-600" onClick={() => openDeleteUser(u)}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <PaginationControls page={userPage} setPage={setUserPage} pageSize={userPageSize} setPageSize={setUserPageSize} totalItems={allFilteredUsers.length} />
                            </div>
                        </section>
                    )}

                    {activeTab === 'projects' && (
                        <section className={sectionClass}>
                            <div className="space-y-1">
                                <h2 className="text-sm font-medium text-stone-900">Projects</h2>
                                <p className="text-[13px] text-stone-500">Showing {filteredProjects.length} of {stats.totalProjects} projects</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Input placeholder="Search projects..." value={projectSearch} onChange={(e) => {
 setProjectSearch(e.target.value); setProjectPage(0); 
}} />
                                <Select value={projectStatusFilter} onValueChange={(v) => {
 setProjectStatusFilter(v); setProjectPage(0); 
}}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All status</SelectItem>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="APPROVED">Approved</SelectItem>
                                        <SelectItem value="REJECTED">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                {projectsLoading ? (
                                    <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-stone-50" />)}</div>
                                ) : filteredProjects.length === 0 ? (
                                    <p className="py-12 text-center text-sm text-stone-500">No projects match your filters.</p>
                                ) : (
                                    <div className="space-y-1.5">
                                        {filteredProjects.map((p: Project) => (
                                            <div key={p.id} className={rowClass}>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-stone-900">{p.title || 'Untitled'}</p>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        {statusBadge(p.approvalStatus)}
                                                        {p.submittedByName && <span className="text-xs text-stone-500">by {p.submittedByName}</span>}
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="destructive" className="shrink-0" onClick={() => openDeleteProject(p)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <PaginationControls page={projectPage} setPage={setProjectPage} pageSize={projectPageSize} setPageSize={setProjectPageSize} totalItems={allFilteredProjects.length} />
                            </div>
                        </section>
                    )}

                    {activeTab === 'departments' && (
                        <section className={sectionClass}>
                            <div className="space-y-1">
                                <h2 className="text-sm font-medium text-stone-900">Departments</h2>
                                <p className="text-[13px] text-stone-500">{departments?.length ?? 0} departments registered</p>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="New department name..."
                                    value={newDeptName}
                                    onChange={(e) => setNewDeptName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && newDeptName.trim() && addDeptMutation.mutate()}
                                />
                                <Button
                                    size="sm"
                                    onClick={() => newDeptName.trim() && addDeptMutation.mutate()}
                                    disabled={!newDeptName.trim() || addDeptMutation.isPending}
                                    className="shrink-0"
                                >
                                    Add
                                </Button>
                            </div>
                            {departments?.length === 0 ? (
                                <p className="py-10 text-center text-sm text-stone-500">No departments yet.</p>
                            ) : (
                                <div className="space-y-1.5">
                                    {departments?.map((d) => (
                                        <div key={d.id} className={rowClass}>
                                            <span className="truncate text-sm font-medium text-stone-900">{d.name}</span>
                                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-600" onClick={() => openDeleteDept(d.id, d.name)}>
                                                Delete
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {activeTab === 'courses' && (
                        <section className={sectionClass}>
                            <div className="space-y-1">
                                <h2 className="text-sm font-medium text-stone-900">Courses</h2>
                                <p className="text-[13px] text-stone-500">{allCourses?.length ?? 0} courses across {departments?.length ?? 0} departments</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                <Input placeholder="Course name" value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} />
                                <Input placeholder="Code (e.g. CST-11)" value={newCourseCode} onChange={(e) => setNewCourseCode(e.target.value)} />
                                <Select value={newCourseDeptId} onValueChange={setNewCourseDeptId}>
                                    <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
                                    <SelectContent>{departments?.map((d) => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}</SelectContent>
                                </Select>
                                <Button
                                    size="sm"
                                    onClick={() => newCourseName.trim() && newCourseDeptId && addCourseMutation.mutate()}
                                    disabled={!newCourseName.trim() || !newCourseDeptId || addCourseMutation.isPending}
                                    className="shrink-0"
                                >
                                    Add
                                </Button>
                            </div>
                            {allCourses?.length === 0 ? (
                                <p className="py-10 text-center text-sm text-stone-500">No courses yet.</p>
                            ) : (
                                <div className="max-h-[28rem] space-y-1.5 overflow-y-auto pr-1">
                                    {allCourses?.map((c) => (
                                        <div key={c.id} className={rowClass}>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-stone-900">{c.name}</p>
                                                <div className="mt-0.5 flex items-center gap-2">
                                                    {c.code && <span className="font-mono text-xs text-stone-500">{c.code}</span>}
                                                    <span className="text-xs text-stone-400">{(c as any).department?.name}</span>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-600" onClick={() => openDeleteCourse(c.id, c.name)}>
                                                Delete
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </div>

            <Dialog open={isDeleteUserOpen} onOpenChange={(open) => {
 if (!open) {
closeDeleteUser();
} 
}}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Deactivate user</DialogTitle>
                        <DialogDescription>
                            Deactivate "{deleteUser?.name}"? This will hide them from the system.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 pt-2">
                        <Button variant="outline" onClick={closeDeleteUser}>Cancel</Button>
                        <Button disabled={deactivateMutation.isPending} onClick={() => deleteUser && deactivateMutation.mutate(deleteUser.id)}>
                            {deactivateMutation.isPending ? 'Deactivating...' : 'Deactivate'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteProjectOpen} onOpenChange={(open) => {
 if (!open) {
closeDeleteProject();
} 
}}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete project</DialogTitle>
                        <DialogDescription>
                            Permanently delete "{deleteProject?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 pt-2">
                        <Button variant="outline" onClick={closeDeleteProject}>Cancel</Button>
                        <Button disabled={deleteProjectMutation.isPending} onClick={() => deleteProject && deleteProjectMutation.mutate(deleteProject.id)}>
                            {deleteProjectMutation.isPending ? 'Deleting...' : 'Delete permanently'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDeptOpen} onOpenChange={(open) => {
 if (!open) {
closeDeleteDept();
} 
}}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete department</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-medium text-stone-900">"{confirmDeleteDept?.name}"</span>? Any courses assigned to this department might lose their relationship.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 pt-2">
                        <Button variant="outline" onClick={closeDeleteDept} disabled={deleteDeptMutation.isPending}>Cancel</Button>
                        <Button disabled={deleteDeptMutation.isPending} onClick={() => confirmDeleteDept && deleteDeptMutation.mutate(confirmDeleteDept.id)}>
                            {deleteDeptMutation.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteCourseOpen} onOpenChange={(open) => {
 if (!open) {
closeDeleteCourse();
} 
}}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete course</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to permanently delete <span className="font-medium text-stone-900">"{confirmDeleteCourse?.name}"</span>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 pt-2">
                        <Button variant="outline" onClick={closeDeleteCourse} disabled={deleteCourseMutation.isPending}>Cancel</Button>
                        <Button disabled={deleteCourseMutation.isPending} onClick={() => confirmDeleteCourse && deleteCourseMutation.mutate(confirmDeleteCourse.id)}>
                            {deleteCourseMutation.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isRoleDialogOpen} onOpenChange={(open) => {
 if (!open) {
closeRoleDialog();
} 
}}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update role</DialogTitle>
                        <DialogDescription>
                            Change the role for {roleUser?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger><SelectValue placeholder="Select a new role" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="supervisor">Supervisor</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter className="gap-2 pt-2">
                        <Button variant="outline" onClick={closeRoleDialog}>Cancel</Button>
                        <Button disabled={!selectedRole || updateRoleMutation.isPending} onClick={() => roleUser && selectedRole && updateRoleMutation.mutate({ id: roleUser.id, role: selectedRole })}>
                            {updateRoleMutation.isPending ? 'Updating...' : 'Update role'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
