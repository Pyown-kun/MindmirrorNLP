import type { CurriculumModule, RoleplayMessage } from '../types/training';

export class ReflectionEngine {
  static compare(module: CurriculumModule, messages: RoleplayMessage[]) {
    const userMessages = messages.filter((m) => m.speaker === 'user');
    const firstResponse = userMessages[0]?.text ?? '';
    const lastResponse = userMessages[userMessages.length - 1]?.text ?? firstResponse;
    return { firstResponse, lastResponse, userTurnCount: userMessages.length, prompts: module.reflection.comparisonPrompts };
  }
}
