import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';
import type { Emotion } from '../types/training';

const EMOTIONS: { key: Emotion; emoji: string }[] = [
  { key: 'frustrated', emoji: '😡' },
  { key: 'worried', emoji: '😟' },
  { key: 'neutral', emoji: '😐' },
  { key: 'positive', emoji: '😊' },
];

export const MirrorPhase = () => {
  const { t } = useLanguage();
  const { updateSession, next } = useTraining();

  const choose = (emotion: Emotion) => {
    updateSession({ emotion });
    next();
  };

  return (
    <PageShell>
      <MirrorPane>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t.mirror.heading}</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">{t.mirror.question}</h2>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {EMOTIONS.map(({ key, emoji }) => (
            <button
              key={key}
              onClick={() => choose(key)}
              className="flex flex-col items-center gap-2 rounded-2xl border border-ink/10 bg-white px-3 py-6 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 active:translate-y-0"
            >
              <span className="text-4xl">{emoji}</span>
              <span className="text-sm font-medium text-ink">{t.mirror[key]}</span>
            </button>
          ))}
        </div>
      </MirrorPane>
    </PageShell>
  );
};
