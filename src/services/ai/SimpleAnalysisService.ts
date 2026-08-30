
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
  analyzeConversation(
    messages: RoleplayMessage[],
    language: Language
  ): CommunicationAnalysis {
    const userMessages = messages.filter(
      (message) => message.speaker === 'user'
    );

    const userText = userMessages
      .map((message) => message.text)
      .join(' ');

    /**
     * Avoid division by zero when there are no user messages.
     */
    const totalUserMessages = Math.max(userMessages.length, 1);

    // ---------------------------------------------------------
    // EMPATHY
    // ---------------------------------------------------------

    const empathyHits = userMessages.filter(
      (message) =>
        findMatchedKeywords(
          message.text,
          EMPATHY_KEYWORDS[language]
        ).length > 0
    ).length;

    const empathy = clampScore(
      40 + (empathyHits / totalUserMessages) * 60
    );

    // ---------------------------------------------------------
    // SPECIFICITY
    // ---------------------------------------------------------

    const clarifyingHits = userMessages.filter(
      (message) =>
        findMatchedKeywords(
          message.text,
          CLARIFYING_KEYWORDS[language]
        ).length > 0
    ).length;

    const generalizationHits = findMatchedKeywords(
      userText,
      PATTERN_KEYWORDS[language].generalization
    ).length;

    const specificity = clampScore(
      35 +
        (clarifyingHits / totalUserMessages) * 55 -
        generalizationHits * 8
    );

    // ---------------------------------------------------------
    // CLARITY
    // ---------------------------------------------------------

    const sentences = splitSentences(userText);

    const avgLength =
      sentences.length > 0
        ? sentences.reduce(
            (sum, sentence) =>
              sum + countWords(sentence),
            0
          ) / sentences.length
        : 0;

    const questionCount = userMessages.filter(
      (message) => message.text.trim().endsWith('?')
    ).length;

    let clarity = 50;

    if (avgLength > 0) {
      /**
       * Ideal sentence length:
       * approximately 5–18 words.
       *
       * 11 words is treated as the center point.
       */
      const distanceFromIdeal = Math.min(
        Math.abs(avgLength - 11),
        15
      );

      clarity +=
        (15 - distanceFromIdeal) * 2.2;
    }

    /**
     * Asking questions is treated as a positive indicator
     * of conversational clarity.
     */
    clarity += Math.min(questionCount * 5, 20);

    clarity = clampScore(clarity);

    // ---------------------------------------------------------
    // NLP PRACTICE
    // ---------------------------------------------------------

    const judgmentHits = findMatchedKeywords(
      userText,
      PATTERN_KEYWORDS[language].judgment
    ).length;

    const assumptionHits = findMatchedKeywords(
      userText,
      PATTERN_KEYWORDS[language].assumption
    ).length;

    const nlpPractice = clampScore(
      55 +
        questionCount * 6 -
        judgmentHits * 12 -
        generalizationHits * 8 -
        assumptionHits * 8
    );

    // ---------------------------------------------------------
    // SELF-AWARENESS
    // ---------------------------------------------------------

    /**
     * Self-awareness is estimated from conversational
     * behaviors such as empathy and clarification.
     */
    const selfAwareness = clampScore(
      50 +
        empathyHits * 8 +
        clarifyingHits * 6
    );

    // ---------------------------------------------------------
    // OVERALL SCORE
    // ---------------------------------------------------------

    const overall = Math.round(
      empathy * 0.25 +
        specificity * 0.25 +
        clarity * 0.2 +
        nlpPractice * 0.2 +
        selfAwareness * 0.1
    );

    return {
      empathy: Math.round(empathy),
      specificity: Math.round(specificity),
      clarity: Math.round(clarity),
      nlpPractice: Math.round(nlpPractice),
      selfAwareness: Math.round(selfAwareness),
      overall,
    };
  }
}

/**
 * Count words safely.
 */
const countWords = (text: string): number => {
  const normalized = text.trim();

  if (!normalized) {
    return 0;
  }

  return normalized.split(/\s+/).length;
};

/**
 * Clamp a score to the valid 0–100 range.
 */
const clampScore = (value: number): number =>
  Math.max(0, Math.min(100, value));