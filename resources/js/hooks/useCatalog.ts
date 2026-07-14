import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { User, Department, Course, Project, Comment, ProjectNotification, Filters, Page } from '@/types/catalog';

// ── Auth user ──────────────────────────────────────────────────────────────
export function useMe() {
    return useQuery<User>({
        queryKey: ['me'],
        queryFn: () => api.get('/users/me').then((r) => r.data),
        staleTime: Infinity,
    });
}

// ── Departments / Courses ──────────────────────────────────────────────────
export function useDepartments() {
    return useQuery<Department[]>({
        queryKey: ['departments'],
        queryFn: () => api.get('/departments').then((r) => r.data),
        staleTime: 1000 * 60 * 30,
    });
}

export function useAllCourses() {
    return useQuery<Course[]>({
        queryKey: ['courses'],
        queryFn: () => api.get('/courses').then((r) => r.data),
        staleTime: 1000 * 60 * 30,
    });
}

export function useSupervisors() {
    return useQuery<User[]>({
        queryKey: ['supervisors'],
        queryFn: () => api.get('/supervisors').then((r) => r.data),
        staleTime: 1000 * 60 * 10,
    });
}

// ── Projects ───────────────────────────────────────────────────────────────
export function useProjects(filters: Partial<Filters>) {
    const clean = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v != null),
    );
    return useQuery<Page<Project>>({
        queryKey: ['projects', clean],
        queryFn: () => api.get('/projects/search', { params: clean }).then((r) => r.data),
    });
}

export function useProject(id: number | string) {
    return useQuery<Project>({
        queryKey: ['project', id],
        queryFn: () => api.get(`/projects/${id}`).then((r) => r.data),
        enabled: !!id,
    });
}

export function useUserProjects(userId?: number) {
    return useQuery<Project[]>({
        queryKey: ['userProjects', userId],
        queryFn: () => api.get(`/users/${userId}/projects`).then((r) => r.data),
        enabled: !!userId,
    });
}

// ── Comments ───────────────────────────────────────────────────────────────
export function useComments(projectId: number) {
    return useQuery<Comment[]>({
        queryKey: ['comments', projectId],
        queryFn: () => api.get(`/comments/project/${projectId}`).then((r) => r.data),
        enabled: !!projectId,
    });
}

// ── Reactions ──────────────────────────────────────────────────────────────
export function useReactionStatus(projectId: number) {
    return useQuery<{ reacted: boolean; count: number }>({
        queryKey: ['reaction', projectId],
        queryFn: () => api.get(`/reactions/${projectId}/status`).then((r) => r.data),
        enabled: !!projectId,
    });
}

// ── Saved projects ─────────────────────────────────────────────────────────
export function useSavedProjects() {
    return useQuery<Project[]>({
        queryKey: ['savedProjects'],
        queryFn: () => api.get('/saved-projects').then((r) => r.data),
    });
}

export function useSavedStatus(projectId: number) {
    return useQuery<boolean>({
        queryKey: ['savedStatus', projectId],
        queryFn: () => api.get('/saved-projects/check', { params: { project_id: projectId } }).then((r) => r.data),
        enabled: !!projectId,
    });
}

// ── Notifications ──────────────────────────────────────────────────────────
export function useNotifications() {
    return useQuery<ProjectNotification[]>({
        queryKey: ['notifications'],
        queryFn: () => api.get('/notifications').then((r) => r.data),
    });
}

export function useUnreadCount() {
    return useQuery<{ count: number }>({
        queryKey: ['unreadCount'],
        queryFn: () => api.get('/notifications/unread-count').then((r) => r.data),
        refetchInterval: 30000,
    });
}

// ── Supervisor ─────────────────────────────────────────────────────────────
export function usePendingProjects() {
    return useQuery<Project[]>({
        queryKey: ['pendingProjects'],
        queryFn: () => api.get('/supervisor/projects/pending').then((r) => r.data),
    });
}

// ── Admin ──────────────────────────────────────────────────────────────────
export function useAdminUsers() {
    return useQuery({
        queryKey: ['adminUsers'],
        queryFn: () => api.get('/admin/users?page=0&size=200').then((r) => r.data),
    });
}

export function useAdminProjects() {
    return useQuery({
        queryKey: ['adminProjects'],
        queryFn: () => api.get('/admin/projects?page=0&size=200').then((r) => r.data),
    });
}
