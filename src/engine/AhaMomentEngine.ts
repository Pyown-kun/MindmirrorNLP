import type { CurriculumModule, TrainingSession } from '../types/training';
import { inspectLanguage } from './ExperienceEngine';

export class AhaMomentEngine {
  static create(module: CurriculumModule, session: TrainingSession) {
    const userTurns = session.roleplayMessages.filter(m => m.speaker === 'user');
    const initial = userTurns[0]?.text ?? '';
    const later = userTurns[userTurns.length - 1]?.text ?? '';
    const first = inspectLanguage(initial);
    const last = inspectLanguage(later);
    const moves = [
      last.personOrRole && !first.personOrRole,
      last.timeOrPlace && !first.timeOrPlace,
      last.observable && !first.observable,
      last.clarifying && !first.clarifying,
    ].filter(Boolean).length;
    const progression = moves > 0 || userTurns.length > 1;
    const evidence: string[] = [];
    const labels = (key: string) => {
      const map: Record<string, [string,string,string]> = {
        person: ['person/role', 'orang/peran', 'persoon/rol'],
        situation: ['time/situation', 'waktu/situasi', 'tijd/situatie'],
        behavior: ['observable behavior', 'perilaku yang dapat diamati', 'waarneembaar gedrag'],
        question: ['clarifying question', 'pertanyaan klarifikasi', 'verduidelijkende vraag'],
      };
      const v = map[key]; return v ? v[session.language === 'id' ? 1 : session.language === 'nl' ? 2 : 0] : key;
    };
    if (last.personOrRole) evidence.push(labels('person'));
    if (last.timeOrPlace) evidence.push(labels('situation'));
    if (last.observable) evidence.push(labels('behavior'));
    if (last.clarifying) evidence.push(labels('question'));
    return { initial, later, specific: progression, moves, evidence, prompt: module.ahaMoment.userPrompt, insight: module.ahaMoment.systemInsight };
  }
}
