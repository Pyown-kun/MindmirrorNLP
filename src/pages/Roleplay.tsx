import { useEffect, useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { RoleplayChat } from '../components/RoleplayChat';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';
import { roleplayService } from '../services/ai';
import type { RoleplayMessage } from '../types/training';
import { getCurriculum } from '../curriculum';

const MIN_EXCHANGES = 4;
const MAX_EXCHANGES = 6;

export const Roleplay = () => {
  const { t, language } = useLanguage();
  const { session, updateSession, next } = useTraining();
  const [messages, setMessages] = useState<RoleplayMessage[]>(session.roleplayMessages);
  const [input, setInput] = useState('');

  const curriculum = getCurriculum(language, session.trainingType ?? 'feedback');
  const scenario = curriculum.scenarios.find((item) => item.id === session.scenarioId) ?? curriculum.scenarios[0];
  const characterName = scenario.characterName;
  const characterRole = scenario.characterRole;

  useEffect(() => {
    if (messages.length === 0) {
      const opening = roleplayService.startScenario({
        characterName,
        characterRole,
        situation: scenario.situation,
        language,
        stage: 0,
        trainingType: session.trainingType ?? 'feedback',
        scenarioId: scenario.id,
      });
      setMessages([opening]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userTurns = messages.filter((m) => m.speaker === 'user').length;
  const finished = userTurns >= MAX_EXCHANGES;

  const handleSend = () => {
    if (!input.trim() || finished) return;

    const userMsg: RoleplayMessage = {
      id: `${Date.now()}-u`,
      speaker: 'user',
      text: input.trim(),
      timestamp: Date.now(),
    };
    const updated = [...messages, userMsg];
    setInput('');

    const reply = roleplayService.respond(
      {
        characterName,
        characterRole,
        situation: scenario.situation,
        language,
        stage: userTurns,
        trainingType: session.trainingType ?? 'feedback',
        scenarioId: scenario.id,
      },
      updated
    );

    setMessages([...updated, reply]);
  };

  const handleFinish = () => {
    updateSession({ roleplayMessages: messages });
    next();
  };

  return (
    <PageShell wide>
      <MirrorPane>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-aqua/15 font-display text-lg font-bold text-aqua">
            {characterName.charAt(0)}
          </div>
          <div>
            <p className="font-display text-lg font-bold text-ink">{characterName}</p>
            <p className="text-sm text-muted">{characterRole}</p>
          </div>
          <div className="ml-auto text-right text-xs text-muted">
            <p className="font-semibold uppercase tracking-wide">{t.roleplay.progressLabel}</p>
            <p className="font-mono-num">
              {Math.min(userTurns, MAX_EXCHANGES)} / {MAX_EXCHANGES}
            </p>
          </div>
        </div>

        <p className="mb-2 rounded-2xl bg-mist px-4 py-3 text-sm text-muted">{scenario.situation}</p>
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-primary">{curriculum.title} · {scenario.title}</p>

        <RoleplayChat
          messages={messages}
          characterName={characterName}
          input={input}
          onInputChange={setInput}
          onSend={handleSend}
          placeholder={t.common.typeYourReply}
          sendLabel={t.common.send}
          youLabel={t.common.you}
          disabled={finished}
        />

        {userTurns >= MIN_EXCHANGES && (
          <div className="mt-5">
            {finished && <p className="mb-3 text-sm text-aqua">{t.roleplay.endNote}</p>}
            <Button onClick={handleFinish} fullWidth className="sm:w-auto sm:px-10">
              {t.roleplay.finish}
            </Button>
          </div>
        )}
      </MirrorPane>
    </PageShell>
  );
};
