import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { TextAreaInput } from '../components/ui/Fields';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';
import { getCurriculumModule, localize } from '../curriculum/modules';
import { AhaMomentEngine } from '../engine/AhaMomentEngine';

export const AhaMoment = () => { const {language}=useLanguage(); const {session,updateSession,next}=useTraining(); const module=getCurriculumModule(session.moduleId); const data=AhaMomentEngine.create(module,session); const [text,setText]=useState(session.ahaReflection);
 return <PageShell><MirrorPane><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10"><Sparkles className="h-6 w-6 text-primary"/></div><p className="mt-5 text-center text-sm font-semibold uppercase tracking-wide text-primary">{localize(module.ahaMoment.title,language)}</p><h2 className="mt-2 text-center font-display text-2xl font-bold text-ink sm:text-3xl">{data.specific ? localize(module.ahaMoment.trigger,language) : localize(module.ahaMoment.trigger,language)}</h2><div className="mt-6 rounded-2xl bg-mist p-5"><p className="text-xs font-bold uppercase tracking-wide text-muted">{language==='id'?'APA YANG ANDA PERHATIKAN?':language==='nl'?'WAT MERKTE JE OP?':'WHAT DID YOU NOTICE?'}</p><p className="mt-2 text-sm leading-relaxed text-ink">{localize(module.ahaMoment.userPrompt,language)}</p><div className="mt-4"><TextAreaInput value={text} onChange={e=>setText(e.target.value)} placeholder={language==='id'?'Misalnya: saya bertanya dulu sebelum menyimpulkan.':language==='nl'?'Bijvoorbeeld: ik vroeg eerst voordat ik conclusies trok.':'For example: I asked before I concluded.'} rows={4}/></div></div><div className="mt-5 rounded-2xl border border-aqua/20 bg-aqua/5 p-5"><p className="text-xs font-bold uppercase tracking-wide text-aqua">{language==='id'?'INSIGHT':language==='nl'?'INZICHT':'INSIGHT'}</p><p className="mt-2 text-sm leading-relaxed text-ink">{localize(module.ahaMoment.systemInsight,language)}</p></div><div className="mt-8"><Button onClick={()=>{updateSession({ahaReflection:text.trim()});next();}} fullWidth className="sm:w-auto sm:px-10">{language==='id'?'Lanjut':language==='nl'?'Doorgaan':'Continue'} <ArrowRight className="h-4 w-4"/></Button></div></MirrorPane></PageShell>;
};
