import { useEffect, useState } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { MirrorPane } from '../components/ui/MirrorPane';
import { Button } from '../components/ui/Button';
import { RoleplayChat } from '../components/RoleplayChat';
import { useLanguage } from '../context/LanguageContext';
import { useTraining } from '../context/TrainingContext';
import { roleplayService } from '../services/ai';
import type { RoleplayMessage } from '../types/training';
import { getCurriculumModule, localize } from '../curriculum/modules';


export const Roleplay = () => {
  const { t, language } = useLanguage();
  const { session, updateSession, next } = useTraining();
  const [messages, setMessages] = useState<RoleplayMessage[]>(session.roleplayMessages);
  const [input, setInput] = useState('');

  const module = getCurriculumModule(session.moduleId);
  const character = module.scenario.characters[0];
  const characterName = localize(character.name, language);
  const characterRole = localize(character.role, language);
  // One user turn = one curriculum interaction stage. Never add a fixed
  // number of exchanges because that causes stages to repeat.
  const interactionCount = module.interaction.stages.length;

  useEffect(() => {
    if (messages.length === 0) {
      const opening = roleplayService.startScenario({
        characterName,
        characterRole,
        situation: localize(module.scenario.context, language),
        language,
        stage: 0,
        moduleId: session.moduleId ?? undefined,
      });
      setMessages([opening]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userTurns = messages.filter((m) => m.speaker === 'user').length;
  const finished = interactionCount === 0 || userTurns >= interactionCount;

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
        situation: localize(module.scenario.context, language),
        language,
        stage: userTurns,
        moduleId: session.moduleId ?? undefined,
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
            <p className="font-semibold uppercase tracking-wide">{language === 'id' ? 'Interaksi' : language === 'nl' ? 'Uitwisseling' : 'Exchange'}</p>
            <p className="font-mono-num">
              {Math.min(userTurns, interactionCount)} / {interactionCount}
            </p>
          </div>
        </div>

        <p className="mb-4 rounded-2xl bg-mist px-4 py-3 text-sm text-muted">{localize(module.scenario.context, language)}</p>

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

        {interactionCount > 0 && userTurns >= interactionCount && (
          <div className="mt-5">
            {finished && <p className="mb-3 text-sm text-aqua">{language === 'id' ? 'Roleplay selesai — sekarang lihat kembali apa yang terjadi.' : language === 'nl' ? 'Rollenspel voltooid — kijk nu terug op wat er gebeurde.' : 'Roleplay complete — now look back at what happened.'}</p>}
            <Button onClick={handleFinish} fullWidth className="sm:w-auto sm:px-10">
              {language === 'id' ? 'Lihat Kembali Percakapan' : language === 'nl' ? 'Gesprek bekijken' : 'Look Back at Conversation'}
            </Button>
          </div>
        )}
      </MirrorPane>
    </PageShell>
  );
};
