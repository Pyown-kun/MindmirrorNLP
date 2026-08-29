import type { Language } from '../types/training';
import en from './en';
import id from './id';
import nl from './nl';
import type { Locale } from './en';

export const locales: Record<Language, Locale> = { en, id, nl };
export type { Locale };

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  id: 'Indonesia',
  nl: 'Nederlands',
};

export const LANGUAGE_FLAGS: Record<Language, string> = {
  en: '🇬🇧',
  id: '🇮🇩',
  nl: '🇳🇱',
};
