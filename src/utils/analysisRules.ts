import type { Language, PatternType } from '../types/training';

/**
 * Keyword tables driving the Simple AI Analysis Engine.
 * Matching is done on whole words/phrases, case-insensitively, per language.
 */
export const PATTERN_KEYWORDS: Record<Language, Record<PatternType, string[]>> = {
  en: {
    generalization: ['always', 'never', 'everyone', 'nobody', 'all', 'nothing', 'every time'],
    judgment: ['lazy', 'stupid', 'useless', "doesn't care", 'does not care', 'bad employee', 'incompetent', 'irresponsible'],
    assumption: ['he thinks', 'she thinks', 'they think', "doesn't care", 'does not care', "doesn't want", 'does not want', 'obviously', 'clearly he', 'clearly she', 'must be'],
  },
  id: {
    generalization: ['selalu', 'tidak pernah', 'semua orang', 'tidak ada', 'semuanya', 'setiap kali'],
    judgment: ['malas', 'bodoh', 'tidak berguna', 'tidak peduli', 'buruk', 'tidak becus', 'tidak bertanggung jawab'],
    assumption: ['dia pikir', 'dia berpikir', 'tidak peduli', 'tidak mau', 'jelas', 'pasti', 'sudah pasti'],
  },
  nl: {
    generalization: ['altijd', 'nooit', 'iedereen', 'niemand', 'alles', 'niets', 'elke keer'],
    judgment: ['lui', 'dom', 'nutteloos', 'geeft niet om', 'slecht', 'incompetent', 'onverantwoordelijk'],
    assumption: ['hij denkt', 'zij denkt', 'geeft niet om', 'wil niet', 'duidelijk', 'moet wel'],
  },
};

/** Keywords used to score empathy during roleplay / conversation analysis. */
export const EMPATHY_KEYWORDS: Record<Language, string[]> = {
  en: ['understand', 'sorry', 'i see', 'i appreciate', 'thank you for explaining', 'i hear you', 'that makes sense'],
  id: ['saya mengerti', 'maaf', 'saya paham', 'terima kasih sudah menjelaskan', 'saya bisa memahami'],
  nl: ['ik begrijp', 'sorry', 'ik snap', 'dank je voor de uitleg', 'dat is begrijpelijk'],
};

/** Keywords that indicate the user asked something specific / clarifying. */
export const CLARIFYING_KEYWORDS: Record<Language, string[]> = {
  en: ['what happened', 'can you explain', 'what caused', 'why', 'what problem', 'which project', 'when did', 'how did'],
  id: ['apa yang terjadi', 'bisa jelaskan', 'apa penyebabnya', 'kenapa', 'mengapa', 'masalah apa', 'proyek mana', 'kapan'],
  nl: ['wat is er gebeurd', 'kun je uitleggen', 'wat veroorzaakte', 'waarom', 'welk probleem', 'welk project', 'wanneer'],
};

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const containsKeyword = (text: string, keyword: string): boolean => {
  const normalized = text.toLowerCase();
  const pattern = new RegExp(`\\b${escapeRegExp(keyword.toLowerCase())}\\b`);
  return pattern.test(normalized);
};

export const findMatchedKeywords = (text: string, keywords: string[]): string[] => {
  return keywords.filter((k) => containsKeyword(text, k));
};

/** Splits free text into rough sentences for pattern-attribution purposes. */
export const splitSentences = (text: string): string[] => {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
};
