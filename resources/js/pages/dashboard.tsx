import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Bell, CheckCircle2, ClipboardCheck, Clock, Compass, Folder, FolderOpen, Plus, Shield } from 'lucide-react';
import { ProjectCard } from '@/components/project-card';
import { Button, Card, CardContent } from '@/components/ui';
import { useMe, useUserProjects, useNotifications } from '@/hooks/useCatalog';
import { useT } from '@/i18n';

export default function Dashboard() {
    const t = useT();
    const { data: me } = useMe();
    const { data: myProjects } = useUserProjects(me?.id);
    const { data: notifications } = useNotifications();

    const unread = notifications?.filter((n) => !n.is_read).length ?? 0;
    const recentProjects = myProjects?.slice(0, 3) ?? [];

    const stats = [
        { label: t('dash.my_projects'), value: myProjects?.length ?? 0, icon: FolderOpen, href: '/profile' },
        { label: t('dash.approved'), value: myProjects?.filter((p) => p.approvalStatus === 'APPROVED').length ?? 0, icon: CheckCircle2, href: '/profile' },
        { label: t('dash.pending_review'), value: myProjects?.filter((p) => p.approvalStatus === 'PENDING').length ?? 0, icon: Clock, href: '/profile' },
        { label: t('dash.notifications'), value: unread, icon: Bell, href: '/notifications' },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-stone-900">
                                {t('dash.welcome_back')}{me?.name ? `, ${me.name.split(' ')[0]}` : ''}
                            </h1>
                            <p className="mt-1 text-sm text-stone-500">
                                {t('dash.happening')}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button asChild size="sm">
                                <Link href="/projects/create">
                                    <Plus /> {t('nav.new_project')}
                                </Link>
                            </Button>
                            <Button asChild size="sm" variant="outline">
                                <Link href="/projects">
                                    <Compass /> {t('dash.browse')}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((s) => (
                            <Link key={s.label} href={s.href}>
                                <Card className="p-5 transition-colors hover:border-stone-300">
                                    <CardContent className="flex items-center gap-3 p-0">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-500">
                                            <s.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="text-xl font-semibold text-stone-900">{s.value}</div>
                                            <div className="text-[13px] text-stone-500">{s.label}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {(me?.role === 'SUPERVISOR' || me?.role === 'ADMIN') && (
                        <div className="rounded-xl border border-stone-200 bg-white p-5">
                            <div className="mb-4 flex items-center gap-2">
                                <ClipboardCheck className="h-5 w-5 text-stone-400" />
                                <h2 className="text-sm font-medium text-stone-900">{t('dash.quick_actions')}</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/supervisor-dashboard">
                                        <ClipboardCheck /> {t('dash.supervisor_dashboard')}
                                    </Link>
                                </Button>
                                {me.role === 'ADMIN' && (
                                    <Button asChild variant="outline" size="sm">
                                        <Link href="/admin-dashboard">
                                            <Shield /> {t('dash.admin_dashboard')}
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-base font-medium text-stone-900">{t('dash.recent')}</h2>
                            <Link href="/profile" className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900">
                                {t('dash.view_all')} <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        {recentProjects.length === 0 ? (
                            <div className="rounded-xl border border-stone-200 bg-white px-6 py-12 text-center">
                                <Folder className="mx-auto h-8 w-8 text-stone-300" />
                                <p className="mt-3 text-sm font-medium text-stone-900">{t('dash.no_projects_title')}</p>
                                <p className="mt-1 text-[13px] text-stone-500">{t('dash.no_projects_desc')}</p>
                                <Button asChild size="sm" className="mt-4">
                                    <Link href="/projects/create">
                                        <Plus /> {t('dash.create_first')}
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {recentProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
