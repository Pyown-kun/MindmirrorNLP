import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';
import { analysisService } from '../services/ai';
import { computeFinalScores, selectInsightFlags } from '../utils/scoring';
import type { Insight } from '../types/training';

export const Analyzing = () => {
  const { t, language } = useLanguage();
  const { session, updateSession, next } = useTraining();
  const [visibleSteps, setVisibleSteps] = useState(0);

  const steps = [t.analyzing.step1, t.analyzing.step2, t.analyzing.step3, t.analyzing.step4, t.analyzing.step5];

  useEffect(() => {
    const conversationAnalysis = analysisService.analyzeConversation(session.roleplayMessages, language);
    const finalScores = computeFinalScores(session, conversationAnalysis);
    const flags = selectInsightFlags(session, finalScores);

    const insights: Insight[] = [];
    if (flags.strongEmpathy) {
      insights.push({ kind: 'strength', title: t.resultDetails.empathy, body: t.nlpInsights.strengthEmpathy });
    }
    if (flags.strongSpecificity) {
      insights.push({ kind: 'strength', title: t.resultDetails.specificity, body: t.nlpInsights.strengthSpecificity });
    }
    if (insights.length === 0 && finalScores.selfAwareness >= 50) {
      insights.push({ kind: 'strength', title: t.resultDetails.selfAwareness, body: t.nlpInsights.strengthReflection });
    }
    if (flags.hadGeneralization) {
      insights.push({ kind: 'improvement', title: t.analysis.generalizationLabel, body: t.nlpInsights.improvementGeneralization });
    }
    if (flags.hadJudgment) {
      insights.push({ kind: 'improvement', title: t.analysis.judgmentLabel, body: t.nlpInsights.improvementJudgment });
    }
    if (flags.hadAssumption) {
      insights.push({ kind: 'improvement', title: t.analysis.assumptionLabel, body: t.nlpInsights.improvementAssumption });
    }
    if (flags.lowQuestionUse) {
      insights.push({ kind: 'improvement', title: t.resultDetails.specificity, body: t.nlpInsights.improvementQuestions });
    }
    insights.push({ kind: 'metaModel', title: t.nlpInsights.metaModelHeading, body: t.nlpInsights.metaModelBody });

    updateSession({ communicationScores: finalScores, insights });

    const stepTimer = setInterval(() => {
      setVisibleSteps((prev) => Math.min(prev + 1, steps.length));
    }, 260);

    const doneTimer = setTimeout(() => {
      next();
    }, 1600);

    return () => {
      clearInterval(stepTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageShell>
      <MirrorPane className="text-center">
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
        <h2 className="font-display text-xl font-bold text-ink">{t.analyzing.heading}</h2>

        <ul className="mx-auto mt-6 max-w-xs space-y-3 text-left">
          {steps.map((label, i) => (
            <li key={label} className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${
                  i < visibleSteps ? 'bg-aqua text-white' : 'bg-ink/10 text-transparent'
                }`}
              >
                <Check className="h-3.5 w-3.5" />
              </span>
              <span className={i < visibleSteps ? 'text-ink' : 'text-muted'}>{label}</span>
            </li>
          ))}
        </ul>
      </MirrorPane>
    </PageShell>
  );
};
