import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Button, Eyebrow } from 'journal-ds';
import { useMe, useReactionStatus, useSavedStatus, useComments } from '@/hooks/useCatalog';
import api from '@/lib/api';
import type { Project, Comment } from '@/types/catalog';
import 'react-quill-new/dist/quill.snow.css';

interface Props {
    project: Project;
}

export default function ProjectShow({ project }: Props) {
    const qc = useQueryClient();
    const { data: me } = useMe();
    const { data: reactionData, refetch: refetchReaction } = useReactionStatus(project.id);
    const { data: savedData, refetch: refetchSaved } = useSavedStatus(project.id);
    const { data: comments, isLoading: commentsLoading } = useComments(project.id);
    const [newComment, setNewComment] = useState('');

    const canEdit = me && project.userId === me.id && project.approvalStatus !== 'APPROVED';

    const members: { name: string; rollNumber?: string }[] = project.membersJson
        ? JSON.parse(project.membersJson)
        : [];

    // Reaction
    const reactionMutation = useMutation({
        mutationFn: () => api.post('/reactions/toggle', { project_id: project.id }),
        onSuccess: () => refetchReaction(),
    });

    // Save toggle
    const saveMutation = useMutation({
        mutationFn: () => api.post('/saved-projects/toggle', { project_id: project.id }),
        onSuccess: () => refetchSaved(),
    });

    // Comment add
    const addCommentMutation = useMutation({
        mutationFn: (text: string) => api.post('/comments', { project_id: project.id, comment: text }),
        onSuccess: () => {
            setNewComment('');
            qc.invalidateQueries({ queryKey: ['comments', project.id] });
        },
    });

    // Comment delete
    const deleteCommentMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/comments/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', project.id] }),
    });

    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
            <Head title={project.title} />
            <div className="min-h-screen bg-journal-paper font-serif text-journal-ink flex flex-col">
                
                {/* ── Top Bar ── */}
                <div className="bg-journal-ink text-journal-paper text-xs uppercase tracking-widest py-1.5 px-4 flex justify-between items-center font-bold">
                    <div className="flex gap-4 items-center">
                        <Link href="/projects" className="hover:text-journal-burgundy transition-colors flex items-center gap-1">
                            <Icon icon="mdi:arrow-left" /> Back to Index
                        </Link>
                    </div>
                    <div className="flex gap-4">
                        <span className="hidden sm:inline">The Official Student Archive</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex-grow flex flex-col">
                    
                    {/* ── Masthead (Project Header) ── */}
                    <header className="border-b-4 border-double border-journal-ink pb-4 mb-4 md:mb-6">
                        <div className="text-center mb-4">
                            <Eyebrow className="tracking-[0.2em] text-journal-sepia text-xs sm:text-sm uppercase mb-2">
                                {project.departmentName || 'University Archives'}
                            </Eyebrow>
                            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl leading-[0.9] tracking-tighter text-journal-ink uppercase mt-2 mb-4">
                                {project.title}
                            </h1>
                            {project.description && (
                                <p className="italic text-journal-sepia text-lg sm:text-xl font-medium max-w-4xl mx-auto border-y border-journal-rule py-3">
                                    {project.description}
                                </p>
                            )}
                        </div>
                        
                        <div className="w-full flex flex-wrap justify-between items-center border-y-2 border-journal-ink py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] text-journal-ink gap-2">
                            <span className="text-left hidden sm:block">Course: {project.courseCode || project.courseName || 'N/A'}</span>
                            <span className="text-center italic font-serif normal-case font-normal text-journal-sepia text-sm">
                                {project.academic_year || 'Unknown Year'}
                            </span>
                            <span className="text-right">
                                Status: {project.approvalStatus}
                            </span>
                        </div>
                    </header>

                    {/* ── Main Layout ── */}
                    <main className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 flex-grow">
                        
                        {/* Main Content Column */}
                        <article className="md:col-span-8 lg:col-span-9 flex flex-col">
                            
                            {/* Project Details Banner */}
                            <div className="border-b-2 border-journal-ink pb-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase font-bold tracking-widest text-journal-sepia">Lead Supervisor</span>
                                    <span className="font-display text-lg font-bold uppercase">{project.supervisorName || 'Unassigned'}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-xs uppercase font-bold tracking-widest text-journal-sepia">Submitted By</span>
                                    <span className="font-display text-lg font-bold uppercase">{project.submittedByName || 'Unknown'}</span>
                                </div>
                            </div>

                            {/* Details for Objectives and Benefits */}
                            {(project.objectives || project.benefits) && (
                                <div className="border-y border-journal-rule py-6 mb-8 flex flex-col sm:flex-row gap-8 text-sm leading-relaxed text-justify">
                                    {project.objectives && (
                                        <div className="flex-1">
                                            <h3 className="font-display font-black text-lg uppercase border-b border-journal-ink pb-1 mb-3 inline-block">Objectives</h3>
                                            <p>{project.objectives}</p>
                                        </div>
                                    )}
                                    {project.benefits && (
                                        <div className="flex-1">
                                            <h3 className="font-display font-black text-lg uppercase border-b border-journal-ink pb-1 mb-3 inline-block">Benefits</h3>
                                            <p>{project.benefits}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Full Report Body */}
                            {project.body && (
                                <div className="border-b border-journal-rule pb-8 mb-8">
                                    <h2 className="font-display font-black text-3xl uppercase tracking-widest text-journal-ink mb-6 text-center border-y-2 border-journal-ink py-2">
                                        Detailed Report
                                    </h2>
                                    <div 
                                        className="ql-editor prose prose-journal max-w-none text-justify leading-relaxed columns-1 sm:columns-2 gap-8 text-sm sm:text-base"
                                        dangerouslySetInnerHTML={{ __html: project.body }} 
                                    />
                                </div>
                            )}

                        </article>

                        {/* Sidebar */}
                        <aside className="md:col-span-4 lg:col-span-3 flex flex-col gap-6 md:border-l md:border-journal-rule md:pl-6">
                            
                            {/* Project Actions */}
                            {me && (
                                <div className="border-4 border-double border-journal-ink p-4 bg-journal-paper">
                                    <h3 className="font-display font-bold text-sm uppercase tracking-[0.2em] border-b border-journal-ink pb-2 mb-4 text-center">Reader Actions</h3>
                                    <div className="flex justify-center gap-4 mb-2">
                                        <button
                                            onClick={() => reactionMutation.mutate()}
                                            className={`flex flex-col items-center gap-1 transition-all hover:scale-105 ${reactionData?.reacted ? 'text-journal-burgundy' : 'text-journal-ink'}`}
                                            title={reactionData?.reacted ? 'Unlike' : 'Like'}
                                        >
                                            <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${reactionData?.reacted ? 'border-journal-burgundy bg-journal-burgundy/10' : 'border-journal-ink bg-transparent'}`}>
                                                <Icon icon={reactionData?.reacted ? 'mdi:heart' : 'mdi:heart-outline'} className="text-2xl" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{reactionData?.count ?? 0} Likes</span>
                                        </button>

                                        <button
                                            onClick={() => saveMutation.mutate()}
                                            className={`flex flex-col items-center gap-1 transition-all hover:scale-105 ${savedData ? 'text-journal-sepia' : 'text-journal-ink'}`}
                                            title={savedData ? 'Unsave' : 'Save'}
                                        >
                                            <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${savedData ? 'border-journal-sepia bg-journal-sepia/10' : 'border-journal-ink bg-transparent'}`}>
                                                <Icon icon={savedData ? 'mdi:bookmark' : 'mdi:bookmark-outline'} className="text-2xl" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{savedData ? 'Saved' : 'Save'}</span>
                                        </button>

                                        {(me?.id === project.userId || me?.role === 'ADMIN') && (
                                            <Link
                                                href={`/projects/${project.id}/edit`}
                                                className="flex flex-col items-center gap-1 transition-all hover:scale-105 text-journal-ink"
                                                title="Edit Project"
                                            >
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-journal-ink bg-transparent hover:bg-journal-ink/5">
                                                    <Icon icon="mdi:pencil-outline" className="text-2xl" />
                                                </div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Edit</span>
                                            </Link>
                                        )}
                                    </div>
                                    
                                    {canEdit && (
                                        <Link href={`/projects/${project.id}/edit`} className="block mt-4">
                                            <Button className="w-full rounded-none uppercase tracking-widest text-[10px] border-2 border-journal-ink bg-journal-ink text-journal-paper hover:bg-journal-paper hover:text-journal-ink font-bold py-1.5 h-auto">
                                                Edit Report
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* Team Members */}
                            {members.length > 0 && (
                                <div className="bg-journal-paper-dark border-y-[3px] border-double border-journal-ink py-4 px-2">
                                    <h3 className="font-display font-black text-lg uppercase tracking-widest text-journal-ink text-center mb-4">
                                        Contributors
                                    </h3>
                                    <ul className="space-y-2">
                                        {members.map((m, i) => (
                                            <li key={i} className={`flex items-center justify-between text-xs ${i !== 0 ? 'border-t border-journal-rule border-dashed pt-2' : ''}`}>
                                                <span className="font-bold uppercase tracking-wider">{m.name}</span>
                                                {m.rollNumber && <span className="font-serif italic text-journal-sepia">{m.rollNumber}</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Tags / Meta */}
                            {project.tags?.length > 0 && (
                                <div>
                                    <h3 className="font-display font-bold text-sm uppercase tracking-widest border-b-2 border-journal-ink pb-1 mb-3">Index Terms</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((t) => (
                                            <span key={t} className="text-[10px] border border-journal-ink px-2 py-0.5 uppercase tracking-wider font-bold">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* External Links */}
                            <div className="border border-journal-ink p-3 space-y-3">
                                <h3 className="font-display font-bold text-xs uppercase tracking-[0.2em] border-b border-journal-ink pb-1 text-center">Attachments</h3>
                                {project.githubLink && (
                                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center justify-between text-xs font-bold uppercase tracking-widest hover:text-journal-burgundy transition-colors">
                                        <span>Source Code</span>
                                        <Icon icon="mdi:github" className="text-lg" />
                                    </a>
                                )}
                                {project.projectFiles?.length > 0 && (
                                    <div className="space-y-2 border-t border-journal-rule pt-2">
                                        {[...project.projectFiles].reverse().map((url, i) => (
                                            <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center justify-between text-xs font-bold uppercase tracking-widest hover:text-journal-burgundy transition-colors">
                                                <span>Document {i + 1}</span>
                                                <Icon icon="mdi:file-download-outline" className="text-lg" />
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </aside>

                    </main>

                    {/* ── Letters to the Editor (Comments) ── */}
                    {me && (
                        <section className="mt-12 border-t-4 border-journal-ink pt-8">
                            <h2 className="font-display font-black text-3xl uppercase tracking-widest text-journal-ink mb-6 text-center">
                                Letters to the Editor
                            </h2>
                            <p className="text-center text-xs uppercase tracking-widest text-journal-sepia mb-8">
                                Reader Commentary & Critique
                            </p>

                            <div className="max-w-3xl mx-auto space-y-8">
                                {/* Comment Input */}
                                <div className="border-2 border-journal-ink p-4 bg-journal-paper-dark">
                                    <h3 className="font-display text-sm font-bold uppercase mb-2">Submit a Letter</h3>
                                    <textarea
                                        rows={3}
                                        className="w-full resize-none border border-journal-ink bg-transparent p-2 text-sm placeholder:text-journal-sepia/50 focus:border-journal-burgundy focus:ring-0 font-serif leading-relaxed"
                                        placeholder="Draft your critique or commendation..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Button
                                            className="rounded-none uppercase tracking-widest text-[10px] border-2 border-journal-ink bg-journal-ink text-journal-paper hover:bg-journal-paper hover:text-journal-ink font-bold py-1.5 h-auto px-6"
                                            disabled={!newComment.trim() || addCommentMutation.isPending}
                                            onClick={() => newComment.trim() && addCommentMutation.mutate(newComment)}
                                        >
                                            {addCommentMutation.isPending ? 'Sending...' : 'Publish Letter'}
                                        </Button>
                                    </div>
                                </div>

                                {/* Comments List */}
                                <div className="space-y-6">
                                    {commentsLoading ? (
                                        <div className="flex justify-center py-6">
                                            <Icon icon="mdi:loading" className="animate-spin text-2xl text-journal-sepia" />
                                        </div>
                                    ) : (comments ?? []).length === 0 ? (
                                        <p className="text-center text-sm italic text-journal-sepia py-6 border-y border-journal-rule">No correspondence has been submitted for this edition.</p>
                                    ) : (
                                        (comments ?? []).map((c: Comment) => (
                                            <div key={c.id} className="border-b border-journal-rule pb-6 flex gap-4">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-journal-ink bg-journal-paper-dark font-display text-lg font-black uppercase">
                                                    {c.userName?.[0] ?? '?'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-end justify-between mb-2">
                                                        <div>
                                                            <span className="font-bold uppercase tracking-wider text-xs">{c.userName ?? 'Anonymous Reader'}</span>
                                                            {c.userId === me.id && <span className="ml-2 text-[10px] bg-journal-ink text-journal-paper px-1 py-0.5 uppercase">You</span>}
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] uppercase font-bold tracking-widest text-journal-sepia">
                                                                {format(new Date(c.createdAt), 'MMM d, yyyy')}
                                                            </span>
                                                            {c.userId === me.id && (
                                                                <button
                                                                    onClick={() => deleteCommentMutation.mutate(c.id)}
                                                                    className="text-journal-ink hover:text-journal-burgundy transition-colors"
                                                                >
                                                                    <Icon icon="mdi:delete-outline" className="text-sm" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-justify italic font-medium">{c.comment}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ── Footer ── */}
                    <footer className="mt-12 border-t-4 border-double border-journal-ink pt-4 pb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.15em] text-journal-sepia">
                        <p>© {new Date().getFullYear()} Project Catalog · UCSMGY. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="/projects" className="hover:text-journal-ink transition-colors">Return to Index</Link>
                        </div>
                    </footer>

                </div>
            </div>
        </>
    );
}
