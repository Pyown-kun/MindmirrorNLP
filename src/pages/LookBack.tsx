import { ArrowRight, Quote } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';
import { getCurriculumModule, localize } from '../curriculum/modules';
import { ReflectionEngine } from '../engine/ReflectionEngine';

export const LookBack = () => {
  const { language } = useLanguage(); const { session, next } = useTraining();
  const module = getCurriculumModule(session.moduleId); const data = ReflectionEngine.compare(module, session.roleplayMessages);
  return <PageShell wide><MirrorPane>
    <p className="text-sm font-semibold uppercase tracking-wide text-primary">LOOK BACK</p>
    <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">{language === 'id' ? 'Lihat kembali percakapan Anda' : language === 'nl' ? 'Kijk terug naar je gesprek' : 'Look back at your conversation'}</h2>
    <p className="mt-2 text-sm leading-relaxed text-muted">{language === 'id' ? 'Perhatikan bagaimana respons awal Anda berkembang sepanjang percakapan.' : language === 'nl' ? 'Let op hoe je eerste reactie zich tijdens het gesprek ontwikkelde.' : 'Notice how your first response developed throughout the conversation.'}</p>
    <div className="mt-7 grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-rose/20 bg-rose/5 p-5"><p className="text-xs font-bold uppercase tracking-wide text-rose">{language === 'id' ? 'AWAL' : language === 'nl' ? 'EERST' : 'EARLIER'}</p><Quote className="mt-3 h-5 w-5 text-rose/60"/><p className="mt-2 font-display text-base leading-relaxed text-ink">“{data.firstResponse}”</p></div>
      <div className="rounded-2xl border border-aqua/25 bg-aqua/5 p-5"><p className="text-xs font-bold uppercase tracking-wide text-aqua">{language === 'id' ? 'KEMUDIAN' : language === 'nl' ? 'LATER' : 'LATER'}</p><Quote className="mt-3 h-5 w-5 text-aqua/60"/><p className="mt-2 font-display text-base leading-relaxed text-ink">“{data.lastResponse || localize(module.scenario.openingMessage, language)}”</p></div>
    </div>
    <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wide text-muted">{language === 'id' ? 'YANG BERUBAH' : language === 'nl' ? 'WAT VERANDERDE' : 'WHAT CHANGED'}</p><div className="mt-3 space-y-2">{module.reflection.comparisonPrompts[language].map((item) => <div key={item} className="rounded-xl bg-mist px-4 py-3 text-sm text-ink">{item}</div>)}</div></div>
    <div className="mt-8"><Button onClick={next} fullWidth className="sm:w-auto sm:px-10">{language === 'id' ? 'Refleksikan' : language === 'nl' ? 'Reflecteer' : 'Reflect'} <ArrowRight className="h-4 w-4"/></Button></div>
  </MirrorPane></PageShell>;
};
