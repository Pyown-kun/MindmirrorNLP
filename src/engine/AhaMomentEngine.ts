import type { CurriculumModule, TrainingSession } from '../types/training';

export class AhaMomentEngine {
  static create(module: CurriculumModule, session: TrainingSession) {
    const userTurns = session.roleplayMessages.filter((m) => m.speaker === 'user');
    const initial = userTurns[0]?.text ?? ''; 
    const later = userTurns[userTurns.length - 1]?.text ?? '';
    const specific = /\?|\b(what|when|which|how|apa|kapan|mana|bagaimana|wat|wanneer|welk|hoe)\b/i.test(later);
    return { initial, later, specific, prompt: module.ahaMoment.userPrompt, insight: module.ahaMoment.systemInsight };
  }
}
