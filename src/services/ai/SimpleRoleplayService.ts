import type { RoleplayMessage, ScenarioContext } from '../../types/training';
import type { RoleplayService } from './AIService';
import { CLARIFYING_KEYWORDS, EMPATHY_KEYWORDS, findMatchedKeywords } from '../../utils/analysisRules';
import { getCurriculum } from '../../curriculum';

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export class SimpleRoleplayService implements RoleplayService {
  private scenario(context: ScenarioContext) {
    const curriculum = getCurriculum(context.language, context.trainingType ?? 'feedback');
    return curriculum.scenarios.find((s) => s.id === context.scenarioId) ?? curriculum.scenarios[0];
  }

  startScenario(context: ScenarioContext): RoleplayMessage {
    const scenario = this.scenario(context);
    return { id: genId(), speaker: 'character', text: scenario.stages[0].opening, timestamp: Date.now() };
  }

  respond(context: ScenarioContext, messages: RoleplayMessage[]): RoleplayMessage {
    const scenario = this.scenario(context);
    const stages = scenario.stages;
    const stage = stages[Math.min(context.stage, stages.length - 1)];
    const lastUserMessage = [...messages].reverse().find((m) => m.speaker === 'user');
    const text = lastUserMessage?.text ?? '';
    const isClarifying = findMatchedKeywords(text, CLARIFYING_KEYWORDS[context.language]).length > 0;
    const isEmpathetic = findMatchedKeywords(text, EMPATHY_KEYWORDS[context.language]).length > 0;
    const isSpecificQuestion = text.trim().endsWith('?') && text.trim().length > 12;
    const reply = isSpecificQuestion && isClarifying ? stage.onSpecific : isEmpathetic ? stage.onEmpathy : isClarifying ? stage.onClarify : stage.fallback;
    return { id: genId(), speaker: 'character', text: reply, timestamp: Date.now() };
  }
}
