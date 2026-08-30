// Core domain types for MindMirror

export type Language = 'en' | 'id' | 'nl';
export type TrainingType = 'feedback' | 'conflict' | 'leadership';
export type Emotion = 'frustrated' | 'worried' | 'neutral' | 'positive';
export type PatternType = 'generalization' | 'judgment' | 'assumption';
export type CurriculumStatus = 'draft' | 'published';

export type Step =
  | 'welcome' | 'name' | 'training-selection' | 'module-intro'
  | 'mirror' | 'roleplay' | 'look-back' | 'reflection'
  | 'aha' | 'takeaway' | 'analyzing' | 'result-details' | 'complete';

export interface LocalizedText { en: string; id: string; nl: string; }
export interface LocalizedList { en: string[]; id: string[]; nl: string[]; }

export interface CurriculumCharacter {
  name: LocalizedText;
  role: LocalizedText;
}

export interface CurriculumStage {
  prompt: LocalizedText;
  expectedInteractionTypes: Array<'clarify' | 'empathy' | 'specific' | 'reflect'>;
  replies: {
    clarify: LocalizedText;
    empathy: LocalizedText;
    specific: LocalizedText;
    fallback: LocalizedText;
  };
}

export interface CurriculumModule {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  learningObjective: LocalizedText;
  category: LocalizedText;
  difficulty: LocalizedText;
  estimatedDuration: number;
  available: boolean;
  scenario: {
    title: LocalizedText;
    context: LocalizedText;
    characters: CurriculumCharacter[];
    openingMessage: LocalizedText;
  };
  interaction: {
    stages: CurriculumStage[];
    prompts: LocalizedList;
    expectedInteractionTypes: Array<'clarify' | 'empathy' | 'specific' | 'reflect'>;
  };
  patternRules: {
    rules: PatternType[];
    keywordGroups: Record<Language, Record<PatternType, string[]>>;
    detectionLogic: 'keyword' | 'hybrid';
  };
  reflection: {
    questions: LocalizedList;
    comparisonPrompts: LocalizedList;
  };
  ahaMoment: {
    title: LocalizedText;
    trigger: LocalizedText;
    userPrompt: LocalizedText;
    systemInsight: LocalizedText;
  };
  takeaway: {
    title: LocalizedText;
    practicalChallenge: LocalizedText;
    realWorldPrompt: LocalizedText;
  };
}

export interface DetectedPattern { type: PatternType; matchedText: string; sourceSentence: string; }
export interface AnalysisInput { text: string; language: Language; moduleId?: string; }
export interface AnalysisResult { patterns: DetectedPattern[]; isClean: boolean; }
export type MessageSpeaker = 'user' | 'character';
export interface RoleplayMessage { id: string; speaker: MessageSpeaker; text: string; timestamp: number; }
export interface ScenarioContext { characterName: string; characterRole: string; situation: string; language: Language; stage: number; moduleId?: string; }
export interface ConversationEvidence {
  broadToSpecific: number;
  concreteDetails: number;
  personOrRole: number;
  timeOrPlace: number;
  observableBehavior: number;
  clarifyingQuestions: number;
  openQuestions: number;
  closedQuestions: number;
  empathySignals: number;
  judgmentSignals: number;
  assumptionSignals: number;
  generalizationSignals: number;
  progression: number;
  highlights: string[];
}

export interface CommunicationAnalysis {
  empathy: number;
  specificity: number;
  clarity: number;
  nlpPractice: number;
  selfAwareness: number;
  overall: number;
  evidence?: ConversationEvidence;
}
export interface Insight { kind: 'strength' | 'improvement' | 'metaModel'; title: string; body: string; }

export interface TrainingSession {
  userName: string; language: Language; trainingType: TrainingType | null; moduleId: string | null;
  person: string; situation: string; emotion: Emotion | null; initialThought: string;
  analysisResult: AnalysisResult | null; positivePerspective: string; roleplayMessages: RoleplayMessage[];
  reflectionAnswer: string; reflectionChoice: string; ahaReflection: string;
  communicationScores: CommunicationAnalysis | null; insights: Insight[];
}

export const createEmptySession = (): TrainingSession => ({
  userName: '', language: 'en', trainingType: null, moduleId: null, person: '', situation: '', emotion: null,
  initialThought: '', analysisResult: null, positivePerspective: '', roleplayMessages: [], reflectionAnswer: '',
  reflectionChoice: '', ahaReflection: '', communicationScores: null, insights: [],
});
