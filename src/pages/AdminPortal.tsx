import { useState, type FormEvent } from 'react';
import { ArrowLeft, Check, Globe2, LockKeyhole, LogOut, Save, ShieldCheck, RotateCcw, Languages } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getCurriculum, resetCurriculum, saveCurriculum, type Curriculum } from '../curriculum';
import type { Language, TrainingType } from '../types/training';

const types: TrainingType[] = ['feedback', 'conflict', 'leadership'];
const languageNames: Record<Language, string> = { en: 'English', id: 'Bahasa Indonesia', nl: 'Nederlands' };

const AdminLogin = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@mindmirror.demo');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const submit = (e: FormEvent) => { e.preventDefault(); setError(login(email, password) ? '' : 'Invalid admin credentials.'); };
  return (
    <div className="min-h-screen bg-mist px-4 py-10 sm:px-8">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
        <form onSubmit={submit} className="w-full rounded-[2rem] border border-ink/10 bg-white p-7 shadow-xl">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><LockKeyhole /></div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">MindMirror Admin</p>
          <h1 className="mt-2 font-display text-3xl font-bold">Curriculum Portal</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">Protected workspace for curriculum editors. Participants never see these controls.</p>
          <label className="mt-6 block text-sm font-semibold">Admin email<input value={email} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-ink/10 px-3 py-3 font-normal" /></label>
          <label className="mt-4 block text-sm font-semibold">Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-ink/10 px-3 py-3 font-normal" /></label>
          {error && <p className="mt-3 rounded-xl bg-rose/10 px-3 py-2 text-sm text-rose">{error}</p>}
          <Button type="submit" fullWidth className="mt-6"><ShieldCheck className="h-4 w-4" /> Sign in as admin</Button>
          <p className="mt-4 text-center text-xs text-muted">Demo: admin@mindmirror.demo · Admin123!</p>
        </form>
      </div>
    </div>
  );
};

export const AdminPortal = () => {
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState<Language>('en');
  const [type, setType] = useState<TrainingType>('feedback');
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState<Curriculum>(() => getCurriculum('en', 'feedback'));

  if (!user || user.role !== 'admin') return <AdminLogin />;

  const curriculum = getCurriculum(language, type);
  const active = draft.id === curriculum.id ? draft : curriculum;
  const scenario = active.scenarios[0];

  const selectLanguage = (next: Language) => { setLanguage(next); setDraft(getCurriculum(next, type)); setSaved(false); };
  const selectType = (next: TrainingType) => { setType(next); setDraft(getCurriculum(language, next)); setSaved(false); };
  const updateScenario = (field: string, value: string) => {
    setDraft({ ...active, scenarios: active.scenarios.map((s, i) => i === 0 ? { ...s, [field]: value } : s) });
    setSaved(false);
  };
  const updateStage = (stageIndex: number, field: string, value: string) => {
    setDraft({ ...active, scenarios: active.scenarios.map((s, i) => i === 0 ? { ...s, stages: s.stages.map((st, j) => j === stageIndex ? { ...st, [field]: value } : st) } : s) });
    setSaved(false);
  };
  const save = () => { saveCurriculum(language, active); setSaved(true); };
  const reset = () => { resetCurriculum(language, type); setDraft(getCurriculum(language, type)); setSaved(true); };

  return (
    <div className="min-h-screen bg-mist">
      <header className="sticky top-0 z-10 border-b border-ink/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <div><p className="font-display text-lg font-bold">MindMirror <span className="text-primary">Admin</span></p><p className="text-xs text-muted">Curriculum management workspace</p></div>
          <div className="flex items-center gap-2"><button onClick={() => { window.location.href = '/'; }} className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-muted hover:bg-mist sm:inline-flex"><ArrowLeft className="mr-1 h-4 w-4" /> User app</button><button onClick={logout} className="rounded-xl px-3 py-2 text-sm font-semibold text-muted hover:bg-mist"><LogOut className="mr-1 inline h-4 w-4" /> Logout</button></div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-7 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-3xl border border-ink/10 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Content scope</p>
            <div className="mt-3 space-y-2">
              {types.map(t => <button key={t} onClick={() => selectType(t)} className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold ${type === t ? 'bg-primary text-white' : 'hover:bg-mist'}`}>{t[0].toUpperCase()+t.slice(1)}</button>)}
            </div>
            <div className="my-5 border-t border-ink/10" />
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Language version</p>
            <div className="mt-3 space-y-2">
              {(Object.keys(languageNames) as Language[]).map(l => <button key={l} onClick={() => selectLanguage(l)} className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold ${language === l ? 'bg-aqua/10 text-aqua' : 'hover:bg-mist'}`}><span>{languageNames[l]}</span>{language === l && <Check className="h-4 w-4" />}</button>)}
            </div>
            <div className="mt-6 rounded-2xl bg-mist p-4 text-xs leading-relaxed text-muted"><Languages className="mb-2 h-4 w-4 text-primary" />Each language has its own curriculum content. Dialogue shown to participants comes from the selected language version.</div>
          </aside>

          <section className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-4 border-b border-ink/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div><p className="text-xs font-bold uppercase tracking-wider text-primary">Editing {language.toUpperCase()} · {type}</p><h1 className="mt-1 font-display text-2xl font-bold">{active.title}</h1><p className="mt-1 text-sm text-muted">Version {active.version} · Scenario {scenario.id}</p></div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold">Curriculum title<input value={active.title} onChange={e => setDraft({ ...active, title: e.target.value })} className="mt-2 w-full rounded-xl border border-ink/10 px-3 py-3 font-normal" /></label>
              <label className="text-sm font-semibold">Description<textarea value={active.description} onChange={e => setDraft({ ...active, description: e.target.value })} className="mt-2 min-h-24 w-full rounded-xl border border-ink/10 px-3 py-3 font-normal" /></label>
            </div>
            <div className="mt-7 rounded-3xl bg-mist p-5"><p className="text-xs font-bold uppercase tracking-wider text-muted">Scenario content</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold">Scenario title<input value={scenario.title} onChange={e => updateScenario('title', e.target.value)} className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-3 py-3 font-normal" /></label>
                <label className="text-sm font-semibold">Character<textarea value={`${scenario.characterName} · ${scenario.characterRole}`} disabled className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-3 py-3 font-normal opacity-70" /></label>
              </div>
              <label className="mt-4 block text-sm font-semibold">Situation<textarea value={scenario.situation} onChange={e => updateScenario('situation', e.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-ink/10 bg-white px-3 py-3 font-normal" /></label>
            </div>
            <div className="mt-7"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-muted">Roleplay dialogue</p><h2 className="mt-1 font-display text-lg font-bold">Participant-facing conversation</h2></div><span className="rounded-full bg-aqua/10 px-3 py-1 text-xs font-semibold text-aqua">{languageNames[language]}</span></div>
              <div className="mt-4 space-y-4">
                {scenario.stages.map((stage, i) => <div key={i} className="rounded-2xl border border-ink/10 p-4"><p className="text-xs font-bold uppercase tracking-wider text-primary">Turn {i+1}</p><div className="mt-3 grid gap-3 md:grid-cols-2">{(['opening','onClarify','onEmpathy','onSpecific','fallback'] as const).map(field => <label key={field} className="text-xs font-semibold text-muted">{field}<textarea value={stage[field]} onChange={e => updateStage(i, field, e.target.value)} className="mt-1 min-h-20 w-full rounded-xl border border-ink/10 px-3 py-2 text-sm font-normal text-ink" /> </label>)}</div></div>)}
              </div>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3"><Button onClick={save}><Save className="h-4 w-4" /> Publish version</Button><button onClick={reset} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-muted hover:bg-mist"><RotateCcw className="h-4 w-4" /> Reset language version</button>{saved && <span className="inline-flex items-center gap-1 text-sm font-semibold text-aqua"><Check className="h-4 w-4" /> Saved locally</span>}</div>
            <div className="mt-5 rounded-2xl border border-primary/10 bg-primary/5 p-4 text-xs leading-relaxed text-muted"><Globe2 className="mb-2 h-4 w-4 text-primary" /><strong className="text-ink">Production pattern:</strong> keep this portal behind SSO/OIDC and server-side role-based access control. The demo uses localStorage only to illustrate the protected UX; it is not a security boundary.</div>
          </section>
        </div>
      </main>
    </div>
  );
};
