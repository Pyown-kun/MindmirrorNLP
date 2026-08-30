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
 * - communication heuristics
 *
 * The implementation is deterministic so the demo can explain
 * why a communication pattern or score was detected.
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
     * Analyze only pattern types enabled by the curriculum.
     */
    patternRules.rules.forEach((type) => {
      const keywords = keywordGroups[type];

      if (!keywords || keywords.length === 0) {
        return;
      }

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
       * Fallback for text without sentence separators.
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
   * Analyze participant communication during roleplay.
   *
   * Five dimensions are calculated:
   * - Empathy
   * - Specificity
   * - Clarity
   * - NLP Practice
   * - Self-Awareness
   *
   * Scores are normalized to 0–100.
   */
  analyzeConversation(
    messages: RoleplayMessage[],
    language: Language
  ): CommunicationAnalysis {
    const userMessages = messages.filter(
      (message) => message.speaker === 'user'
    );

    const turns = userMessages.map((message) => message.text);

    const evidence = buildConversationEvidence(
      turns,
      language
    );

    const specificity = clampScore(
      20 +
        evidence.progression * 55 +
        Math.min(evidence.concreteDetails * 5, 20)
    );

    const empathy = clampScore(
      45 +
        Math.min(evidence.empathySignals * 12, 35) -
        Math.min(evidence.judgmentSignals * 8, 20)
    );

    const clarity = clampScore(
      55 +
        Math.min(evidence.clarifyingQuestions * 5, 20) +
        Math.min(evidence.observableBehavior * 5, 15) -
        Math.min(evidence.assumptionSignals * 7, 21)
    );

    const nlpPractice = clampScore(
      35 +
        evidence.progression * 45 +
        Math.min(evidence.clarifyingQuestions * 4, 20) -
        evidence.generalizationSignals * 6 -
        evidence.judgmentSignals * 5
    );

    const selfAwareness = clampScore(
      50 +
        evidence.progression * 30 +
        evidence.openQuestions * 4 +
        evidence.empathySignals * 4 -
        evidence.assumptionSignals * 5
    );

    const overall = Math.round(
      specificity * 0.3 +
        nlpPractice * 0.3 +
        clarity * 0.15 +
        empathy * 0.1 +
        selfAwareness * 0.15
    );

    return {
      empathy: Math.round(empathy),
      specificity: Math.round(specificity),
      clarity: Math.round(clarity),
      nlpPractice: Math.round(nlpPractice),
      selfAwareness: Math.round(selfAwareness),
      overall,
      evidence,
    };
  }
}

/**
 * Build measurable communication evidence.
 *
 * IMPORTANT:
 * Pattern detection itself remains centralized in analyzeMindset().
 * This function only needs the numeric evidence required for scoring.
 */
function buildConversationEvidence(
  turns: string[],
  language: Language
) {
  const ev = {
    broadToSpecific: 0,
    concreteDetails: 0,
    personOrRole: 0,
    timeOrPlace: 0,
    observableBehavior: 0,
    clarifyingQuestions: 0,
    openQuestions: 0,
    closedQuestions: 0,
    empathySignals: 0,
    judgmentSignals: 0,
    assumptionSignals: 0,
    generalizationSignals: 0,
    progression: 0,
    highlights: [] as string[],
  };

  let priorSpecificity = 0;

  turns.forEach((text, index) => {
    const t = text.toLowerCase().trim();

    /**
     * ---------------------------------------------------------
     * QUESTION DETECTION
     * ---------------------------------------------------------
     */
    const q =
      /[?]$/.test(t) ||
      /^(who|what|when|where|which|how|why|apa|siapa|kapan|di mana|mana|bagaimana|mengapa|wat|wie|wanneer|waar|welk|hoe|waarom)\b/.test(
        t
      );

    /**
     * ---------------------------------------------------------
     * SPECIFICITY SIGNALS
     *
     * 0 = no signal
     * 1 = person / role
     * 2 = time / place
     * 3 = observable behavior
     * 4 = concrete situation
     * ---------------------------------------------------------
     */
    const specific = [
      /\b(who|siapa|wie|manager|manajer|team|tim|client|klien|colleague|rekan|manager|werknemer)\b/.test(
        t
      ),

      /\b(when|where|kapan|di mana|wanneer|waar|yesterday|today|tomorrow|kemarin|hari ini|besok|gisteren|vandaag|morgen)\b/.test(
        t
      ),

      /\b(said|say|did|happened|interrupted|sent|wrote|mengatakan|terjadi|menyela|mengirim|menulis|zei|gebeurde|onderbrak|stuurde)\b/.test(
        t
      ),

      /\b(meeting|rapat|project|proyek|deadline|client|klien|task|tugas|situation|situasi|taak|situatie)\b/.test(
        t
      ),
    ];

    const level = specific.filter(Boolean).length;

    /**
     * ---------------------------------------------------------
     * CLARIFYING KEYWORDS
     * ---------------------------------------------------------
     *
     * Uses the centralized language-specific rules from
     * analysisRules.ts.
     */
    const clarifyingMatches = findMatchedKeywords(
      t,
      CLARIFYING_KEYWORDS[language]
    );

    /**
     * ---------------------------------------------------------
     * EMPATHY KEYWORDS
     * ---------------------------------------------------------
     *
     * Uses the centralized language-specific rules from
     * analysisRules.ts.
     */
    const empathyMatches = findMatchedKeywords(
      t,
      EMPATHY_KEYWORDS[language]
    );

    /**
     * ---------------------------------------------------------
     * CLARIFYING QUESTIONS
     * ---------------------------------------------------------
     */
    if (q || clarifyingMatches.length > 0) {
      ev.clarifyingQuestions += Math.max(
        1,
        clarifyingMatches.length
      );
    }

    /**
     * ---------------------------------------------------------
     * OPEN QUESTIONS
     * ---------------------------------------------------------
     */
    if (
      /\b(tell me|tell me more|what happened|what exactly happened|ceritakan|jelaskan|apa yang terjadi|ceritakan lebih lanjut|vertel|wat gebeurde|hoe)\b/.test(
        t
      )
    ) {
      ev.openQuestions++;
    }

    /**
     * ---------------------------------------------------------
     * CLOSED QUESTIONS
     * ---------------------------------------------------------
     */
    if (
      /^(so|are|is|do|did|will|jadi|apakah|benarkah|dus|is het|klopt)\b/.test(
        t
      )
    ) {
      ev.closedQuestions++;
    }

    /**
     * ---------------------------------------------------------
     * SPECIFICITY EVIDENCE
     * ---------------------------------------------------------
     */
    ev.personOrRole += specific[0] ? 1 : 0;
    ev.timeOrPlace += specific[1] ? 1 : 0;
    ev.observableBehavior += specific[2] ? 1 : 0;
    ev.concreteDetails += level;

    /**
     * ---------------------------------------------------------
     * EMPATHY
     * ---------------------------------------------------------
     *
     * Centralized language-specific keyword matching.
     */
    ev.empathySignals += empathyMatches.length;

    /**
     * ---------------------------------------------------------
     * PATTERN EVIDENCE
     * ---------------------------------------------------------
     *
     * Instead of directly accessing:
     *
     * PATTERN_KEYWORDS[language].generalization
     * PATTERN_KEYWORDS[language].judgment
     * PATTERN_KEYWORDS[language].assumption
     *
     * we use the same curriculum pattern engine that powers
     * analyzeMindset().
     *
     * This avoids PatternType/property mismatch errors while
     * keeping pattern detection centralized.
     */
    const patternEvidence = detectPatternEvidence(
      t,
      language
    );

    ev.generalizationSignals += patternEvidence.generalization;
    ev.judgmentSignals += patternEvidence.judgment;
    ev.assumptionSignals += patternEvidence.assumption;

    /**
     * ---------------------------------------------------------
     * PROGRESSION
     * ---------------------------------------------------------
     *
     * Detect whether the participant moves toward more specific
     * information compared with the previous turn.
     */
    if (level > priorSpecificity && index > 0) {
      ev.broadToSpecific++;
    }

    priorSpecificity = Math.max(
      priorSpecificity,
      level
    );
  });

  /**
   * ---------------------------------------------------------
   * NORMALIZED PROGRESSION
   * ---------------------------------------------------------
   */
  const opportunities = Math.max(
    turns.length - 1,
    1
  );

  ev.progression =
    clampScore(
      (ev.broadToSpecific / opportunities) * 100
    ) / 100;

  /**
   * ---------------------------------------------------------
   * HUMAN-READABLE HIGHLIGHTS
   * ---------------------------------------------------------
   */

  if (ev.personOrRole) {
    ev.highlights.push(
      tx(
        language,
        'You made a person or role explicit.',
        'Anda memperjelas orang atau peran yang terlibat.',
        'Je maakte een persoon of rol expliciet.'
      )
    );
  }

  if (ev.timeOrPlace) {
    ev.highlights.push(
      tx(
        language,
        'You anchored the conversation in a time or situation.',
        'Anda mengaitkan percakapan dengan waktu atau situasi tertentu.',
        'Je verankerde het gesprek in een tijd of situatie.'
      )
    );
  }

  if (ev.observableBehavior) {
    ev.highlights.push(
      tx(
        language,
        'You moved toward observable behavior.',
        'Anda mengarahkan percakapan ke perilaku yang dapat diamati.',
        'Je ging richting waarneembaar gedrag.'
      )
    );
  }

  if (ev.clarifyingQuestions) {
    ev.highlights.push(
      tx(
        language,
        'You asked clarifying questions to explore the situation.',
        'Anda mengajukan pertanyaan klarifikasi untuk menggali situasi.',
        'Je stelde verhelderende vragen om de situatie te onderzoeken.'
      )
    );
  }

  if (ev.empathySignals) {
    ev.highlights.push(
      tx(
        language,
        'You acknowledged the other person’s perspective or experience.',
        'Anda menunjukkan bahwa Anda memahami perspektif atau pengalaman lawan bicara.',
        'Je erkende het perspectief of de ervaring van de ander.'
      )
    );
  }

  if (ev.generalizationSignals) {
    ev.highlights.push(
      tx(
        language,
        'You used a broad or generalized statement that could be explored further.',
        'Anda menggunakan pernyataan umum yang masih bisa digali lebih lanjut.',
        'Je gebruikte een brede of algemene uitspraak die verder onderzocht kan worden.'
      )
    );
  }

  if (ev.judgmentSignals) {
    ev.highlights.push(
      tx(
        language,
        'You used language that may label or judge the other person.',
        'Anda menggunakan bahasa yang dapat memberi label atau menilai orang lain.',
        'Je gebruikte taal die de ander kan labelen of beoordelen.'
      )
    );
  }

  if (ev.assumptionSignals) {
    ev.highlights.push(
      tx(
        language,
        'You made an assumption about what the other person thinks, wants, or feels.',
        'Anda membuat asumsi tentang apa yang dipikirkan, diinginkan, atau dirasakan orang lain.',
        'Je maakte een aanname over wat de ander denkt, wil of voelt.'
      )
    );
  }

  return ev;
}

/**
 * Detect communication pattern evidence for scoring.
 *
 * The curriculum module remains the source of truth for which
 * patterns are enabled and which keywords belong to each type.
 */
function detectPatternEvidence(
  text: string,
  language: Language
): {
  generalization: number;
  judgment: number;
  assumption: number;
} {
  const result = {
    generalization: 0,
    judgment: 0,
    assumption: 0,
  };

  /**
   * Use the default curriculum's pattern configuration.
   * This is the same configuration consumed by analyzeMindset().
   */
  const module = getCurriculumModule(null);

  const patternRules = module.patternRules;
  const keywordGroups = patternRules.keywordGroups[language];

  patternRules.rules.forEach((type) => {
    const keywords = keywordGroups[type];

    if (!keywords || keywords.length === 0) {
      return;
    }

    const matches = findMatchedKeywords(
      text,
      keywords
    );

    if (type === 'generalization') {
      result.generalization += matches.length;
    }

    if (type === 'judgment') {
      result.judgment += matches.length;
    }

    if (type === 'assumption') {
      result.assumption += matches.length;
    }
  });

  return result;
}

/**
 * Localized helper used by communication feedback.
 */
function tx(
  language: Language,
  en: string,
  id: string,
  nl: string
): string {
  return language === 'id'
    ? id
    : language === 'nl'
      ? nl
      : en;
}

/**
 * Clamp a score to the valid 0–100 range.
 */
const clampScore = (value: number): number =>
  Math.max(
    0,
    Math.min(100, value)
  );