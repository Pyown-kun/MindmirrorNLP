import type {
  AnalysisInput,
  AnalysisResult,
  CommunicationAnalysis,
  DetectedPattern,
  Language,
  PatternType,
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
 * A transparent, rule-based implementation of AIAnalysisService.
 * No external API or model is required — everything is keyword
 * matching and simple heuristics, so the demo works fully offline.
 */
export class SimpleAnalysisService implements AIAnalysisService {
  analyzeMindset(input: AnalysisInput): AnalysisResult {
    const { text, language } = input;
    const sentences = splitSentences(text);
    const patterns: DetectedPattern[] = [];
    const moduleRules = getCurriculumModule(input.moduleId ?? null).patternRules.keywordGroups[language];
    const keywordSet = moduleRules;

    getCurriculumModule(input.moduleId ?? null).patternRules.rules.forEach((type) => {
      const keywords = keywordSet[type];
      sentences.forEach((sentence) => {
        const matches = findMatchedKeywords(sentence, keywords);
        matches.forEach((matchedText) => {
          patterns.push({ type, matchedText, sourceSentence: sentence });
        });
      });

      // Fallback: if there were no sentence boundaries detected, scan whole text
      if (sentences.length === 0) {
        const matches = findMatchedKeywords(text, keywords);
        matches.forEach((matchedText) => {
          patterns.push({ type, matchedText, sourceSentence: text });
        });
      }
    });

    // De-duplicate identical (type, matchedText, sentence) triples
    const seen = new Set<string>();
    const deduped = patterns.filter((p) => {
      const key = `${p.type}|${p.matchedText}|${p.sourceSentence}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return {
      patterns: deduped,
      isClean: deduped.length === 0,
    };
  }

  generateReflection(input: { initialThought: string; messages: RoleplayMessage[]; language: Language }): string {
    const last = [...input.messages].reverse().find((m) => m.speaker === 'user')?.text ?? '';
    return `${input.initialThought} → ${last}`;
  }

  generateAhaMoment(input: { initialThought: string; laterResponse: string; language: Language }): string {
    return input.laterResponse.trim() ? `${input.initialThought} → ${input.laterResponse}` : input.initialThought;
  }

  generateTakeaway(input: { language: Language; moduleId?: string }): string {
    return getCurriculumModule(input.moduleId ?? null).takeaway.practicalChallenge[input.language];
  }

  analyzeConversation(messages: RoleplayMessage[], language: Language): CommunicationAnalysis {
    const userMessages = messages.filter((m) => m.speaker === 'user');
    const userText = userMessages.map((m) => m.text).join(' ');
    const totalUserMessages = Math.max(userMessages.length, 1);

    // --- Empathy: how many user turns contained empathy language ---
    const empathyHits = userMessages.filter(
      (m) => findMatchedKeywords(m.text, EMPATHY_KEYWORDS[language]).length > 0
    ).length;
    const empathy = clampScore(40 + (empathyHits / totalUserMessages) * 60);

    // --- Specificity: clarifying questions asked + avoidance of generalizations ---
    const clarifyingHits = userMessages.filter(
      (m) => findMatchedKeywords(m.text, CLARIFYING_KEYWORDS[language]).length > 0
    ).length;
    const generalizationHits = findMatchedKeywords(
      userText,
      PATTERN_KEYWORDS[language].generalization
    ).length;
    const specificity = clampScore(
      35 + (clarifyingHits / totalUserMessages) * 55 - generalizationHits * 8
    );

    // --- Clarity: heuristic on sentence length & question structure ---
    const sentences = splitSentences(userText);
    const avgLength =
      sentences.length > 0
        ? sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length
        : 0;
    const questionCount = userMessages.filter((m) => m.text.trim().endsWith('?')).length;
    let clarity = 50;
    if (avgLength > 0) {
      // Sweet spot: 5–18 words per sentence reads as clear, not clipped or rambling.
      const distanceFromIdeal = Math.min(Math.abs(avgLength - 11), 15);
      clarity += (15 - distanceFromIdeal) * 2.2;
    }
    clarity += Math.min(questionCount * 5, 20);
    clarity = clampScore(clarity);

    // --- NLP Practice: avoiding judgment/generalization + asking questions ---
    const judgmentHits = findMatchedKeywords(userText, PATTERN_KEYWORDS[language].judgment).length;
    const assumptionHits = findMatchedKeywords(userText, PATTERN_KEYWORDS[language].assumption).length;
    const nlpPractice = clampScore(
      55 + questionCount * 6 - judgmentHits * 12 - generalizationHits * 8 - assumptionHits * 8
    );

    // --- Self-Awareness: rewarded elsewhere (reflection/reframe steps) but here
    // we account for conversational signs of reflection (e.g. empathy + questions) ---
    const selfAwareness = clampScore(50 + empathyHits * 8 + clarifyingHits * 6);

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

const clampScore = (value: number): number => Math.max(0, Math.min(100, value));
