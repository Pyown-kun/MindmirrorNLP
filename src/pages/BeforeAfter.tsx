import { ArrowDown, ArrowRight } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';

export const BeforeAfter = () => {
  const { t } = useLanguage();
  const { session, next } = useTraining();

  const afterText = `${session.situation} ${session.positivePerspective}`.trim();

  return (
    <PageShell>
      <MirrorPane>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t.beforeAfter.heading}</p>

        <div className="mt-5 space-y-3">
          <div className="rounded-2xl border border-rose/20 bg-rose/5 p-5">
            <p className="mb-1 text-xs font-bold tracking-wide text-rose">{t.beforeAfter.before}</p>
            <p className="font-display text-base text-ink">"{session.initialThought}"</p>
          </div>
          <div className="flex justify-center">
            <ArrowDown className="h-5 w-5 text-muted" />
          </div>
          <div className="rounded-2xl border border-aqua/25 bg-aqua/5 p-5">
            <p className="mb-1 text-xs font-bold tracking-wide text-aqua">{t.beforeAfter.after}</p>
            <p className="font-display text-base text-ink">"{afterText}"</p>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted leading-relaxed">{t.beforeAfter.summary}</p>

        <div className="mt-8">
          <Button onClick={next} fullWidth className="sm:w-auto sm:px-10">
            {t.beforeAfter.continueToComplete}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </MirrorPane>
    </PageShell>
  );
};
