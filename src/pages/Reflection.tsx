import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { TextAreaInput } from '../components/ui/Fields';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';
import { getCurriculumModule } from '../curriculum/modules';

export const Reflection = () => {
 const { language }=useLanguage(); const { session, updateSession, next }=useTraining(); const module=getCurriculumModule(session.moduleId); const [answer,setAnswer]=useState(session.reflectionAnswer); const [choice,setChoice]=useState(session.reflectionChoice);
 const questions=module.reflection.questions[language]; const choices=module.reflection.comparisonPrompts[language];
 const continueFlow=()=>{ if(!answer.trim() && !choice) return; updateSession({reflectionAnswer:answer.trim(),reflectionChoice:choice}); next(); };
 return <PageShell><MirrorPane><p className="text-sm font-semibold uppercase tracking-wide text-primary">{language==='id'?'REFLEKSI':language==='nl'?'REFLECTIE':'REFLECTION'}</p><h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">{questions[0]}</h2><div className="mt-5 grid gap-3">{choices.map(c=><button key={c} onClick={()=>setChoice(c)} className={`rounded-2xl border p-4 text-left text-sm transition ${choice===c?'border-primary bg-primary/5 text-ink':'border-ink/10 bg-white text-muted hover:border-primary/30'}`}>{c}</button>)}</div><p className="mt-6 text-sm font-medium text-muted">{questions[1] ?? (language==='id'?'Apa yang Anda perhatikan?':language==='nl'?'Wat valt je op?':'What did you notice?')}</p><div className="mt-3"><TextAreaInput value={answer} onChange={e=>setAnswer(e.target.value)} placeholder={language==='id'?'Tulis refleksi Anda…':language==='nl'?'Schrijf je reflectie…':'Write your reflection…'} rows={4}/></div><div className="mt-8"><Button onClick={continueFlow} fullWidth className="sm:w-auto sm:px-10">{language==='id'?'Lanjut ke Momen Aha':language==='nl'?'Naar jouw aha-moment':'Continue to Aha Moment'} <ArrowRight className="h-4 w-4"/></Button></div></MirrorPane></PageShell>;
};
