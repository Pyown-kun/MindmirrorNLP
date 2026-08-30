import { CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';
import { getCurriculumModule, localize } from '../curriculum/modules';

export const TrainingComplete = () => {
  const { language } = useLanguage(); const { session, resetSession, goTo } = useTraining(); const module=getCurriculumModule(session.moduleId);
  const trainAgain=()=>{resetSession();goTo('training-selection');};
  return <PageShell><MirrorPane className="text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-aqua/15"><CheckCircle2 className="h-8 w-8 text-aqua"/></div><p className="text-sm font-semibold uppercase tracking-wide text-aqua">{language==='id'?'PENGALAMAN SELESAI':language==='nl'?'ERVARING VOLTOOID':'EXPERIENCE COMPLETE'}</p><h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">{localize(module.title,language)}</h2><div className="mt-6 text-left"><p className="text-xs font-bold uppercase tracking-wide text-muted">{language==='id'?'YANG ANDA BAWA':language==='nl'?'WAT JE MEENEEMT':'WHAT YOU TAKE WITH YOU'}</p><p className="mt-2 rounded-2xl bg-mist p-5 text-sm leading-relaxed text-ink">{session.ahaReflection || localize(module.ahaMoment.systemInsight,language)}</p></div><div className="mt-5 rounded-2xl bg-primary/5 p-5 text-left"><p className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-wide text-primary"><Sparkles className="h-3.5 w-3.5"/>{localize(module.takeaway.title,language)}</p><p className="text-sm leading-relaxed text-ink">{localize(module.takeaway.practicalChallenge,language)}</p></div><div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"><Button variant="secondary" onClick={trainAgain}><RotateCcw className="h-4 w-4"/>{language==='id'?'Latihan Lagi':language==='nl'?'Opnieuw trainen':'Train Again'}</Button><Button onClick={()=>resetSession()}>{language==='id'?'Sesi Baru':language==='nl'?'Nieuwe sessie':'Start New Session'}</Button></div></MirrorPane></PageShell>;
};
