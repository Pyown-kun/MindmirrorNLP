import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGE_FLAGS, LANGUAGE_LABELS } from '../locales';
import type { Language } from '../types/training';

const LANGS: Language[] = ['en', 'id', 'nl'];

interface LanguageSelectorProps {
  compact?: boolean;
}

export const LanguageSelector = ({ compact = false }: LanguageSelectorProps) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-ink/10 bg-white/80 backdrop-blur-sm p-1 shadow-sm ${
        compact ? 'text-xs' : 'text-sm'
      }`}
      role="group"
      aria-label="Language selector"
    >
      <Globe className="ml-2 h-4 w-4 text-muted shrink-0" aria-hidden="true" />
      {LANGS.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
            language === lang ? 'bg-primary text-white' : 'text-muted hover:text-ink'
          }`}
          aria-pressed={language === lang}
        >
          <span className="mr-1">{LANGUAGE_FLAGS[lang]}</span>
          {!compact && LANGUAGE_LABELS[lang]}
        </button>
      ))}
    </div>
  );
};
