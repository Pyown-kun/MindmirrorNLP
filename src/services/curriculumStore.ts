import type { CurriculumModule, Language, LocalizedList, LocalizedText, PatternType } from '../types/training';
import { curriculumModules } from '../curriculum/modules';

export type CurriculumStatus = 'draft' | 'published';
export type ManagedCurriculum = CurriculumModule & { status: CurriculumStatus; updatedAt: string; isCustom?: boolean };

const STORAGE_KEY = 'mindmirror-curriculum-v1';
const PARTICIPANT_KEY = 'mindmirror-participants-v1';

const seedManaged = (): ManagedCurriculum[] => curriculumModules.map((module) => ({
  ...module,
  status: module.available ? 'published' : 'draft',
  updatedAt: new Date().toISOString(),
}));

const read = (): ManagedCurriculum[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedManaged();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as ManagedCurriculum[];
  } catch {
    return seedManaged();
  }
};

export const getManagedModules = () => read();
export const getPublishedModules = () => read().filter((module) => module.status === 'published' && module.available);
export const saveManagedModules = (modules: ManagedCurriculum[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(modules));
export const upsertManagedModule = (module: CurriculumModule, status: CurriculumStatus) => {
  const modules = read();
  const next: ManagedCurriculum = { ...module, status, available: status === 'published', updatedAt: new Date().toISOString(), isCustom: !curriculumModules.some((item) => item.id === module.id) };
  saveManagedModules(modules.some((item) => item.id === module.id) ? modules.map((item) => item.id === module.id ? next : item) : [...modules, next]);
};
export const deleteManagedModule = (id: string) => saveManagedModules(read().filter((module) => module.id !== id));
export const getParticipantCount = () => Number(localStorage.getItem(PARTICIPANT_KEY) || '128');

export const emptyLocalizedText = (): LocalizedText => ({ en: '', id: '', nl: '' });
export const emptyLocalizedList = (): LocalizedList => ({ en: [], id: [], nl: [] });

export const createBlankModule = (): CurriculumModule => ({
  id: `module-${Date.now()}`,
  title: emptyLocalizedText(), description: emptyLocalizedText(), learningObjective: emptyLocalizedText(),
  category: emptyLocalizedText(), difficulty: { en: 'Beginner', id: 'Pemula', nl: 'Beginner' }, estimatedDuration: 10, available: false,
  scenario: { title: emptyLocalizedText(), context: emptyLocalizedText(), characters: [{ name: emptyLocalizedText(), role: emptyLocalizedText() }], openingMessage: emptyLocalizedText() },
  interaction: { stages: [], prompts: emptyLocalizedList(), expectedInteractionTypes: ['clarify', 'specific'] },
  patternRules: { rules: ['generalization'], keywordGroups: { en: { generalization: [], judgment: [], assumption: [] }, id: { generalization: [], judgment: [], assumption: [] }, nl: { generalization: [], judgment: [], assumption: [] } }, detectionLogic: 'hybrid' },
  reflection: { questions: emptyLocalizedList(), comparisonPrompts: emptyLocalizedList() },
  ahaMoment: { title: emptyLocalizedText(), trigger: emptyLocalizedText(), userPrompt: emptyLocalizedText(), systemInsight: emptyLocalizedText() },
  takeaway: { title: emptyLocalizedText(), practicalChallenge: emptyLocalizedText(), realWorldPrompt: emptyLocalizedText() },
});

export const cloneModule = (module: CurriculumModule): CurriculumModule => JSON.parse(JSON.stringify(module)) as CurriculumModule;

export const addParticipant = () => localStorage.setItem(PARTICIPANT_KEY, String(getParticipantCount() + 1));

export const languageLabels: Record<Language, string> = { en: 'English', id: 'Indonesia', nl: 'Nederlands' };
export const patternLabels: Record<PatternType, string> = { generalization: 'Generalization', judgment: 'Judgment', assumption: 'Assumption' };
