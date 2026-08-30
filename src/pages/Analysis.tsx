import { CheckCircle2 } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { AnalysisCard } from '../components/AnalysisCard';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';
import type { PatternType } from '../types/training';

const LABEL_KEY: Record<PatternType, 'generalizationLabel' | 'judgmentLabel' | 'assumptionLabel'> = {
  generalization: 'generalizationLabel',
  judgment: 'judgmentLabel',
  assumption: 'assumptionLabel',
};

const TIP_KEY: Record<PatternType, 'generalizationTip' | 'judgmentTip' | 'assumptionTip'> = {
  generalization: 'generalizationTip',
  judgment: 'judgmentTip',
  assumption: 'assumptionTip',
};

export const Analysis = () => {
  const { t, language } = useLanguage();
  const { session, next } = useTraining();
  const patterns = session.analysisResult?.patterns ?? [];
  const isClean = session.analysisResult?.isClean ?? true;

  return (
    <PageShell wide>
      <MirrorPane>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t.analysis.heading}</p>

        {isClean ? (
          <div className="mt-4 flex flex-col items-center rounded-2xl bg-aqua/8 px-6 py-10 text-center">
            <CheckCircle2 className="mb-3 h-10 w-10 text-aqua" />
            <h2 className="font-display text-xl font-bold text-ink">{t.analysis.cleanHeading}</h2>
            <p className="mt-2 max-w-sm text-sm text-muted leading-relaxed">{t.analysis.cleanBody}</p>
          </div>
        ) : (
          <>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">{t.analysis.subheading}</h2>
            <div className="mt-6 space-y-4">
              {patterns.map((p, i) => (
                <AnalysisCard
                  key={`${p.type}-${i}`}
                  type={p.type}
                  label={t.analysis[LABEL_KEY[p.type]]}
                  matchedText={p.matchedText}
                  sourceSentence={p.sourceSentence}
                  tip={t.analysis[TIP_KEY[p.type]]}
                  detectedLabel={t.common.detected}
                />
              ))}
            </div>
          </>
        )}

        {session.communicationScores?.evidence && (
          <div className="mt-6 rounded-2xl border border-aqua/20 bg-aqua/5 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-aqua">{language === 'id' ? 'BUKTI INTERAKSI' : language === 'nl' ? 'INTERACTIEBEWIJS' : 'INTERACTION EVIDENCE'}</p>
            <div className="mt-3 space-y-2">
              {session.communicationScores.evidence.highlights.map((item) => (
                <div key={item} className="rounded-xl bg-white px-4 py-3 text-sm text-ink">✓ {item}</div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <Button onClick={next} fullWidth className="sm:w-auto sm:px-10">
            {t.common.reframe}
          </Button>
        </div>
      </MirrorPane>
    </PageShell>
  );
};
