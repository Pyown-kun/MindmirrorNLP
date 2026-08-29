import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Step, TrainingSession } from '../types/training';
import { createEmptySession } from '../types/training';
import { useLanguage } from './LanguageContext';

const STEP_ORDER: Step[] = [
  'welcome',
  'name',
  'training-selection',
  'situation',
  'mirror',
  'initial-thought',
  'analysis',
  'reframe',
  'perspective-shift',
  'roleplay',
  'analyzing',
  'result',
  'result-details',
  'nlp-insights',
  'before-after',
  'complete',
];

interface TrainingContextValue {
  step: Step;
  session: TrainingSession;
  goTo: (step: Step) => void;
  next: () => void;
  updateSession: (patch: Partial<TrainingSession>) => void;
  resetSession: (keepLanguage?: boolean) => void;
}

const TrainingContext = createContext<TrainingContextValue | undefined>(undefined);

export const TrainingProvider = ({ children }: { children: ReactNode }) => {
  const { language } = useLanguage();
  const [step, setStep] = useState<Step>('welcome');
  const [session, setSession] = useState<TrainingSession>(() => ({
    ...createEmptySession(),
    language,
  }));

  const value = useMemo<TrainingContextValue>(
    () => ({
      step,
      session,
      goTo: (s: Step) => {
        setStep(s);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      next: () => {
        const idx = STEP_ORDER.indexOf(step);
        const nextStep = STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)];
        setStep(nextStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      updateSession: (patch: Partial<TrainingSession>) => {
        setSession((prev) => ({ ...prev, ...patch }));
      },
      resetSession: () => {
        setSession({ ...createEmptySession(), language });
        setStep('welcome');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    }),
    [step, session, language]
  );

  return <TrainingContext.Provider value={value}>{children}</TrainingContext.Provider>;
};

export const useTraining = (): TrainingContextValue => {
  const ctx = useContext(TrainingContext);
  if (!ctx) throw new Error('useTraining must be used within a TrainingProvider');
  return ctx;
};

export { STEP_ORDER };
