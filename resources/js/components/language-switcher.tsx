import { useLocale } from '@/i18n';
import { cn } from '@/lib/utils';

/** EN | မြန်မာ toggle. Persists via the locale context (account + localStorage). */
export function LanguageSwitcher({ className, tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
    const { locale, setLocale } = useLocale();

    const base = 'rounded-full px-3 py-1.5 transition-colors';
    const inactive = tone === 'dark'
        ? 'text-sidebar-foreground/65 hover:text-white'
        : 'text-muted-foreground hover:text-foreground';
    const active = tone === 'dark'
        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
        : 'bg-primary text-primary-foreground';

    return (
        <div
            className={cn(
                'inline-flex items-center gap-0.5 rounded-full border p-0.5 text-[12px] font-medium',
                tone === 'dark' ? 'border-white/15 bg-white/5' : 'border-border bg-card',
                className,
            )}
            role="group"
            aria-label="Language"
        >
            <button type="button" onClick={() => setLocale('en')} aria-pressed={locale === 'en'} className={cn(base, locale === 'en' ? active : inactive)}>
                EN
            </button>
            <button type="button" onClick={() => setLocale('my')} aria-pressed={locale === 'my'} className={cn(base, locale === 'my' ? active : inactive)}>
                မြန်မာ
            </button>
        </div>
    );
}
