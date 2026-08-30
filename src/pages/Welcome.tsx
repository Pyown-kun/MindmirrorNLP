import { Settings, Sparkles } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { LanguageSelector } from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';

export const Welcome = () => {
  const { t } = useLanguage();
  const { goTo } = useTraining();

  return (
    <PageShell showBrand>
      <MirrorPane className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10">
          {/* Mirror concept icon: two facing arcs like a hand mirror reflecting a spark */}
          <svg viewBox="0 0 48 48" className="h-9 w-9 text-primary" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="19" r="13" stroke="currentColor" strokeWidth="2.5" />
            <path d="M24 32V44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M17 44H31" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M19 15C19.8 12.5 21.6 11 24 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>

        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">{t.welcome.heading}</h1>
        <p className="mt-2 font-display text-lg font-medium text-primary">{t.welcome.tagline}</p>
        <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-muted">{t.welcome.subtitle}</p>

        <div className="mt-8 flex justify-center sm:hidden">
          <LanguageSelector />
        </div>

        <div className="mt-8">
          <Button onClick={() => goTo('name')} fullWidth className="sm:w-auto sm:px-10">
            <Sparkles className="h-4 w-4" />
            {t.welcome.cta}
          </Button>
        </div>

        <button onClick={() => { window.location.href = '/admin'; }} className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition hover:text-ink">
          <Settings className="h-3.5 w-3.5" /> Admin / Curriculum Portal
        </button>
      </MirrorPane>
    </PageShell>
  );
};
