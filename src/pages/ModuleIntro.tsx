import { ArrowRight, Clock3, Target } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';
import { getCurriculumModule, localize } from '../curriculum/modules';

export const ModuleIntro = () => {
  const { language } = useLanguage();
  const { session, next } = useTraining();
  const module = getCurriculumModule(session.moduleId);
  return <PageShell><MirrorPane>
    <p className="text-sm font-semibold uppercase tracking-wide text-primary">{localize(module.category, language)}</p>
    <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">{localize(module.title, language)}</h1>
    <p className="mt-4 text-base leading-relaxed text-muted">{localize(module.description, language)}</p>
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl bg-mist p-4"><Clock3 className="mb-2 h-5 w-5 text-primary" /><p className="text-xs font-semibold uppercase tracking-wide text-muted">{language === 'id' ? 'Durasi' : language === 'nl' ? 'Duur' : 'Duration'}</p><p className="mt-1 font-semibold text-ink">{module.estimatedDuration} min</p></div>
      <div className="rounded-2xl bg-mist p-4"><Target className="mb-2 h-5 w-5 text-aqua" /><p className="text-xs font-semibold uppercase tracking-wide text-muted">{language === 'id' ? 'Fokus' : language === 'nl' ? 'Focus' : 'Focus'}</p><p className="mt-1 font-semibold text-ink">{localize(module.learningObjective, language)}</p></div>
    </div>
    <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-5"><p className="text-xs font-bold uppercase tracking-wide text-muted">{localize(module.scenario.title, language)}</p><p className="mt-2 text-sm leading-relaxed text-ink">{localize(module.scenario.context, language)}</p></div>
    <div className="mt-8"><Button onClick={next} fullWidth className="sm:w-auto sm:px-10">{language === 'id' ? 'Mulai Pengalaman' : language === 'nl' ? 'Ervaring starten' : 'Start Experience'} <ArrowRight className="h-4 w-4" /></Button></div>
  </MirrorPane></PageShell>;
};
