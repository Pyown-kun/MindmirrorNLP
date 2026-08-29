import { ArrowRight } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ProgressBar';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';

export const ResultDetails = () => {
  const { t } = useLanguage();
  const { session, next } = useTraining();
  const scores = session.communicationScores;

  return (
    <PageShell>
      <MirrorPane>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{t.resultDetails.heading}</h2>

        <div className="mt-6 space-y-5">
          <ProgressBar icon="🤝" label={t.resultDetails.empathy} value={scores?.empathy ?? 0} color="var(--color-primary)" />
          <ProgressBar icon="🎯" label={t.resultDetails.specificity} value={scores?.specificity ?? 0} color="var(--color-aqua)" />
          <ProgressBar icon="💬" label={t.resultDetails.clarity} value={scores?.clarity ?? 0} color="var(--color-amber)" />
          <ProgressBar icon="🧠" label={t.resultDetails.nlpPractice} value={scores?.nlpPractice ?? 0} color="var(--color-primary-dark)" />
          <ProgressBar icon="🪞" label={t.resultDetails.selfAwareness} value={scores?.selfAwareness ?? 0} color="var(--color-rose)" />
        </div>

        <div className="mt-8">
          <Button onClick={next} fullWidth className="sm:w-auto sm:px-10">
            {t.resultDetails.continueToInsights}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </MirrorPane>
    </PageShell>
  );
};
