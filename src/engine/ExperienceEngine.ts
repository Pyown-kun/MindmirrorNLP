import type { CurriculumModule, RoleplayMessage, Language } from '../types/training';
import { CLARIFYING_KEYWORDS, EMPATHY_KEYWORDS, findMatchedKeywords } from '../utils/analysisRules';
import { localize } from '../curriculum/modules';

export class ExperienceEngine {
  constructor(private readonly module: CurriculumModule) {}

  opening(language: Language): RoleplayMessage {
    return { id: this.id(), speaker: 'character', text: localize(this.module.scenario.openingMessage, language), timestamp: Date.now() };
  }

  respond(language: Language, messages: RoleplayMessage[], stageIndex: number): RoleplayMessage {
    const stage = this.module.interaction.stages[Math.min(stageIndex, this.module.interaction.stages.length - 1)];
    const last = [...messages].reverse().find((m) => m.speaker === 'user')?.text ?? '';
    const clarify = findMatchedKeywords(last, CLARIFYING_KEYWORDS[language]).length > 0;
    const empathy = findMatchedKeywords(last, EMPATHY_KEYWORDS[language]).length > 0;
    const specific = last.trim().endsWith('?') && last.trim().length > 18;
    const key = specific ? 'specific' : clarify ? 'clarify' : empathy ? 'empathy' : 'fallback';
    return { id: this.id(), speaker: 'character', text: localize(stage.replies[key], language), timestamp: Date.now() };
  }

  private id() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
}
