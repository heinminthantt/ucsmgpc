import { Head } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    Badge, Button, Card, CardContent, CardHeader, CardDescription,
    Input, 
    Tabs, TabsContent, TabsList, TabsTrigger,
    Separator,
    Heading, Text,
    OrnamentalDivider,
} from 'journal-ds';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui'; // <-- changed: now using the same working source as FilterModal

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

    // ── Pagination State ──
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

    // ── Dialog open states as boolean primitives ──
    const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
    const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
    const [isDeleteDeptOpen, setIsDeleteDeptOpen] = useState(false);
    const [isDeleteCourseOpen, setIsDeleteCourseOpen] = useState(false);
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

    // Dept/Course management state
    const [newDeptName, setNewDeptName] = useState('');
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseCode, setNewCourseCode] = useState('');
    const [newCourseDeptId, setNewCourseDeptId] = useState('');

    const users: User[] = usersData?.content ?? [];
    const projects: Project[] = projectsData?.content ?? [];

    const normalizeRole = (role: string | undefined): string => {
        if (!role) return 'USER';
        const r = role.toUpperCase();
        if (r === 'ADMIN' || r === 'SUPERVISOR' || r === 'USER') return r;
        return 'USER';
    };

    // ── Pre-filtered counts for pagination ──
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
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['departments'] }); setNewDeptName(''); toast.success('Department added'); },
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
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['courses'] }); setNewCourseName(''); setNewCourseCode(''); toast.success('Course added'); },
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

    // ── Safe Role Badges with fixed styling matching journal-theme ──
    const roleBadge = (role: string | undefined) => {
        const normalized = normalizeRole(role);
        if (normalized === 'ADMIN') {
            return <Badge className="bg-journal-burgundy text-white border-transparent">{normalized}</Badge>;
        }
        if (normalized === 'SUPERVISOR') {
            return <Badge variant="warning">{normalized}</Badge>;
        }
        return <Badge variant="secondary">{normalized}</Badge>;
    };

    const statusBadge = (s: string | undefined) => {
        const status = s || 'PENDING';
        const v = status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'destructive' : 'warning';
        return <Badge variant={v as any}>{status}</Badge>;
    };

    const openDeleteUser = (u: User) => {
        setDeleteUser(u);
        setIsDeleteUserOpen(true);
    };

    const closeDeleteUser = () => {
        setIsDeleteUserOpen(false);
        setDeleteUser(null);
    };

    const openDeleteProject = (p: Project) => {
        setDeleteProject(p);
        setIsDeleteProjectOpen(true);
    };

    const closeDeleteProject = () => {
        setIsDeleteProjectOpen(false);
        setDeleteProject(null);
    };

    const openDeleteDept = (id: number, name: string) => {
        setConfirmDeleteDept({ id, name });
        setIsDeleteDeptOpen(true);
    };

    const closeDeleteDept = () => {
        setIsDeleteDeptOpen(false);
        setConfirmDeleteDept(null);
    };

    const openDeleteCourse = (id: number, name: string) => {
        setConfirmDeleteCourse({ id, name });
        setIsDeleteCourseOpen(true);
    };

    const closeDeleteCourse = () => {
        setIsDeleteCourseOpen(false);
        setConfirmDeleteCourse(null);
    };

    const openRoleDialog = (u: User) => {
        setRoleUser(u);
        setSelectedRole(normalizeRole(u.role).toLowerCase());
        setIsRoleDialogOpen(true);
    };

    const closeRoleDialog = () => {
        setIsRoleDialogOpen(false);
        setRoleUser(null);
        setSelectedRole('');
    };

    // ── The manual body-lock effect has been removed because Radix/Dialog handles it ──
    // No useEffect needed here.

    const PaginationControls = ({ 
        page, 
        setPage, 
        pageSize, 
        setPageSize, 
        totalItems, 
        pageSizeOptions = [5, 10, 20, 50] 
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-journal-rule/30">
                <div className="flex items-center gap-2 text-sm text-journal-sepia">
                    <span>Showing <span className="font-medium text-journal-ink">{totalItems > 0 ? start : 0}</span>–<span className="font-medium text-journal-ink">{end}</span> of <span className="font-medium text-journal-ink">{totalItems}</span></span>
                    <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(0); }}>
                        <SelectTrigger className="h-7 w-[70px] text-xs">
                            <SelectValue />
                        </SelectTrigger>
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
                    <span className="text-sm font-medium text-journal-ink min-w-[80px] text-center">
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

            <div className="mx-auto max-w-6xl px-6 lg:px-8 py-12">
                <div className="space-y-10">
                    {/* Header */}
                    <div className="relative">
                        <div className="journal-texture rounded-lg bg-journal-paper-dark/40 p-8 md:p-10 border border-journal-rule/60 journal-vignette">
                            <div className="relative z-10">
                                <p className="journal-eyebrow mb-3">Administration Panel</p>
                                <Heading level="h1" className="text-4xl md:text-5xl font-display text-journal-ink">
                                    Admin Dashboard
                                </Heading>
                                <Text variant="muted" className="mt-2 text-base max-w-lg">
                                    Manage users, projects, departments, and courses from a single control panel.
                                </Text>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {[
                            { label: 'Total Users', value: stats.total, icon: 'mdi:account-group', color: 'text-journal-burgundy', bg: 'bg-journal-burgundy/8', border: 'border-journal-burgundy/20' },
                            { label: 'Supervisors', value: stats.supervisors, icon: 'mdi:account-tie', color: 'text-journal-ink-light', bg: 'bg-journal-warm/30', border: 'border-journal-warm/50' },
                            { label: 'Projects', value: stats.totalProjects, icon: 'mdi:folder-multiple', color: 'text-journal-gold', bg: 'bg-journal-gold/8', border: 'border-journal-gold/20' },
                            { label: 'Approved', value: stats.approved, icon: 'mdi:check-circle-outline', color: 'text-journal-forest', bg: 'bg-journal-forest/8', border: 'border-journal-forest/20' },
                            { label: 'Pending', value: stats.pending, icon: 'mdi:clock-outline', color: 'text-journal-gold', bg: 'bg-journal-gold/8', border: 'border-journal-gold/20' },
                        ].map((s) => (
                            <Card key={s.label} className={`p-5 text-center border ${s.border} bg-card hover:shadow-md transition-shadow duration-200`}>
                                <div className="flex justify-center mb-2">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-sm ${s.bg}`}>
                                        <Icon icon={s.icon} className={`text-base ${s.color}`} />
                                    </div>
                                </div>
                                <div className={`text-3xl font-display font-bold ${s.color} leading-none`}>{s.value}</div>
                                <div className="journal-eyebrow mt-2">{s.label}</div>
                            </Card>
                        ))}
                    </div>

                    <OrnamentalDivider variant="ornamental" glyph="❧" />

                    <Tabs defaultValue="users">
                        <TabsList className="grid w-full grid-cols-4 max-w-xl mx-auto">
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

                        {/* Users Tab */}
                        <TabsContent value="users" className="mt-6">
                            <Card withVignette>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-journal-burgundy/10 border border-journal-burgundy/20">
                                            <Icon icon="mdi:account-group" className="text-journal-burgundy text-lg" />
                                        </div>
                                        <div>
                                            <Heading level="h2" className="text-lg text-journal-ink">User Management</Heading>
                                            <CardDescription>Showing {filteredUsers.length} of {stats.total} active users</CardDescription>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                                        <div className="relative">
                                            <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-journal-sepia text-sm" />
                                            <Input placeholder="Search by name or email…" value={userSearch} onChange={(e) => { setUserSearch(e.target.value); setUserPage(0); }} className="pl-9" />
                                        </div>
                                        <Select value={userRoleFilter} onValueChange={(v) => { setUserRoleFilter(v); setUserPage(0); }}>
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
                                        <div className="py-16 text-center">
                                            <Icon icon="mdi:account-search-outline" className="text-4xl text-journal-sepia/50 mx-auto mb-3" />
                                            <p className="font-serif text-journal-sepia">No users match your filters.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5">
                                            {filteredUsers.map((u: User) => (
                                                <div key={u.id} className="group flex items-center justify-between rounded-sm border border-journal-rule/40 px-4 py-3 hover:bg-journal-warm/10 hover:border-journal-rule transition-colors duration-150">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-journal-burgundy/10 text-journal-burgundy text-sm font-display font-bold border border-journal-burgundy/15">
                                                            {(u.name?.[0] || '?').toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-serif font-medium text-sm truncate text-journal-ink">{u.name || 'Unknown'}</p>
                                                            <p className="text-xs text-journal-sepia truncate">{u.email || 'No email'}</p>
                                                        </div>
                                                        <div className="hidden sm:block ml-2">{roleBadge(u.role)}</div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openRoleDialog(u)}>
                                                            <Icon icon="mdi:account-cog" className="text-sm" />
                                                            <span className="hidden sm:inline">Role</span>
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => openDeleteUser(u)}
                                                        >
                                                            <Icon icon="mdi:delete-outline" className="text-base" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <PaginationControls page={userPage} setPage={setUserPage} pageSize={userPageSize} setPageSize={setUserPageSize} totalItems={allFilteredUsers.length} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Projects Tab */}
                        <TabsContent value="projects" className="mt-6">
                            <Card withVignette>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-journal-gold/10 border border-journal-gold/20">
                                            <Icon icon="mdi:folder-multiple" className="text-journal-gold text-lg" />
                                        </div>
                                        <div>
                                            <Heading level="h2" className="text-lg text-journal-ink">Project Management</Heading>
                                            <CardDescription>Showing {filteredProjects.length} of {stats.totalProjects} projects</CardDescription>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                                        <div className="relative">
                                            <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-journal-sepia text-sm" />
                                            <Input placeholder="Search projects…" value={projectSearch} onChange={(e) => { setProjectSearch(e.target.value); setProjectPage(0); }} className="pl-9" />
                                        </div>
                                        <Select value={projectStatusFilter} onValueChange={(v) => { setProjectStatusFilter(v); setProjectPage(0); }}>
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
                                        <div className="py-16 text-center">
                                            <Icon icon="mdi:folder-search-outline" className="text-4xl text-journal-sepia/50 mx-auto mb-3" />
                                            <p className="font-serif text-journal-sepia">No projects match your filters.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5">
                                            {filteredProjects.map((p: Project) => (
                                                <div key={p.id} className="group flex items-center justify-between rounded-sm border border-journal-rule/40 px-4 py-3 hover:bg-journal-warm/10 hover:border-journal-rule transition-colors duration-150">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-journal-gold/8 border border-journal-gold/15">
                                                            <Icon icon="mdi:folder" className="text-journal-gold text-base" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-serif font-medium text-sm truncate text-journal-ink">{p.title || 'Untitled'}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                {statusBadge(p.approvalStatus)}
                                                                {p.submittedByName && <span className="text-xs text-journal-sepia">by {p.submittedByName}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button size="sm" className="shrink-0 gap-1.5" onClick={() => openDeleteProject(p)}>
                                                        <Icon icon="mdi:delete-outline" className="text-sm" />
                                                        <span className="hidden sm:inline">Delete</span>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <PaginationControls page={projectPage} setPage={setProjectPage} pageSize={projectPageSize} setPageSize={setProjectPageSize} totalItems={allFilteredProjects.length} />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Departments Tab */}
                        <TabsContent value="departments" className="mt-6">
                            <Card withVignette>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-journal-forest/10 border border-journal-forest/20">
                                            <Icon icon="mdi:school-outline" className="text-journal-forest text-lg" />
                                        </div>
                                        <div>
                                            <Heading level="h2" className="text-lg text-journal-ink">Departments</Heading>
                                            <CardDescription>{departments?.length ?? 0} departments registered</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="New department name…"
                                            value={newDeptName}
                                            onChange={(e) => setNewDeptName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && newDeptName.trim() && addDeptMutation.mutate()}
                                        />
                                        <Button
                                            size="sm"
                                            onClick={() => newDeptName.trim() && addDeptMutation.mutate()}
                                            disabled={!newDeptName.trim() || addDeptMutation.isPending}
                                            className="gap-1.5 shrink-0"
                                        >
                                            <Icon icon="mdi:plus" className="text-sm" />Add
                                        </Button>
                                    </div>

                                    <Separator />

                                    {departments?.length === 0 ? (
                                        <div className="py-12 text-center">
                                            <Icon icon="mdi:school-outline" className="text-4xl text-journal-sepia/50 mx-auto mb-3" />
                                            <p className="font-serif text-journal-sepia">No departments yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5">
                                            {departments?.map((d) => (
                                                <div key={d.id} className="group flex items-center justify-between rounded-sm border border-journal-rule/40 px-4 py-3 hover:bg-journal-warm/10 hover:border-journal-rule transition-colors duration-150">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-journal-forest/8 border border-journal-forest/15">
                                                            <Icon icon="mdi:domain" className="text-journal-forest text-sm" />
                                                        </div>
                                                        <span className="font-serif text-sm font-medium text-journal-ink truncate">{d.name}</span>
                                                    </div>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => openDeleteDept(d.id, d.name)}
                                                    >
                                                        <Icon icon="mdi:delete-outline" className="text-base" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Courses Tab */}
                        <TabsContent value="courses" className="mt-6">
                            <Card withVignette>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-journal-burgundy/10 border border-journal-burgundy/20">
                                            <Icon icon="mdi:book-open-variant" className="text-journal-burgundy text-lg" />
                                        </div>
                                        <div>
                                            <Heading level="h2" className="text-lg text-journal-ink">Courses</Heading>
                                            <CardDescription>{allCourses?.length ?? 0} courses across {departments?.length ?? 0} departments</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5">
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
                                            className="gap-1.5 shrink-0"
                                        >
                                            <Icon icon="mdi:plus" className="text-sm" />Add
                                        </Button>
                                    </div>

                                    <Separator />

                                    {allCourses?.length === 0 ? (
                                        <div className="py-12 text-center">
                                            <Icon icon="mdi:book-open-variant" className="text-4xl text-journal-sepia/50 mx-auto mb-3" />
                                            <p className="font-serif text-journal-sepia">No courses yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5 max-h-[28rem] overflow-y-auto pr-1">
                                            {allCourses?.map((c) => (
                                                <div key={c.id} className="group flex items-center justify-between rounded-sm border border-journal-rule/40 px-4 py-3 hover:bg-journal-warm/10 hover:border-journal-rule transition-colors duration-150">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-journal-burgundy/8 border border-journal-burgundy/15">
                                                            <Icon icon="mdi:book-outline" className="text-journal-burgundy text-sm" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <span className="font-serif text-sm font-medium text-journal-ink truncate">{c.name}</span>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                {c.code && <span className="text-xs text-journal-sepia font-mono">{c.code}</span>}
                                                                <span className="text-xs text-journal-sepia/70">{(c as any).department?.name}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => openDeleteCourse(c.id, c.name)}
                                                    >
                                                        <Icon icon="mdi:delete-outline" className="text-base" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* ── Modals Area ── */}

            {/* Delete User Dialog */}
            <Dialog open={isDeleteUserOpen} onOpenChange={(open) => { if (!open) closeDeleteUser(); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Deactivate User</DialogTitle>
                        <DialogDescription>
                            Deactivate "{deleteUser?.name}"? This will hide them from the system.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 pt-2">
                        <Button variant="outline" onClick={closeDeleteUser}>Cancel</Button>
                        <Button disabled={deactivateMutation.isPending} onClick={() => deleteUser && deactivateMutation.mutate(deleteUser.id)}>
                            {deactivateMutation.isPending ? 'Deactivating…' : 'Deactivate'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Project Dialog */}
            <Dialog open={isDeleteProjectOpen} onOpenChange={(open) => { if (!open) closeDeleteProject(); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Delete Project</DialogTitle>
                        <DialogDescription>
                            Permanently delete "{deleteProject?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 pt-2">
                        <Button variant="outline" onClick={closeDeleteProject}>Cancel</Button>
                        <Button disabled={deleteProjectMutation.isPending} onClick={() => deleteProject && deleteProjectMutation.mutate(deleteProject.id)}>
                            {deleteProjectMutation.isPending ? 'Deleting…' : 'Delete Permanently'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Department Confirmation Dialog */}
            <Dialog open={isDeleteDeptOpen} onOpenChange={(open) => { if (!open) closeDeleteDept(); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-destructive/10 border border-destructive/20">
                                <Icon icon="mdi:alert-circle-outline" className="text-destructive text-lg" />
                            </div>
                            <DialogTitle className="font-display text-destructive">Delete Department</DialogTitle>
                        </div>
                        <DialogDescription className="text-sm text-muted-foreground mt-1">
                            Are you sure you want to delete <span className="font-medium text-foreground">"{confirmDeleteDept?.name}"</span>? Any courses assigned to this department might lose their relationship.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 pt-2">
                        <Button variant="outline" onClick={closeDeleteDept} disabled={deleteDeptMutation.isPending}>Cancel</Button>
                        <Button disabled={deleteDeptMutation.isPending} onClick={() => confirmDeleteDept && deleteDeptMutation.mutate(confirmDeleteDept.id)}>
                            {deleteDeptMutation.isPending ? (
                                <><Icon icon="mdi:loading" className="mr-1.5 animate-spin" />Deleting…</>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Course Confirmation Dialog */}
            <Dialog open={isDeleteCourseOpen} onOpenChange={(open) => { if (!open) closeDeleteCourse(); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-destructive/10 border border-destructive/20">
                                <Icon icon="mdi:alert-circle-outline" className="text-destructive text-lg" />
                            </div>
                            <DialogTitle className="font-display text-destructive">Delete Course</DialogTitle>
                        </div>
                        <DialogDescription className="text-sm text-muted-foreground mt-1">
                            Are you sure you want to permanently delete <span className="font-medium text-foreground">"{confirmDeleteCourse?.name}"</span>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 pt-2">
                        <Button variant="outline" onClick={closeDeleteCourse} disabled={deleteCourseMutation.isPending}>Cancel</Button>
                        <Button disabled={deleteCourseMutation.isPending} onClick={() => confirmDeleteCourse && deleteCourseMutation.mutate(confirmDeleteCourse.id)}>
                            {deleteCourseMutation.isPending ? (
                                <><Icon icon="mdi:loading" className="mr-1.5 animate-spin" />Deleting…</>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update Role Dialog */}
            <Dialog open={isRoleDialogOpen} onOpenChange={(open) => { if (!open) closeRoleDialog(); }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Role</DialogTitle>
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
                            {updateRoleMutation.isPending ? 'Updating…' : 'Update Role'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}