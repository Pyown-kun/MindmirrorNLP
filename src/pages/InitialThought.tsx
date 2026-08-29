import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { TextAreaInput } from '../components/ui/Fields';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';
import { analysisService } from '../services/ai';

export const InitialThought = () => {
  const { t, language } = useLanguage();
  const { session, updateSession, next } = useTraining();
  const [thought, setThought] = useState(session.initialThought);
  const [error, setError] = useState('');

  const handleAnalyze = () => {
    if (!thought.trim()) {
      setError(t.initialThought.errorEmpty);
      return;
    }
    const result = analysisService.analyzeMindset({ text: thought.trim(), language });
    updateSession({ initialThought: thought.trim(), analysisResult: result });
    next();
  };

  return (
    <PageShell>
      <MirrorPane>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{t.initialThought.question}</h2>

        <div className="mt-6">
          <TextAreaInput
            value={thought}
            onChange={(e) => {
              setThought(e.target.value);
              if (error) setError('');
            }}
            placeholder={t.initialThought.placeholder}
            rows={5}
            autoFocus
          />
          {error && <p className="mt-2 text-sm font-medium text-rose">{error}</p>}
        </div>

        <div className="mt-8">
          <Button onClick={handleAnalyze} fullWidth className="sm:w-auto sm:px-10">
            <Sparkles className="h-4 w-4" />
            {t.common.analyze}
          </Button>
        </div>
      </MirrorPane>
    </PageShell>
  );
};
