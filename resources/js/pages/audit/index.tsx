import { Head } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import { ScrollText } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useT } from '@/i18n';
import api from '@/lib/api';

type AuditRow = {
    id: number;
    actorName?: string | null;
    action: string;
    subjectType?: string | null;
    subjectId?: number | null;
    meta?: Record<string, unknown> | null;
    createdAt?: string | null;
};

type AuditPage = { data: AuditRow[]; total: number; currentPage: number; lastPage: number };

/** Audit log page (Phase 3): dept admins see their department, admins see all. */
export default function AuditIndex() {
    const t = useT();
    const [action, setAction] = useState('');
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery<AuditPage>({
        queryKey: ['audit-logs', action, page],
        queryFn: () =>
            api
                .get('/audit-logs', { params: { ...(action ? { action } : {}), page } })
                .then((r) => r.data),
    });

    return (
        <>
            <Head title="Audit log" />
            <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div>
                    <h1 className="text-3xl font-semibold">{t('audit.title')}</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {data?.total ?? 0} {(data?.total ?? 0) === 1 ? 'record' : 'records'}, newest first.
                    </p>
                </div>

                <div className="flex max-w-sm items-center gap-2">
                    <Input
                        placeholder="Filter by action, e.g. project.featured"
                        value={action}
                        onChange={(e) => {
                            setAction(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-card">
                    {isLoading && <p className="px-4 py-3 text-sm text-muted-foreground">Loading...</p>}
                    {!isLoading && (data?.data ?? []).length === 0 && (
                        <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
                            <span className="mb-1 flex size-12 items-center justify-center rounded-full bg-muted">
                                <ScrollText className="size-5 text-muted-foreground/60" />
                            </span>
                            <p className="font-display text-lg text-foreground">No audit records found</p>
                            <p className="max-w-sm text-[13px] text-muted-foreground">
                                {action
                                    ? 'No records match this filter.'
                                    : 'Approvals, edits, and publishing actions will be recorded here.'}
                            </p>
                        </div>
                    )}
                    {(data?.data ?? []).map((row, i) => (
                        <div key={row.id} className={`flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm ${i > 0 ? 'border-t border-border' : ''}`}>
                            <span className="font-medium">{row.action}</span>
                            <span className="text-muted-foreground">by {row.actorName ?? 'system'}</span>
                            {row.subjectType && (
                                <span className="text-muted-foreground">
                                    {row.subjectType.split('\\').pop()} #{row.subjectId}
                                </span>
                            )}
                            {row.createdAt && (
                                <span className="ml-auto text-muted-foreground">
                                    {new Date(row.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Yangon' })}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {(data?.lastPage ?? 1) > 1 && (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {data?.currentPage} of {data?.lastPage}
                        </span>
                        <Button variant="outline" size="sm" disabled={page >= (data?.lastPage ?? 1)} onClick={() => setPage((p) => p + 1)}>
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
