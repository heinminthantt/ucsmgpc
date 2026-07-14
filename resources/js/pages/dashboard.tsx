import { Head, Link } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import {
    Button, Card, CardContent, Badge,
    Heading, Text, Eyebrow,
    OrnamentalDivider,
} from 'journal-ds';
import { useMe, useUserProjects, useNotifications } from '@/hooks/useCatalog';
import { ProjectCard } from '@/components/project-card';

export default function Dashboard() {
    const { data: me } = useMe();
    const { data: myProjects } = useUserProjects(me?.id);
    const { data: notifications } = useNotifications();

    const unread = notifications?.filter((n) => !n.is_read).length ?? 0;
    const recentProjects = myProjects?.slice(0, 3) ?? [];

    return (
        <>
            <Head title="Dashboard" />
            <div className="mx-auto max-w-5xl px-6 lg:px-8 py-12">
                <div className="space-y-8">
                    {/* Welcome */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <Heading level="h1" className="text-3xl text-journal-ink">
                                Welcome back{me?.name ? `, ${me.name.split(' ')[0]}` : ''}!
                            </Heading>
                            <Text variant="muted" className="mt-1">
                                Here's what's happening with your projects.
                            </Text>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/projects/create">
                                <Button size="sm" className="gap-1.5">
                                    <Icon icon="mdi:plus" />New Project
                                </Button>
                            </Link>
                            <Link href="/projects">
                                <Button size="sm" variant="outline" className="gap-1.5">
                                    <Icon icon="mdi:compass-outline" />Browse
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { label: 'My Projects', value: myProjects?.length ?? 0, icon: 'mdi:folder-multiple-outline', color: 'text-journal-burgundy', bg: 'bg-journal-burgundy/10', href: '/profile' },
                            { label: 'Approved', value: myProjects?.filter((p) => p.approvalStatus === 'APPROVED').length ?? 0, icon: 'mdi:check-decagram-outline', color: 'text-journal-forest', bg: 'bg-journal-forest/10', href: '/profile' },
                            { label: 'Pending Review', value: myProjects?.filter((p) => p.approvalStatus === 'PENDING').length ?? 0, icon: 'mdi:clock-outline', color: 'text-journal-gold', bg: 'bg-journal-gold/10', href: '/profile' },
                            { label: 'Notifications', value: unread, icon: 'mdi:bell-outline', color: 'text-journal-ink-light', bg: 'bg-journal-warm/40', href: '/notifications' },
                        ].map((s) => (
                            <Link key={s.label} href={s.href}>
                                <Card className="p-5 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                                    <CardContent className="p-0 flex items-center gap-4">
                                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-sm ${s.bg} ${s.color}`}>
                                            <Icon icon={s.icon} className="text-2xl" />
                                        </div>
                                        <div>
                                            <div className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</div>
                                            <div className="text-xs font-serif text-journal-sepia">{s.label}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* Role-specific shortcuts */}
                    {(me?.role === 'SUPERVISOR' || me?.role === 'ADMIN') && (
                        <Card withVignette className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Icon icon="mdi:clipboard-check-outline" className="text-journal-burgundy text-xl" />
                                <Heading level="h3" className="text-base text-journal-ink">Quick Actions</Heading>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/supervisor-dashboard">
                                    <Button variant="outline" size="sm" className="gap-1.5">
                                        <Icon icon="mdi:clipboard-check-outline" />Supervisor Dashboard
                                    </Button>
                                </Link>
                                {me.role === 'ADMIN' && (
                                    <Link href="/admin-dashboard">
                                        <Button variant="outline" size="sm" className="gap-1.5">
                                            <Icon icon="mdi:shield-crown-outline" />Admin Dashboard
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </Card>
                    )}

                    <OrnamentalDivider variant="dot" />

                    {/* Recent projects */}
                    <div>
                        <div className="mb-5 flex items-center justify-between">
                            <Heading level="h2" className="text-xl text-journal-ink">My Recent Projects</Heading>
                            <Link href="/profile" className="font-serif text-sm text-journal-burgundy hover:underline flex items-center gap-1">
                                View all <Icon icon="mdi:arrow-right" />
                            </Link>
                        </div>
                        {recentProjects.length === 0 ? (
                            <Card className="p-12 text-center space-y-4">
                                <Icon icon="mdi:folder-outline" className="text-5xl text-journal-sepia mx-auto" />
                                <Text className="font-medium">No projects yet</Text>
                                <Link href="/projects/create">
                                    <Button size="sm" className="gap-1.5 mt-1">
                                        <Icon icon="mdi:plus" />Create your first project
                                    </Button>
                                </Link>
                            </Card>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {recentProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
