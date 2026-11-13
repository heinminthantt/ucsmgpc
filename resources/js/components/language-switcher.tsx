import { useLocale } from '@/i18n';
import { cn } from '@/lib/utils';

/** EN | မြန်မာ toggle. Persists via the locale context (account + localStorage). */
export function LanguageSwitcher({ className }: { className?: string }) {
    const { locale, setLocale } = useLocale();

    return (
        <div className={cn('inline-flex items-center rounded-lg border border-stone-200 bg-white p-0.5 text-[13px]', className)} role="group" aria-label="Language">
            <button
                type="button"
                onClick={() => setLocale('en')}
                className={cn('rounded-md px-2 py-1', locale === 'en' ? 'bg-stone-900 font-medium text-white' : 'text-stone-500 hover:text-stone-900')}
            >
                EN
            </button>
            <button
                type="button"
                onClick={() => setLocale('my')}
                className={cn('rounded-md px-2 py-1', locale === 'my' ? 'bg-stone-900 font-medium text-white' : 'text-stone-500 hover:text-stone-900')}
            >
                မြန်မာ
            </button>
        </div>
    );
}
