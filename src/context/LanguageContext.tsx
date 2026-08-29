import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Language } from '../types/training';
import { locales, type Locale } from '../locales';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Locale;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: locales[language],
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
};
