import { ArrowRight } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { ScoreCard } from '../components/ScoreCard';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';

export const TrainingResult = () => {
  const { t } = useLanguage();
  const { session, next } = useTraining();
  const overall = session.communicationScores?.overall ?? 0;

  return (
    <PageShell>
      <MirrorPane className="text-center">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          {t.result.heading(session.userName || t.common.you)}
        </h2>
        <p className="mt-1 text-sm font-medium text-muted">{t.result.subheading}</p>

        <div className="mt-6 flex justify-center">
          <ScoreCard score={overall} label={t.result.scoreLabel} />
        </div>

        <div className="mt-8">
          <Button onClick={next} fullWidth className="sm:w-auto sm:px-10">
            {t.result.viewDetails}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </MirrorPane>
    </PageShell>
  );
};
