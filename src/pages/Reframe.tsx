import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { TextAreaInput } from '../components/ui/Fields';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';

export const Reframe = () => {
  const { t } = useLanguage();
  const { session, updateSession, next } = useTraining();
  const [text, setText] = useState(session.positivePerspective);
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!text.trim()) {
      setError(t.reframe.errorEmpty);
      return;
    }
    updateSession({ positivePerspective: text.trim() });
    next();
  };

  return (
    <PageShell>
      <MirrorPane>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{t.reframe.question}</h2>

        <div className="mt-6">
          <TextAreaInput
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError('');
            }}
            placeholder={t.reframe.placeholder}
            rows={4}
            autoFocus
          />
          {error && <p className="mt-2 text-sm font-medium text-rose">{error}</p>}
        </div>

        <div className="mt-8">
          <Button onClick={handleContinue} fullWidth className="sm:w-auto sm:px-10">
            {t.common.continue}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </MirrorPane>
    </PageShell>
  );
};
