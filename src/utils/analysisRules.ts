import type { Language, PatternType } from '../types/training';

/**
 * Keyword tables driving the Simple AI Analysis Engine.
 *
 * Matching is:
 * - case-insensitive
 * - based on whole words / phrases
 * - language-aware
 *
 * These rules are intentionally transparent and deterministic so
 * the MindMirror demo can explain why a communication pattern
 * was detected.
 */

export const PATTERN_KEYWORDS: Record<
  Language,
  Record<PatternType, string[]>
> = {
  en: {
    generalization: [
      'always',
      'never',
      'everyone',
      'nobody',
      'no one',
      'all',
      'nothing',
      'everything',
      'every time',
      'every single time',
      'constantly',
      'everybody',
    ],

    judgment: [
      'lazy',
      'stupid',
      'useless',
      'careless',
      'incompetent',
      'irresponsible',
      'bad employee',
      'bad worker',
      'terrible employee',
      'terrible worker',
      'unprofessional',
      'unreliable',
      'selfish',
      'rude',
      'difficult person',
      'problematic',
      'does not care',
      "doesn't care",
    ],

    assumption: [
      'he thinks',
      'she thinks',
      'they think',
      'he wants',
      'she wants',
      'they want',
      'he does not want',
      "he doesn't want",
      'she does not want',
      "she doesn't want",
      'they do not want',
      "they don't want",
      'he does not care',
      "he doesn't care",
      'she does not care',
      "she doesn't care",
      'they do not care',
      "they don't care",
      'obviously',
      'clearly',
      'clearly he',
      'clearly she',
      'clearly they',
      'must be',
      'must have',
      'probably',
      'I assume',
      'I suppose',
    ],
  },

  id: {
    generalization: [
      'selalu',
      'tidak pernah',
      'tak pernah',
      'semua orang',
      'semuanya',
      'semua',
      'tidak ada yang',
      'tidak ada',
      'setiap kali',
      'setiap saat',
      'terus menerus',
      'terus-menerus',
      'sepanjang waktu',
      'kapan pun',
    ],

    judgment: [
      'malas',
      'bodoh',
      'tidak berguna',
      'tidak becus',
      'tidak kompeten',
      'tidak bertanggung jawab',
      'ceroboh',
      'buruk',
      'pegawai buruk',
      'karyawan buruk',
      'pekerja buruk',
      'tidak profesional',
      'tidak dapat diandalkan',
      'egois',
      'kasar',
      'orang yang sulit',
      'bermasalah',
      'tidak peduli',
    ],

    assumption: [
      'dia pikir',
      'dia berpikir',
      'dia mau',
      'dia ingin',
      'dia tidak mau',
      'dia tidak ingin',
      'dia tidak peduli',
      'mereka pikir',
      'mereka berpikir',
      'mereka mau',
      'mereka ingin',
      'mereka tidak mau',
      'mereka tidak ingin',
      'mereka tidak peduli',
      'jelas',
      'jelas sekali',
      'pasti',
      'sudah pasti',
      'mungkin dia',
      'mungkin mereka',
      'saya kira',
      'saya berasumsi',
      'tentu',
    ],
  },

  nl: {
    generalization: [
      'altijd',
      'nooit',
      'iedereen',
      'niemand',
      'alles',
      'niets',
      'elke keer',
      'iedere keer',
      'de hele tijd',
      'constant',
      'iedereen doet',
    ],

    judgment: [
      'lui',
      'dom',
      'nutteloos',
      'incompetent',
      'onbekwaam',
      'onverantwoordelijk',
      'onvoorzichtig',
      'slecht',
      'slechte werknemer',
      'onprofessioneel',
      'onbetrouwbaar',
      'egoïstisch',
      'onbeleefd',
      'moeilijk persoon',
      'problematisch',
      'geeft niet om',
    ],

    assumption: [
      'hij denkt',
      'zij denkt',
      'ze denken',
      'hij wil',
      'zij wil',
      'ze willen',
      'hij wil niet',
      'zij wil niet',
      'ze willen niet',
      'hij geeft niet om',
      'zij geeft niet om',
      'ze geven niet om',
      'duidelijk',
      'duidelijk hij',
      'duidelijk zij',
      'waarschijnlijk',
      'moet wel',
      'ik neem aan',
      'ik veronderstel',
    ],
  },
};

/**
 * Keywords used to identify empathy during roleplay.
 *
 * These phrases indicate that the participant:
 * - acknowledges another person's experience
 * - shows understanding
 * - validates emotion
 * - appreciates an explanation
 */
export const EMPATHY_KEYWORDS: Record<Language, string[]> = {
  en: [
    'understand',
    'i understand',
    'i see',
    'i hear you',
    'that makes sense',
    'i appreciate',
    'i appreciate you',
    'thank you',
    'thank you for explaining',
    'sorry',
    'i can understand',
    'i understand why',
    'that sounds difficult',
    'that sounds frustrating',
    'that must be difficult',
    'that must be frustrating',
    'i can see why',
  ],

  id: [
    'saya mengerti',
    'saya paham',
    'saya memahami',
    'saya bisa memahami',
    'saya mengerti kenapa',
    'saya paham kenapa',
    'saya mengerti mengapa',
    'saya paham mengapa',
    'saya dengar',
    'saya memahami perasaan',
    'saya bisa mengerti',
    'terima kasih',
    'terima kasih sudah menjelaskan',
    'maaf',
    'saya bisa memahami kenapa',
    'saya bisa melihat kenapa',
    'kedengarannya sulit',
    'kedengarannya membuat frustrasi',
    'saya bisa memahami perasaanmu',
  ],

  nl: [
    'ik begrijp',
    'ik begrijp het',
    'ik snap',
    'ik snap het',
    'ik begrijp waarom',
    'ik snap waarom',
    'ik hoor je',
    'dat begrijp ik',
    'dat is begrijpelijk',
    'dat klinkt logisch',
    'ik waardeer',
    'dank je',
    'dank je voor de uitleg',
    'sorry',
    'ik kan begrijpen',
    'ik zie waarom',
    'dat klinkt moeilijk',
    'dat klinkt frustrerend',
  ],
};

/**
 * Keywords that indicate a specific or clarifying question.
 *
 * These are used to reward communication that moves from
 * assumptions/generalizations toward observable details.
 */
export const CLARIFYING_KEYWORDS: Record<Language, string[]> = {
  en: [
    'what happened',
    'what exactly happened',
    'what happened when',
    'can you explain',
    'can you explain what happened',
    'can you tell me',
    'tell me more',
    'what caused',
    'what caused the',
    'why',
    'what problem',
    'which project',
    'which task',
    'which situation',
    'when did',
    'when was',
    'where did',
    'where was',
    'who was involved',
    'who was there',
    'how did',
    'how did that happen',
    'what do you mean',
    'what specifically',
    'which part',
  ],

  id: [
    'apa yang terjadi',
    'apa tepatnya yang terjadi',
    'apa yang sebenarnya terjadi',
    'bisa jelaskan',
    'bisa jelaskan apa yang terjadi',
    'bisa ceritakan',
    'ceritakan lebih lanjut',
    'jelaskan lebih lanjut',
    'apa penyebabnya',
    'apa yang menyebabkan',
    'kenapa',
    'mengapa',
    'masalah apa',
    'proyek mana',
    'tugas mana',
    'situasi mana',
    'kapan terjadi',
    'kapan itu terjadi',
    'kapan',
    'di mana',
    'di mana itu terjadi',
    'siapa yang terlibat',
    'siapa yang ada di sana',
    'bagaimana itu terjadi',
    'bagaimana bisa terjadi',
    'apa maksudnya',
    'apa secara spesifik',
    'bagian mana',
  ],

  nl: [
    'wat is er gebeurd',
    'wat is er precies gebeurd',
    'wat gebeurde er',
    'kun je uitleggen',
    'kun je uitleggen wat er gebeurde',
    'kun je vertellen',
    'vertel me meer',
    'wat veroorzaakte',
    'wat was de oorzaak',
    'waarom',
    'welk probleem',
    'welk project',
    'welke taak',
    'welke situatie',
    'wanneer gebeurde',
    'wanneer was',
    'waar gebeurde',
    'waar was',
    'wie was betrokken',
    'wie was erbij',
    'hoe gebeurde dat',
    'hoe kon dat gebeuren',
    'wat bedoel je',
    'wat precies',
    'welk deel',
  ],
};

/**
 * Escape characters that have special meaning in a RegExp.
 */
const escapeRegExp = (text: string): string =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Normalize text before keyword matching.
 *
 * This keeps matching deterministic while allowing the same
 * rules to work with normal user-entered sentences.
 */
const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Check whether a keyword exists in text.
 *
 * Word boundaries are used so that a keyword such as "all"
 * does not accidentally match part of another word.
 */
export const containsKeyword = (
  text: string,
  keyword: string
): boolean => {
  const normalizedText = normalizeText(text);
  const normalizedKeyword = normalizeText(keyword);

  if (!normalizedText || !normalizedKeyword) {
    return false;
  }

  const pattern = new RegExp(
    `\\b${escapeRegExp(normalizedKeyword)}\\b`,
    'i'
  );

  return pattern.test(normalizedText);
};

/**
 * Return every keyword that was actually detected.
 *
 * A keyword is returned only once, even if it occurs multiple
 * times in the same sentence.
 */
export const findMatchedKeywords = (
  text: string,
  keywords: string[]
): string[] => {
  return keywords.filter((keyword) =>
    containsKeyword(text, keyword)
  );
};

/**
 * Return the number of matching keywords.
 */
export const countMatchedKeywords = (
  text: string,
  keywords: string[]
): number => {
  return findMatchedKeywords(text, keywords).length;
};

/**
 * Return all detected pattern types for a given text.
 *
 * This is useful when the UI needs to explain exactly which
 * communication patterns were detected.
 */
export const findMatchedPatterns = (
  text: string,
  language: Language
): PatternType[] => {
  const matched: PatternType[] = [];

  const rules = PATTERN_KEYWORDS[language];

  (Object.keys(rules) as PatternType[]).forEach((type) => {
    if (findMatchedKeywords(text, rules[type]).length > 0) {
      matched.push(type);
    }
  });

  return matched;
};

/**
 * Splits free text into rough sentences for pattern attribution.
 *
 * Handles:
 * - periods
 * - question marks
 * - exclamation marks
 * - line breaks
 */
export const splitSentences = (text: string): string[] => {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
};