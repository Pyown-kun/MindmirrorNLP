
import type {
  AnalysisInput,
  AnalysisResult,
  CommunicationAnalysis,
  DetectedPattern,
  Language,
  RoleplayMessage,
} from '../../types/training';

import type { AIAnalysisService } from './AIService';

import { getCurriculumModule } from '../../curriculum/modules';

import {
  CLARIFYING_KEYWORDS,
  EMPATHY_KEYWORDS,
  PATTERN_KEYWORDS,
  findMatchedKeywords,
  splitSentences,
} from '../../utils/analysisRules';

/**
 * SimpleAnalysisService
 * ----------------------
 * Transparent, rule-based implementation of AIAnalysisService.
 *
 * No external API or AI model is required.
 * The analysis works completely offline using:
 * - keyword matching
 * - sentence analysis
 * - simple communication heuristics
 *
 * This implementation is intentionally deterministic so it is
 * suitable for the MindMirror demo environment.
 */
export class SimpleAnalysisService implements AIAnalysisService {
  /**
   * Detect mindset patterns from participant text.
   */
  analyzeMindset(input: AnalysisInput): AnalysisResult {
    const { text, language } = input;

    const sentences = splitSentences(text);
    const patterns: DetectedPattern[] = [];

    const module = getCurriculumModule(input.moduleId ?? null);
    const patternRules = module.patternRules;

    const keywordGroups = patternRules.keywordGroups[language];

    /**
     * Analyze only the pattern types enabled by the curriculum module.
     */
    patternRules.rules.forEach((type) => {
      const keywords = keywordGroups[type];

      if (!keywords || keywords.length === 0) {
        return;
      }

      /**
       * Normal case:
       * analyze every detected sentence separately.
       */
      sentences.forEach((sentence) => {
        const matches = findMatchedKeywords(sentence, keywords);

        matches.forEach((matchedText) => {
          patterns.push({
            type,
            matchedText,
            sourceSentence: sentence,
          });
        });
      });

      /**
       * Fallback:
       * if splitSentences() returns no sentences,
       * analyze the complete input instead.
       */
      if (sentences.length === 0 && text.trim()) {
        const matches = findMatchedKeywords(text, keywords);

        matches.forEach((matchedText) => {
          patterns.push({
            type,
            matchedText,
            sourceSentence: text,
          });
        });
      }
    });

    /**
     * Remove duplicate detections.
     *
     * Two detections are considered identical when they have
     * the same pattern type, matched keyword and source sentence.
     */
    const seen = new Set<string>();

    const deduped = patterns.filter((pattern) => {
      const key = [
        pattern.type,
        pattern.matchedText,
        pattern.sourceSentence,
      ].join('|');

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });

    return {
      patterns: deduped,
      isClean: deduped.length === 0,
    };
  }

  /**
   * Generate reflection comparison between the participant's
   * initial thought and their latest response.
   */
  generateReflection(input: {
    initialThought: string;
    messages: RoleplayMessage[];
    language: Language;
  }): string {
    const lastUserMessage =
      [...input.messages]
        .reverse()
        .find((message) => message.speaker === 'user')
        ?.text ?? '';

    const initialThought = input.initialThought.trim();
    const laterThought = lastUserMessage.trim();

    if (!initialThought && !laterThought) {
      return '';
    }

    if (!laterThought) {
      return initialThought;
    }

    if (!initialThought) {
      return laterThought;
    }

    return `${initialThought} → ${laterThought}`;
  }

  /**
   * Generate the Aha Moment comparison.
   */
  generateAhaMoment(input: {
    initialThought: string;
    laterResponse: string;
    language: Language;
  }): string {
    const initialThought = input.initialThought.trim();
    const laterResponse = input.laterResponse.trim();

    if (!initialThought && !laterResponse) {
      return '';
    }

    if (!laterResponse) {
      return initialThought;
    }

    if (!initialThought) {
      return laterResponse;
    }

    return `${initialThought} → ${laterResponse}`;
  }

  /**
   * Return the practical challenge configured for the selected
   * curriculum module and language.
   */
  generateTakeaway(input: {
    language: Language;
    moduleId?: string;
  }): string {
    const module = getCurriculumModule(input.moduleId ?? null);

    return module.takeaway.practicalChallenge[input.language];
  }

  /**
   * Analyze the participant's communication during roleplay.
   *
   * Produces five dimensions:
   * - Empathy
   * - Specificity
   * - Clarity
   * - NLP Practice
   * - Self-Awareness
   *
   * Scores are normalized to 0–100.
   */
  analyzeConversation(messages: RoleplayMessage[], language: Language): CommunicationAnalysis {
    const userMessages = messages.filter(m => m.speaker === 'user');
    const turns = userMessages.map(m => m.text);
    const evidence = buildConversationEvidence(turns, language);

    const specificity = clampScore(
      20 + evidence.progression * 55 + Math.min(evidence.concreteDetails * 5, 20)
    );
    const empathy = clampScore(
      45 + Math.min(evidence.empathySignals * 12, 35) - Math.min(evidence.judgmentSignals * 8, 20)
    );
    const clarity = clampScore(
      55 + Math.min(evidence.clarifyingQuestions * 5, 20) + Math.min(evidence.observableBehavior * 5, 15) - Math.min(evidence.assumptionSignals * 7, 21)
    );
    const nlpPractice = clampScore(
      35 + evidence.progression * 45 + Math.min(evidence.clarifyingQuestions * 4, 20) - evidence.generalizationSignals * 6 - evidence.judgmentSignals * 5
    );
    const selfAwareness = clampScore(
      50 + evidence.progression * 30 + evidence.openQuestions * 4 + evidence.empathySignals * 4 - evidence.assumptionSignals * 5
    );
    const overall = Math.round(
      specificity * 0.30 + nlpPractice * 0.30 + clarity * 0.15 + empathy * 0.10 + selfAwareness * 0.15
    );
    return { empathy: Math.round(empathy), specificity: Math.round(specificity), clarity: Math.round(clarity), nlpPractice: Math.round(nlpPractice), selfAwareness: Math.round(selfAwareness), overall, evidence };
  }

}

function buildConversationEvidence(turns: string[], language: Language) {
  const ev = { broadToSpecific: 0, concreteDetails: 0, personOrRole: 0, timeOrPlace: 0, observableBehavior: 0, clarifyingQuestions: 0, openQuestions: 0, closedQuestions: 0, empathySignals: 0, judgmentSignals: 0, assumptionSignals: 0, generalizationSignals: 0, progression: 0, highlights: [] as string[] };
  let priorSpecificity = 0;
  turns.forEach((text, index) => {
    const t = text.toLowerCase();
    const q = /[?]$/.test(t) || /^(who|what|when|where|which|how|why|apa|siapa|kapan|di mana|mana|bagaimana|mengapa|wat|wie|wanneer|waar|welk|hoe|waarom)\b/.test(t);
    const specific = [
      /\b(who|siapa|wie|manager|manajer|team|tim|client|klien|colleague|rekan)\b/.test(t),
      /\b(when|where|kapan|di mana|wanneer|waar|yesterday|today|tomorrow|kemarin|hari ini|besok|gisteren|vandaag|morgen)\b/.test(t),
      /\b(said|say|did|happened|interrupted|sent|wrote|mengatakan|terjadi|menyela|mengirim|menulis|zei|gebeurde|onderbrak)\b/.test(t),
      /\b(meeting|rapat|project|proyek|deadline|meeting|client|klien)\b/.test(t)
    ];
    const level = specific.filter(Boolean).length;
    if (q) ev.clarifyingQuestions++;
    if (/\b(tell me|tell me more|what happened|ceritakan|jelaskan|apa yang terjadi|vertel|wat gebeurde|hoe)\b/.test(t)) ev.openQuestions++;
    if (/^(so|are|is|do|did|will|jadi|apakah|benarkah|dus|is het|klopt)\b/.test(t)) ev.closedQuestions++;
    ev.personOrRole += specific[0] ? 1 : 0; ev.timeOrPlace += specific[1] ? 1 : 0; ev.observableBehavior += specific[2] ? 1 : 0; ev.concreteDetails += level;
    ev.empathySignals += /\b(understand|sounds|must be|frustrat|concern|paham|mengerti|frustrasi|khawatir|begrijp|klinkt|zorgelijk)\b/.test(t) ? 1 : 0;
    ev.judgmentSignals += /\b(lazy|careless|incompetent|stupid|malas|ceroboh|tidak kompeten|bodoh|lui|onbekwaam|dom)\b/.test(t) ? 1 : 0;
    ev.assumptionSignals += /\b(obviously|clearly|probably|i assume|pasti|jelas|mungkin dia|saya kira|tentu|waarschijnlijk|duidelijk|ik neem aan)\b/.test(t) ? 1 : 0;
    ev.generalizationSignals += (t.match(/\b(always|never|everyone|nobody|selalu|tidak pernah|semua orang|tidak ada yang|altijd|nooit|iedereen|niemand)\b/g) || []).length;
    if (level > priorSpecificity && index > 0) ev.broadToSpecific++;
    priorSpecificity = Math.max(priorSpecificity, level);
  });
  const opportunities = Math.max(turns.length - 1, 1);
  ev.progression = clampScore((ev.broadToSpecific / opportunities) * 100) / 100;
  if (ev.personOrRole) ev.highlights.push(tx(language, 'You made a person or role explicit.', 'Anda memperjelas orang atau peran yang terlibat.', 'Je maakte een persoon of rol expliciet.'));
  if (ev.timeOrPlace) ev.highlights.push(tx(language, 'You anchored the conversation in a time or situation.', 'Anda mengaitkan percakapan dengan waktu atau situasi tertentu.', 'Je verankerde het gesprek in een tijd of situatie.'));
  if (ev.observableBehavior) ev.highlights.push(tx(language, 'You moved toward observable behavior.', 'Anda mengarahkan percakapan ke perilaku yang dapat diamati.', 'Je ging richting waarneembaar gedrag.'));
  if (ev.generalizationSignals) ev.highlights.push(tx(language, 'You used a broad/general statement that could be explored further.', 'Anda menggunakan pernyataan umum yang masih bisa digali lebih lanjut.', 'Je gebruikte een brede uitspraak die verder onderzocht kan worden.'));
  return ev;
}

function tx(language: Language, en: string, id: string, nl: string) { return language === 'id' ? id : language === 'nl' ? nl : en; }

/**
 * Clamp a score to the valid 0–100 range.
 */
const clampScore = (value: number): number =>
  Math.max(0, Math.min(100, value));