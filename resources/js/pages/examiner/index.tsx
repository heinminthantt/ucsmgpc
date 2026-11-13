import { Head, Link } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { useT } from '@/i18n';
import api from '@/lib/api';

type QueueItem = {
    id: number;
    title: string;
    status: string;
    evaluationConflict?: boolean;
    teamLeaderName?: string | null;
    supervisorName?: string | null;
    cycleLabel?: string | null;
    finalSubmissionId?: number | null;
};

/** Examiner queue page (Phase 3): final submissions waiting on my confirmation. */
export default function ExaminerIndex() {
    const t = useT();
    const { data: queue, isLoading } = useQuery<QueueItem[]>({
        queryKey: ['examiner-queue'],
        queryFn: () => api.get('/examiner/queue').then((r) => r.data),
    });

    return (
        <>
            <Head title="Examiner queue" />
            <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div>
                    <h1 className="text-3xl font-semibold">{t('examiner.title')}</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {(queue ?? []).length} {(queue ?? []).length === 1 ? 'project' : 'projects'} waiting for your evaluation.
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-card">
                    {isLoading && <p className="px-4 py-3 text-sm text-muted-foreground">Loading...</p>}
                    {!isLoading && (queue ?? []).length === 0 && (
                        <p className="px-4 py-3 text-sm text-muted-foreground">{t('examiner.empty')}</p>
                    )}
                    {(queue ?? []).map((p, i) => (
                        <div key={p.id} className={`flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm ${i > 0 ? 'border-t border-border' : ''}`}>
                            <Link href={`/projects/${p.id}/view`} className="font-medium hover:underline">
                                {p.title}
                            </Link>
                            <Badge variant="outline">{p.status.replace(/_/g, ' ')}</Badge>
                            {p.evaluationConflict && <Badge variant="destructive">Evaluation conflict</Badge>}
                            {p.teamLeaderName && <span className="text-muted-foreground">Leader: {p.teamLeaderName}</span>}
                            {p.supervisorName && <span className="text-muted-foreground">Supervisor: {p.supervisorName}</span>}
                            {p.cycleLabel && <span className="text-muted-foreground">{p.cycleLabel}</span>}
                            <span className="ml-auto">
                                <Link href={`/supervisor-dashboard`} className="text-primary hover:underline">
                                    Review
                                </Link>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
