import { CheckCircle2, RotateCcw, Sparkles, ArrowRight } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';
import type { PatternType } from '../types/training';

const ahaCopy: Record<PatternType, { title: string; body: string }> = {
  generalization: { title: 'I notice I turn one event into a pattern.', body: 'In the conversation, the useful move was to slow down and ask for the specific example instead of treating “always” as a fact.' },
  judgment: { title: 'I notice I describe the person before the behaviour.', body: 'A more useful conversation starts with what happened, then invites the other person to explain the context.' },
  assumption: { title: 'I notice I can guess intent too quickly.', body: 'The roleplay gave you a chance to replace the guess with a question and let the other person supply the missing information.' },
};

export const TrainingComplete = () => {
  const { t } = useLanguage();
  const { session, resetSession, goTo } = useTraining();
  const skills = [t.complete.skill1, t.complete.skill2, t.complete.skill3, t.complete.skill4, t.complete.skill5];
  const firstPattern = session.analysisResult?.patterns[0]?.type;
  const aha = firstPattern ? ahaCopy[firstPattern] : { title: 'I can slow down before I conclude.', body: 'The practice showed that one specific question can create more room for clarity, empathy, and ownership.' };
  const userQuestions = session.roleplayMessages.filter((m) => m.speaker === 'user' && m.text.trim().endsWith('?')).length;

  const trainAgain = () => { resetSession(); goTo('training-selection'); };

  return (
    <PageShell wide>
      <MirrorPane>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-aqua/15"><CheckCircle2 className="h-8 w-8 text-aqua" /></div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{session.curriculumId || 'curriculum-ready-demo'}</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">{t.complete.heading}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-muted">This ending focuses on what you noticed about your own communication — not just a score.</p>
        </div>

        <div className="mt-7 rounded-3xl border border-primary/20 bg-primary/[0.04] p-6">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary"><Sparkles className="h-4 w-4" /> Your “aha” moment</p>
          <h3 className="mt-3 font-display text-xl font-bold text-ink">{aha.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/80">{aha.body}</p>
          <div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-muted">{session.analysisResult?.patterns.length ?? 0} pattern(s) surfaced</span><span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-muted">{userQuestions} specific question(s)</span></div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-ink/10 bg-white p-5"><p className="mb-3 text-xs font-bold tracking-wide text-muted">{t.complete.skillsHeading}</p><ul className="space-y-2">{skills.map((skill) => <li key={skill} className="flex items-center gap-2 text-sm text-ink"><CheckCircle2 className="h-4 w-4 shrink-0 text-aqua" />{skill}</li>)}</ul></div>
          <div className="rounded-3xl border border-ink/10 bg-mist p-5"><p className="text-xs font-bold tracking-wide text-muted">TAKE IT INTO WORK</p><p className="mt-2 text-sm leading-relaxed text-ink">{t.complete.challengeBody}</p></div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"><Button variant="secondary" onClick={trainAgain}><RotateCcw className="h-4 w-4" />{t.common.trainAgain}</Button><Button onClick={() => resetSession()}>{t.common.startNewSession}<ArrowRight className="h-4 w-4" /></Button></div>
      </MirrorPane>
    </PageShell>
  );
};
