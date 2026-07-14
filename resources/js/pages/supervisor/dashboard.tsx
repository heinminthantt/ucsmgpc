import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    Badge, Button, Card, CardContent, CardHeader,
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
    Separator,
    Heading, Text, Eyebrow,
    OrnamentalDivider,
} from 'journal-ds';
import { useMe, usePendingProjects } from '@/hooks/useCatalog';
import api from '@/lib/api';
import type { Project } from '@/types/catalog';

export default function SupervisorDashboard() {
    const qc = useQueryClient();
    const { data: me } = useMe();
    const { data: pending, isLoading, isError } = usePendingProjects();
    const [rejectProject, setRejectProject] = useState<Project | null>(null);
    const [reason, setReason] = useState('');

    const canAccess = me?.role === 'SUPERVISOR' || me?.role === 'ADMIN';

    const approveMutation = useMutation({
        mutationFn: (id: number) => api.post(`/supervisor/projects/${id}/approve`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['pendingProjects'] });
            toast.success('Project approved!');
        },
        onError: () => toast.error('Approval failed'),
    });

    const rejectMutation = useMutation({
        mutationFn: ({ id, reason }: { id: number; reason: string }) =>
            api.post(`/supervisor/projects/${id}/reject`, { reason }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['pendingProjects'] });
            toast.success('Project rejected');
            setRejectProject(null);
            setReason('');
        },
        onError: () => toast.error('Rejection failed'),
    });

    if (!canAccess) {
        return (
            <>
                <Head title="Access Denied" />
                <div className="flex h-[60vh] items-center justify-center">
                    <Card className="max-w-md text-center p-10 space-y-4">
                        <Icon icon="mdi:shield-lock-outline" className="text-5xl text-destructive mx-auto" />
                        <Heading level="h2" className="text-xl text-destructive">Access Denied</Heading>
                        <Text variant="muted">You don't have supervisor access.</Text>
                    </Card>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Supervisor Dashboard" />
            <div className="mx-auto max-w-5xl px-6 lg:px-8 py-12">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <Eyebrow className="text-journal-sepia">Review Panel</Eyebrow>
                        <Heading level="h1" className="text-4xl text-journal-ink">Supervisor Dashboard</Heading>
                        <Text variant="muted">Review and approve pending student projects.</Text>

                        {/* Stats */}
                        <div className="flex justify-center gap-4 mt-6">
                            <Card className="px-8 py-5 text-center min-w-36">
                                <div className="text-3xl font-display font-bold text-journal-gold">{pending?.length ?? 0}</div>
                                <div className="journal-eyebrow mt-1">Pending</div>
                            </Card>
                        </div>
                    </div>

                    <OrnamentalDivider variant="ornamental" />

                    {/* Content */}
                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <Icon icon="mdi:loading" className="animate-spin text-4xl text-journal-sepia" />
                        </div>
                    ) : isError ? (
                        <Card className="p-10 text-center space-y-4">
                            <Icon icon="mdi:alert-circle-outline" className="text-4xl text-destructive mx-auto" />
                            <Text className="font-medium text-destructive">Failed to load projects</Text>
                            <Button variant="outline" onClick={() => qc.invalidateQueries({ queryKey: ['pendingProjects'] })}>Retry</Button>
                        </Card>
                    ) : !pending?.length ? (
                        <Card className="p-14 text-center space-y-4">
                            <Icon icon="mdi:check-circle-outline" className="text-6xl text-journal-forest mx-auto" />
                            <Heading level="h2" className="text-xl text-journal-forest">All caught up!</Heading>
                            <Text variant="muted">No projects are waiting for your review.</Text>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {pending.map((project: Project) => (
                                <Card key={project.id} withVignette className="flex flex-col hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-display font-semibold text-base leading-snug line-clamp-2 text-journal-ink">{project.title}</h3>
                                            <Badge variant="warning" className="text-xs shrink-0">Pending</Badge>
                                        </div>
                                        <p className="font-serif text-sm text-journal-ink-light line-clamp-2 mt-1.5 leading-relaxed">{project.description}</p>
                                    </CardHeader>
                                    <CardContent className="flex flex-col flex-1 gap-4">
                                        {/* Meta */}
                                        <div className="grid grid-cols-2 gap-3 rounded-sm bg-journal-warm/20 p-3 text-center">
                                            <div>
                                                <p className="journal-eyebrow">Academic Year</p>
                                                <p className="text-sm font-serif font-medium text-journal-ink mt-0.5">{project.academic_year ?? '—'}</p>
                                            </div>
                                            <div>
                                                <p className="journal-eyebrow">Semester</p>
                                                <p className="text-sm font-serif font-medium text-journal-ink mt-0.5">{project.student_year ?? '—'}</p>
                                            </div>
                                        </div>

                                        {/* Objectives */}
                                        {project.objectives && (
                                            <div className="space-y-1">
                                                <p className="journal-eyebrow flex items-center gap-1">
                                                    <Icon icon="mdi:target" className="text-journal-burgundy text-xs" />Objectives
                                                </p>
                                                <p className="text-xs font-serif text-journal-ink-light line-clamp-3 pl-4 border-l-2 border-journal-rule leading-relaxed">
                                                    {project.objectives}
                                                </p>
                                            </div>
                                        )}

                                        {/* Tags */}
                                        {project.tags?.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {project.tags.slice(0, 4).map((t) => (
                                                    <Badge key={t} variant="outline" className="text-xs py-0">{t}</Badge>
                                                ))}
                                                {project.tags.length > 4 && (
                                                    <Badge variant="outline" className="text-xs py-0">+{project.tags.length - 4}</Badge>
                                                )}
                                            </div>
                                        )}

                                        <Separator />

                                        {/* Actions */}
                                        <div className="grid grid-cols-3 gap-2 mt-auto">
                                            <Button size="sm" className="bg-journal-forest hover:bg-journal-forest/90 text-white col-span-1 gap-1"
                                                disabled={approveMutation.isPending}
                                                onClick={() => approveMutation.mutate(project.id)}>
                                                <Icon icon="mdi:check" />Approve
                                            </Button>
                                            <Button size="sm" variant="destructive" className="col-span-1 gap-1"
                                                onClick={() => setRejectProject(project)}>
                                                <Icon icon="mdi:close" />Reject
                                            </Button>
                                            <Link href={`/projects/${project.id}/view`}>
                                                <Button size="sm" variant="outline" className="w-full gap-1">
                                                    <Icon icon="mdi:eye-outline" />View
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Reject dialog */}
            <Dialog open={!!rejectProject} onOpenChange={(o) => !o && setRejectProject(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-destructive flex items-center gap-2 font-display">
                            <Icon icon="mdi:alert-circle-outline" />Reject Project
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Text variant="muted" className="text-sm">
                            Provide a reason for rejecting <span className="font-medium text-journal-ink">"{rejectProject?.title}"</span>.
                        </Text>
                        <textarea rows={4} className="w-full resize-none rounded-sm border border-input bg-background px-3 py-2 font-serif text-sm focus:border-destructive focus:outline-none focus:ring-1 focus:ring-destructive"
                            placeholder="Detailed rejection reason..."
                            value={reason} onChange={(e) => setReason(e.target.value)} />
                        <div className="rounded-sm bg-journal-warm/20 p-3 text-xs font-serif text-journal-sepia">
                            💡 Provide constructive feedback to help the student improve their project.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectProject(null)}>Cancel</Button>
                        <Button variant="destructive" disabled={!reason.trim() || rejectMutation.isPending}
                            onClick={() => rejectProject && rejectMutation.mutate({ id: rejectProject.id, reason })}>
                            {rejectMutation.isPending ? 'Rejecting...' : 'Reject Project'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
