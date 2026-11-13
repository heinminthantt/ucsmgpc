import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import api from '@/lib/api';
import en from './en.json';
import my from './my.json';

/**
 * Lightweight i18n for the Burmese pass (Phase 3, spec D10).
 * Dictionaries live beside this file as en.json / my.json with identical
 * flat keys; any key missing in Burmese falls back to English.
 * Logged-in users persist the choice on their account (PATCH /api/me/locale);
 * guests keep it in localStorage.
 */
export type Locale = 'en' | 'my';

const dictionaries: Record<Locale, Record<string, string>> = {
    en: en as Record<string, string>,
    my: my as Record<string, string>,
};

type LocaleContextValue = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextValue>({
    locale: 'en',
    setLocale: () => {},
    t: (key) => en[key as keyof typeof en] ?? key,
});

function storedLocale(): Locale | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const stored = window.localStorage.getItem('locale');

    return stored === 'my' || stored === 'en' ? stored : null;
}

/**
 * The locale the server shared for the signed-in account. This provider is
 * mounted OUTSIDE the Inertia context (it wraps the app in withApp), so it
 * cannot use usePage(): doing so throws "usePage must be used within the
 * Inertia component" and blanks every page. Instead, read the locale from
 * the initial page payload Inertia embeds in the document on first load.
 */
function initialServerLocale(): Locale | null {
    if (typeof document === 'undefined') {
        return null;
    }

    try {
        const raw = document.querySelector('script[data-page="app"]')?.textContent;

        if (!raw) {
            return null;
        }

        const locale = (JSON.parse(raw) as { props?: { locale?: string } }).props?.locale;

        return locale === 'my' || locale === 'en' ? locale : null;
    } catch {
        return null;
    }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
    // Priority: an explicit toggle in this session, then the account
    // preference shared by the server, then the guest localStorage value.
    const [override, setOverride] = useState<Locale | null>(null);
    const [serverLocale] = useState<Locale | null>(() => initialServerLocale());
    const [stored] = useState<Locale | null>(() => storedLocale());
    const locale: Locale = override ?? serverLocale ?? stored ?? 'en';

    // Drives :lang(my) typography (MiSans Myanmar) and assistive tech.
    useEffect(() => {
        document.documentElement.lang = locale;
    }, [locale]);

    const setLocale = useCallback((next: Locale) => {
        setOverride(next);

        if (typeof window !== 'undefined') {
            window.localStorage.setItem('locale', next);
        }

        // Persist for logged-in users; guests just keep localStorage.
        api.patch('/me/locale', { locale: next }).catch(() => {});
    }, []);

    const value = useMemo<LocaleContextValue>(() => ({
        locale,
        setLocale,
        t: (key: string) => dictionaries[locale][key] ?? dictionaries.en[key] ?? key,
    }), [locale, setLocale]);

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
    return useContext(LocaleContext);
}

/** Convenience hook: const t = useT(); t('nav.projects') */
export function useT(): (key: string) => string {
    return useLocale().t;
}
