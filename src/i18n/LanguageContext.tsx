import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';
import type { Locale, Translations } from './types';
import pl from './pl';
import en from './en';

const STORAGE_KEY = '5queens_lang';

const TRANSLATIONS: Record<Locale, Translations> = { pl, en };

function detectLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'pl' || stored === 'en') return stored;
  if (navigator.language.startsWith('pl')) return 'pl';
  return 'en';
}

type LanguageContextValue = {
  lang: Locale;
  setLang: (l: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue>(null!);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user, isSignedIn } = useUser();
  const [lang, setLangState] = useState<Locale>(() => {
    // Check Clerk metadata first if available from SSR/cache
    const clerkLang = user?.unsafeMetadata?.lang as string | undefined;
    if (clerkLang === 'pl' || clerkLang === 'en') return clerkLang;
    return detectLocale();
  });

  // Sync from Clerk on sign-in
  useEffect(() => {
    if (isSignedIn && user?.unsafeMetadata?.lang) {
      const clerkLang = user.unsafeMetadata.lang as string;
      if (clerkLang === 'pl' || clerkLang === 'en') {
        setLangState(clerkLang);
        localStorage.setItem(STORAGE_KEY, clerkLang);
      }
    }
  }, [isSignedIn, user?.unsafeMetadata?.lang]);

  const setLang = useCallback((l: Locale) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
    if (isSignedIn && user) {
      user.update({ unsafeMetadata: { ...user.unsafeMetadata, lang: l } }).catch(() => {});
    }
  }, [isSignedIn, user]);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let text = TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, String(v));
      }
    }
    return text;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
