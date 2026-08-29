import { ArrowRight, Lightbulb, TrendingUp, Sparkles } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';

export const NLPInsights = () => {
  const { t } = useLanguage();
  const { session, next } = useTraining();

  const strengths = session.insights.filter((i) => i.kind === 'strength');
  const improvements = session.insights.filter((i) => i.kind === 'improvement');
  const metaModel = session.insights.find((i) => i.kind === 'metaModel');

  return (
    <PageShell wide>
      <MirrorPane>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{t.nlpInsights.heading}</h2>
        <p className="mt-2 text-xs text-muted">{t.nlpInsights.disclaimer}</p>

        {strengths.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wide text-aqua">
              <TrendingUp className="h-3.5 w-3.5" />
              {t.nlpInsights.strengthsHeading}
            </p>
            <div className="space-y-2">
              {strengths.map((insight, i) => (
                <div key={i} className="rounded-2xl border border-aqua/20 bg-aqua/5 p-4">
                  <p className="text-xs font-semibold text-aqua">{insight.title}</p>
                  <p className="mt-1 text-sm text-ink leading-relaxed">{insight.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {improvements.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold tracking-wide text-amber">
              <Lightbulb className="h-3.5 w-3.5" />
              {t.nlpInsights.improvementsHeading}
            </p>
            <div className="space-y-2">
              {improvements.map((insight, i) => (
                <div key={i} className="rounded-2xl border border-amber/20 bg-amber/5 p-4">
                  <p className="text-xs font-semibold text-amber">{insight.title}</p>
                  <p className="mt-1 text-sm text-ink leading-relaxed">{insight.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {metaModel && (
          <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-wide text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {t.nlpInsights.metaModelHeading}
            </p>
            <p className="text-sm text-ink leading-relaxed">{metaModel.body}</p>
          </div>
        )}

        <div className="mt-8">
          <Button onClick={next} fullWidth className="sm:w-auto sm:px-10">
            {t.nlpInsights.continueToJourney}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </MirrorPane>
    </PageShell>
  );
};
