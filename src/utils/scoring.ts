import type { CommunicationAnalysis, TrainingSession } from '../types/training';

const clamp = (value: number): number => Math.max(0, Math.min(100, Math.round(value)));

/**
 * Blends the roleplay-derived CommunicationAnalysis with reflection/reframe
 * completion signals from earlier steps, producing the final scorecard.
 * Entirely rule-based and transparent — every input maps to a visible
 * step the user actually completed.
 */
export const computeFinalScores = (
  session: TrainingSession,
  conversationAnalysis: CommunicationAnalysis
): CommunicationAnalysis => {
  let selfAwareness = conversationAnalysis.selfAwareness;

  // Reflection completed after the roleplay.
  if (session.emotion && session.roleplayMessages.some((message) => message.speaker === 'user')) {
    selfAwareness += 10;
  }
  // Reframe completed with a meaningful positive perspective
  if (session.positivePerspective.trim().split(/\s+/).length >= 3) {
    selfAwareness += 15;
  }
  // Bonus if the initial thought contained a pattern AND the user still
  // completed the reframe — shows awareness of the shift, not just avoidance.
  if (session.analysisResult && !session.analysisResult.isClean && session.positivePerspective) {
    selfAwareness += 5;
  }

  selfAwareness = clamp(selfAwareness);

  const empathy = clamp(conversationAnalysis.empathy);
  const specificity = clamp(conversationAnalysis.specificity);
  const clarity = clamp(conversationAnalysis.clarity);
  const nlpPractice = clamp(conversationAnalysis.nlpPractice);

  const overall = clamp(
    empathy * 0.22 + specificity * 0.22 + clarity * 0.18 + nlpPractice * 0.18 + selfAwareness * 0.2
  );

  return { empathy, specificity, clarity, nlpPractice, selfAwareness, overall };
};

export interface InsightFlags {
  strongEmpathy: boolean;
  strongSpecificity: boolean;
  hadGeneralization: boolean;
  hadJudgment: boolean;
  hadAssumption: boolean;
  lowQuestionUse: boolean;
  cleanInitialThought: boolean;
}

/**
 * Determines which categories of insight apply, based purely on
 * measurable signals (scores + detected patterns). The actual copy for
 * each flag lives in the locale files so every language stays in sync.
 */
export const selectInsightFlags = (session: TrainingSession, scores: CommunicationAnalysis): InsightFlags => {
  const patterns = session.analysisResult?.patterns ?? [];
  return {
    strongEmpathy: scores.empathy >= 70,
    strongSpecificity: scores.specificity >= 70,
    hadGeneralization: patterns.some((p) => p.type === 'generalization'),
    hadJudgment: patterns.some((p) => p.type === 'judgment'),
    hadAssumption: patterns.some((p) => p.type === 'assumption'),
    lowQuestionUse: scores.specificity < 60,
    cleanInitialThought: session.analysisResult?.isClean ?? false,
  };
};
