import { Icon } from '@iconify/react';
import { Head, Link } from '@inertiajs/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Badge, Button } from '@/components/ui';
import { useNotifications } from '@/hooks/useCatalog';
import api from '@/lib/api';
import type { ProjectNotification } from '@/types/catalog';

const typeConfig: Record<string, { icon: string; label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    comment: { icon: 'mdi:comment-outline', label: 'Comment', variant: 'secondary' },
    approval: { icon: 'mdi:check-decagram-outline', label: 'Approved', variant: 'default' },
    rejection: { icon: 'mdi:close-circle-outline', label: 'Rejected', variant: 'destructive' },
    submission: { icon: 'mdi:file-send-outline', label: 'Submission', variant: 'outline' },
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
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-xl font-semibold text-stone-900">Notifications</h1>
                        <p className="text-sm text-stone-500">
                            {unread > 0 ? `${unread} unread` : 'All caught up'}
                        </p>
                    </div>
                    {unread > 0 && (
                        <Button variant="outline" size="sm" onClick={() => markAllMutation.mutate()} disabled={markAllMutation.isPending}>
                            Mark all read
                        </Button>
                    )}
                </div>

                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-20 animate-pulse rounded-xl border border-stone-200 bg-stone-50" />
                        ))}
                    </div>
                ) : !notifications?.length ? (
                    <div className="flex flex-col items-center gap-3 rounded-xl border border-stone-200 bg-white px-6 py-16 text-center">
                        <Icon icon="mdi:bell-sleep-outline" className="text-5xl text-stone-300" />
                        <h2 className="text-base font-medium text-stone-900">No notifications yet</h2>
                        <p className="text-sm text-stone-500">You'll see project comments, approvals, and reviews here.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((n: ProjectNotification) => {
                            const cfg = typeConfig[n.notification_type] ?? typeConfig.comment;

                            return (
                                <div
                                    key={n.id}
                                    className={`cursor-pointer rounded-xl border bg-white p-5 hover:bg-stone-50 ${!n.is_read ? 'border-stone-300' : 'border-stone-200'}`}
                                    onClick={() => !n.is_read && markReadMutation.mutate(n.id)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500">
                                            <Icon icon={cfg.icon} className="text-xl" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1.5 flex items-center gap-2">
                                                <Badge variant={cfg.variant} className="text-xs">{cfg.label}</Badge>
                                                {!n.is_read && (
                                                    <span className="h-2 w-2 rounded-full bg-stone-800" />
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-stone-900">{n.message}</p>
                                            {n.project_title && (
                                                <p className="mt-1 text-[13px] text-stone-500">
                                                    Project: <Link href={`/projects/${n.project_id}/view`} className="text-stone-700 hover:underline">{n.project_title}</Link>
                                                </p>
                                            )}
                                            {n.comment_text && (
                                                <p className="mt-2 line-clamp-2 border-l-2 border-stone-200 pl-3 text-[13px] text-stone-500">"{n.comment_text}"</p>
                                            )}
                                            {n.rejection_reason && (
                                                <p className="mt-2 border-l-2 border-red-200 pl-3 text-[13px] text-red-600">{n.rejection_reason}</p>
                                            )}
                                            <p className="mt-2 text-xs text-stone-400">
                                                {format(new Date(n.created_at), 'MMM d, yyyy · h:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
