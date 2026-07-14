import { Head } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
    Badge, Button, Card, CardContent,
    Heading, Text,
    OrnamentalDivider,
} from 'journal-ds';
import { useNotifications } from '@/hooks/useCatalog';
import api from '@/lib/api';
import type { ProjectNotification } from '@/types/catalog';
import { Link } from '@inertiajs/react';

const typeConfig: Record<string, { icon: string; label: string; variant: 'default' | 'success' | 'warning' | 'destructive'; color: string; bg: string }> = {
    comment: { icon: 'mdi:comment-outline', label: 'Comment', variant: 'default', color: 'text-journal-ink-light', bg: 'bg-journal-warm/40' },
    approval: { icon: 'mdi:check-decagram-outline', label: 'Approved', variant: 'success', color: 'text-journal-forest', bg: 'bg-journal-forest/10' },
    rejection: { icon: 'mdi:close-circle-outline', label: 'Rejected', variant: 'destructive', color: 'text-destructive', bg: 'bg-destructive/10' },
    submission: { icon: 'mdi:file-send-outline', label: 'Submission', variant: 'warning', color: 'text-journal-gold', bg: 'bg-journal-gold/10' },
};

export default function NotificationsPage() {
    const qc = useQueryClient();
    const { data: notifications, isLoading } = useNotifications();

    const markReadMutation = useMutation({
        mutationFn: (id: number) => api.patch(`/notifications/${id}/read`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
    });

    const markAllMutation = useMutation({
        mutationFn: () => api.post('/notifications/mark-all-read'),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['notifications'] });
            qc.invalidateQueries({ queryKey: ['unreadCount'] });
        },
    });

    const unread = notifications?.filter((n) => !n.is_read).length ?? 0;

    return (
        <>
            <Head title="Notifications" />
            <div className="mx-auto max-w-3xl px-6 lg:px-8 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Heading level="h1" className="text-3xl text-journal-ink">Notifications</Heading>
                        <Text variant="muted" className="mt-1">
                            {unread > 0 ? `${unread} unread` : 'All caught up!'}
                        </Text>
                    </div>
                    {unread > 0 && (
                        <Button variant="outline" size="sm" onClick={() => markAllMutation.mutate()} disabled={markAllMutation.isPending}>
                            <Icon icon="mdi:check-all" className="mr-1.5" />Mark all read
                        </Button>
                    )}
                </div>

                <OrnamentalDivider variant="simple" className="mb-8" />

                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-20 rounded-sm bg-muted skeleton-shimmer" />
                        ))}
                    </div>
                ) : !notifications?.length ? (
                    <div className="flex flex-col items-center py-24 text-center gap-4">
                        <Icon icon="mdi:bell-sleep-outline" className="text-7xl text-journal-sepia" />
                        <Heading level="h2" className="text-xl text-journal-ink">No notifications yet</Heading>
                        <Text variant="muted">You'll see project comments, approvals, and reviews here.</Text>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((n: ProjectNotification) => {
                            const cfg = typeConfig[n.notification_type] ?? typeConfig.comment;
                            return (
                                <Card
                                    key={n.id}
                                    className={`transition-all cursor-pointer hover:shadow-md ${!n.is_read ? 'border-journal-burgundy/30 bg-journal-burgundy/5' : ''}`}
                                    onClick={() => !n.is_read && markReadMutation.mutate(n.id)}
                                >
                                    <CardContent className="flex items-start gap-4 p-5">
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${cfg.bg} ${cfg.color}`}>
                                            <Icon icon={cfg.icon} className="text-xl" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <Badge variant={cfg.variant} className="text-xs">{cfg.label}</Badge>
                                                {!n.is_read && (
                                                    <span className="h-2 w-2 rounded-full bg-journal-burgundy" />
                                                )}
                                            </div>
                                            <p className="text-sm font-medium font-serif">{n.message}</p>
                                            {n.project_title && (
                                                <p className="text-xs text-journal-sepia mt-1">
                                                    Project: <Link href={`/projects/${n.project_id}/view`} className="hover:underline text-journal-burgundy">{n.project_title}</Link>
                                                </p>
                                            )}
                                            {n.comment_text && (
                                                <p className="mt-2 text-xs text-journal-sepia italic border-l-2 border-journal-rule pl-3 line-clamp-2">"{n.comment_text}"</p>
                                            )}
                                            {n.rejection_reason && (
                                                <p className="mt-2 text-xs text-destructive/80 border-l-2 border-destructive/30 pl-3">{n.rejection_reason}</p>
                                            )}
                                            <p className="mt-2 journal-eyebrow text-journal-sepia/60">
                                                {format(new Date(n.created_at), 'MMM d, yyyy · h:mm a')}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
