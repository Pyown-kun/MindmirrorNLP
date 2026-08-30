import { Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { Step } from '../types/training';

const STAGE_STEPS: Step[] = ['name','training-selection','module-intro','mirror','roleplay','look-back','reflection','aha','takeaway','analyzing','result-details','complete'];

/** Maps every fine-grained step to one of the 5 headline stages shown in the stepper. */
const stageOf = (step: Step): number => {
  if (['name','training-selection','module-intro','mirror'].includes(step)) return 0;
  if (['roleplay'].includes(step)) return 1;
  if (['look-back','reflection'].includes(step)) return 2;
  if (['aha','takeaway'].includes(step)) return 3;
  return 4;
};

interface ProgressStepperProps {
  step: Step;
}

export const ProgressStepper = ({ step }: ProgressStepperProps) => {
  const { t } = useLanguage();

  if (!STAGE_STEPS.includes(step)) return null;

  const labels = [t.stepper.experience, t.stepper.interaction, t.stepper.lookBack, t.stepper.aha, t.stepper.insights];
  const currentStage = stageOf(step);

  return (
    <nav aria-label="Training progress" className="w-full">
      {/* Desktop horizontal stepper */}
      <ol className="hidden sm:flex items-center justify-center gap-2">
        {labels.map((label, i) => {
          const state = i < currentStage ? 'done' : i === currentStage ? 'current' : 'upcoming';
          return (
            <li key={label} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    state === 'done'
                      ? 'bg-aqua text-white'
                      : state === 'current'
                        ? 'bg-primary text-white'
                        : 'bg-ink/10 text-muted'
                  }`}
                >
                  {state === 'done' ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={`text-sm font-medium ${
                    state === 'upcoming' ? 'text-muted' : 'text-ink'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < labels.length - 1 && <span className="mx-1 h-px w-8 bg-ink/10" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>

      {/* Mobile compact indicator */}
      <div className="flex sm:hidden items-center justify-center gap-2">
        {labels.map((label, i) => (
          <span
            key={label}
            className={`h-1.5 rounded-full transition-all ${
              i === currentStage ? 'w-6 bg-primary' : i < currentStage ? 'w-1.5 bg-aqua' : 'w-1.5 bg-ink/15'
            }`}
            aria-current={i === currentStage ? 'step' : undefined}
            aria-label={label}
          />
        ))}
      </div>
    </nav>
  );
};
