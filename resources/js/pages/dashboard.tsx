import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Bell, CheckCircle2, ClipboardCheck, Clock, Compass, Folder, FolderOpen, Plus, Shield } from 'lucide-react';
import { ProjectCard } from '@/components/project-card';
import { Button } from '@/components/ui';
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
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                <div className="space-y-9">
                    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
                                {t('dash.welcome_back')}{me?.name ? `, ${me.name.split(' ')[0]}` : ''}
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
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
                    </header>

                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {stats.map((s) => (
                            <Link key={s.label} href={s.href} className="group">
                                <div className="h-full rounded-lg border border-border bg-card p-5 transition-all duration-300 group-hover:border-gold/50 group-hover:shadow-[0_14px_30px_-24px_rgba(19,42,69,0.45)]">
                                    <div className="flex items-center justify-between">
                                        <span className="flex size-9 items-center justify-center rounded-full bg-primary/[0.06] text-primary dark:bg-gold/10 dark:text-gold">
                                            <s.icon className="size-4.5" strokeWidth={1.7} />
                                        </span>
                                        <ArrowRight className="size-4 text-muted-foreground/30 transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
                                    </div>
                                    <div className="font-display mt-5 text-3xl leading-none font-semibold text-foreground">{s.value}</div>
                                    <div className="mt-1.5 text-[12px] text-muted-foreground">{s.label}</div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {(me?.role === 'SUPERVISOR' || me?.role === 'ADMIN' || me?.role === 'DEPARTMENT_ADMIN') && (
                        <div className="rounded-lg border border-border bg-card p-5">
                            <div className="mb-4 flex items-center gap-2.5">
                                <ClipboardCheck className="size-4 text-gold" />
                                <h2 className="font-display text-lg text-foreground">{t('dash.quick_actions')}</h2>
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
                            <h2 className="flex items-center gap-3 font-display text-xl font-medium text-foreground">
                                <span className="h-px w-7 bg-gold" />
                                {t('dash.recent')}
                            </h2>
                            <Link href="/profile" className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
                                {t('dash.view_all')} <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        {recentProjects.length === 0 ? (
                            <div className="rounded-lg border border-border bg-card px-6 py-14 text-center">
                                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
                                    <Folder className="size-5 text-muted-foreground/60" />
                                </span>
                                <p className="font-display mt-4 text-lg text-foreground">{t('dash.no_projects_title')}</p>
                                <p className="mt-1 text-[13px] text-muted-foreground">{t('dash.no_projects_desc')}</p>
                                <Button asChild size="sm" className="mt-5">
                                    <Link href="/projects/create">
                                        <Plus /> {t('dash.create_first')}
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {recentProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
