import { CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';

export const TrainingComplete = () => {
  const { t } = useLanguage();
  const { resetSession, goTo } = useTraining();

  const skills = [t.complete.skill1, t.complete.skill2, t.complete.skill3, t.complete.skill4, t.complete.skill5];

  const trainAgain = () => {
    resetSession();
    goTo('training-selection');
  };

  return (
    <PageShell>
      <MirrorPane className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-aqua/15">
          <CheckCircle2 className="h-8 w-8 text-aqua" />
        </div>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{t.complete.heading}</h2>

        <div className="mt-6 text-left">
          <p className="mb-2 text-xs font-bold tracking-wide text-muted">{t.complete.skillsHeading}</p>
          <ul className="space-y-2">
            {skills.map((skill) => (
              <li key={skill} className="flex items-center gap-2 text-sm text-ink">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-aqua" />
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-2xl bg-primary/5 p-5 text-left">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-wide text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {t.complete.challengeHeading}
          </p>
          <p className="text-sm text-ink leading-relaxed">{t.complete.challengeBody}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="secondary" onClick={trainAgain}>
            <RotateCcw className="h-4 w-4" />
            {t.common.trainAgain}
          </Button>
          <Button onClick={() => resetSession()}>{t.common.startNewSession}</Button>
        </div>
      </MirrorPane>
    </PageShell>
  );
};
