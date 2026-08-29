import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/ui/Fields';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';

export const NameInput = () => {
  const { t } = useLanguage();
  const { session, updateSession, next } = useTraining();
  const [name, setName] = useState(session.userName);
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!name.trim()) {
      setError(t.nameInput.errorEmpty);
      return;
    }
    updateSession({ userName: name.trim() });
    next();
  };

  return (
    <PageShell>
      <MirrorPane>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{t.nameInput.question}</h2>

        <div className="mt-6">
          <TextInput
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
            placeholder={t.nameInput.placeholder}
            autoFocus
          />
          {!error && <p className="mt-2 text-sm text-muted">{t.nameInput.example}</p>}
          {error && <p className="mt-2 text-sm font-medium text-rose">{error}</p>}
        </div>

        {name.trim() && (
          <p className="mt-6 rounded-2xl bg-primary/5 px-5 py-4 text-sm text-ink">
            {t.nameInput.greeting(name.trim())}
            <br />
            <span className="text-muted">{t.nameInput.greetingSub}</span>
          </p>
        )}

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
