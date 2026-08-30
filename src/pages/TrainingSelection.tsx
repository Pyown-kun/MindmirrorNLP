import { useMemo, useState } from 'react';
import { MessageSquareWarning, Swords, Crown, Database, Sparkles } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { TrainingCard } from '../components/TrainingCard';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';
import { getCurriculum } from '../curriculum';
import type { TrainingType } from '../types/training';

const labels: Record<TrainingType, string> = { feedback: 'Feedback', conflict: 'Conflict', leadership: 'Leadership' };

export const TrainingSelection = () => {
  const { t, language } = useLanguage();
  const { updateSession, next } = useTraining();
  const [selected, setSelected] = useState<TrainingType>('feedback');
  const [scenarioIndex, setScenarioIndex] = useState(0);


  const curriculum = useMemo(() => getCurriculum(language, selected), [language, selected]);
  const scenario = curriculum.scenarios[scenarioIndex] ?? curriculum.scenarios[0];

  const choose = (type: TrainingType) => {
    setSelected(type);
    setScenarioIndex(0);

  };

  const start = () => {
    updateSession({ trainingType: selected, curriculumId: curriculum.id, scenarioId: scenario.id, situation: scenario.situation, person: scenario.characterName });
    next();
  };


  return (
    <PageShell wide>
      <MirrorPane>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Curriculum-ready demo</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">{t.trainingSelection.heading}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">The training engine is reusable; participant-facing content follows the selected language version.</p>
          </div>

        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TrainingCard icon={MessageSquareWarning} title={t.trainingSelection.feedbackTitle} description={t.trainingSelection.feedbackDesc} onClick={() => choose('feedback')} />
          <TrainingCard icon={Swords} title={t.trainingSelection.conflictTitle} description={t.trainingSelection.conflictDesc} onClick={() => choose('conflict')} />
          <TrainingCard icon={Crown} title={t.trainingSelection.leadershipTitle} description={t.trainingSelection.leadershipDesc} onClick={() => choose('leadership')} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-aqua/10 text-aqua"><Database className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Active curriculum</p>
                <h3 className="mt-1 font-display text-lg font-bold text-ink">{curriculum.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{curriculum.description}</p>
              </div>
              <span className="rounded-full bg-mist px-3 py-1 font-mono-num text-xs text-muted">v{curriculum.version}</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {curriculum.learningObjectives.map((objective) => <span key={objective} className="rounded-full border border-aqua/20 bg-aqua/5 px-3 py-1.5 text-xs font-medium text-ink">{objective}</span>)}
            </div>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-mist p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Scenario selected</p>
            <select value={scenario.id} onChange={(e) => setScenarioIndex(curriculum.scenarios.findIndex((s) => s.id === e.target.value))} className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-3 py-3 text-sm font-semibold text-ink">
              {curriculum.scenarios.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
            <p className="mt-3 text-sm leading-relaxed text-muted">{scenario.situation}</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-primary"><Sparkles className="h-3.5 w-3.5" /> Content can change without changing the training components.</div>
          </div>
        </div>

        <div className="mt-7"><Button onClick={start} fullWidth className="sm:w-auto sm:px-10">Start {labels[selected]} scenario</Button></div>
      </MirrorPane>
    </PageShell>
  );
};
