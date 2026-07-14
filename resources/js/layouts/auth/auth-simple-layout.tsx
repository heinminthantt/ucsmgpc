import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { OrnamentalDivider, Eyebrow } from 'journal-ds';

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="min-h-svh bg-journal-paper journal-texture flex flex-col items-center justify-center p-8 md:p-16 lg:p-24">

            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    {/* Logo */}
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="space-y-1.5">
                            <Eyebrow className="mx-auto">{title}</Eyebrow>
                            {description && (
                                <p className="font-serif text-sm text-journal-sepia leading-relaxed">{description}</p>
                            )}
                        </div>
                    </div>

                    {/* Paper card */}
                    <div className="rounded-sm border border-journal-rule bg-journal-paper shadow-[var(--shadow-md)] journal-vignette px-8 py-8">
                        {children}
                    </div>

                    {/* Footer note */}
                    <p className="text-center journal-eyebrow text-journal-sepia/50">
                        est. 2024 · reviewed &amp; curated
                    </p>
                </div>
            </div>
        </div>
    );
}
