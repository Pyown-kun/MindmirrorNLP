import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { TextInput, TextAreaInput } from '../components/ui/Fields';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';

export const SituationInput = () => {
  const { t } = useLanguage();
  const { session, updateSession, next } = useTraining();
  const [person, setPerson] = useState(session.person);
  const [situation, setSituation] = useState(session.situation);
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!person.trim() || !situation.trim()) {
      setError(t.situation.errorEmpty);
      return;
    }
    updateSession({ person: person.trim(), situation: situation.trim() });
    next();
  };

  return (
    <PageShell>
      <MirrorPane>
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-xl font-bold text-ink">{t.situation.personQuestion}</h2>
            <div className="mt-3">
              <TextInput
                value={person}
                onChange={(e) => {
                  setPerson(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t.situation.personPlaceholder}
                autoFocus
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-ink">{t.situation.situationQuestion}</h2>
            <div className="mt-3">
              <TextAreaInput
                value={situation}
                onChange={(e) => {
                  setSituation(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t.situation.situationPlaceholder}
                rows={4}
              />
            </div>
          </div>

          {error && <p className="text-sm font-medium text-rose">{error}</p>}

          <Button onClick={handleContinue} fullWidth className="sm:w-auto sm:px-10">
            {t.common.continue}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </MirrorPane>
    </PageShell>
  );
};
