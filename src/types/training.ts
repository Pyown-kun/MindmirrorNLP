// Core domain types for MindMirror

export type Language = 'en' | 'id' | 'nl';

export type TrainingType = 'feedback' | 'conflict' | 'leadership';

export type Emotion = 'frustrated' | 'worried' | 'neutral' | 'positive';

export type Step =
  | 'welcome'
  | 'name'
  | 'training-selection'
  | 'situation'
  | 'mirror'
  | 'initial-thought'
  | 'analysis'
  | 'reframe'
  | 'perspective-shift'
  | 'roleplay'
  | 'analyzing'
  | 'result'
  | 'result-details'
  | 'nlp-insights'
  | 'before-after'
  | 'complete';

export type PatternType = 'generalization' | 'judgment' | 'assumption';

export interface DetectedPattern {
  type: PatternType;
  matchedText: string;
  sourceSentence: string;
}

export interface AnalysisInput {
  text: string;
  language: Language;
}

export interface AnalysisResult {
  patterns: DetectedPattern[];
  isClean: boolean;
}

export type MessageSpeaker = 'user' | 'character';

export interface RoleplayMessage {
  id: string;
  speaker: MessageSpeaker;
  text: string;
  timestamp: number;
}

export interface ScenarioContext {
  characterName: string;
  characterRole: string;
  situation: string;
  language: Language;
  stage: number;
}

export interface CommunicationAnalysis {
  empathy: number;
  specificity: number;
  clarity: number;
  nlpPractice: number;
  selfAwareness: number;
  overall: number;
}

export interface Insight {
  kind: 'strength' | 'improvement' | 'metaModel';
  title: string;
  body: string;
}

export interface TrainingSession {
  userName: string;
  language: Language;
  trainingType: TrainingType | null;
  person: string;
  situation: string;
  emotion: Emotion | null;
  initialThought: string;
  analysisResult: AnalysisResult | null;
  positivePerspective: string;
  roleplayMessages: RoleplayMessage[];
  communicationScores: CommunicationAnalysis | null;
  insights: Insight[];
}

export const createEmptySession = (): TrainingSession => ({
  userName: '',
  language: 'en',
  trainingType: null,
  person: '',
  situation: '',
  emotion: null,
  initialThought: '',
  analysisResult: null,
  positivePerspective: '',
  roleplayMessages: [],
  communicationScores: null,
  insights: [],
});
