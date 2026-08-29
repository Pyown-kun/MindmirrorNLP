import { useState } from 'react';
import { MessageSquareWarning, Swords, Crown } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { TrainingCard } from '../components/TrainingCard';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';
import type { TrainingType } from '../types/training';

export const TrainingSelection = () => {
  const { t } = useLanguage();
  const { updateSession, next } = useTraining();
  const [note, setNote] = useState(false);

  const choose = (type: TrainingType) => {
    if (type !== 'feedback') {
      setNote(true);
      return;
    }
    setNote(false);
    updateSession({ trainingType: type });
    next();
  };

  return (
    <PageShell wide>
      <MirrorPane>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{t.trainingSelection.heading}</h2>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TrainingCard
            icon={MessageSquareWarning}
            title={t.trainingSelection.feedbackTitle}
            description={t.trainingSelection.feedbackDesc}
            onClick={() => choose('feedback')}
          />
          <TrainingCard
            icon={Swords}
            title={t.trainingSelection.conflictTitle}
            description={t.trainingSelection.conflictDesc}
            disabled
            disabledLabel={t.common.comingSoon}
            onClick={() => choose('conflict')}
          />
          <TrainingCard
            icon={Crown}
            title={t.trainingSelection.leadershipTitle}
            description={t.trainingSelection.leadershipDesc}
            disabled
            disabledLabel={t.common.comingSoon}
            onClick={() => choose('leadership')}
          />
        </div>

        {note && (
          <p className="mt-5 rounded-2xl bg-amber/10 px-5 py-4 text-sm text-amber">
            {t.trainingSelection.comingSoonNote}
          </p>
        )}
      </MirrorPane>
    </PageShell>
  );
};
