import type { CurriculumModule, RoleplayMessage, Language } from '../types/training';
import { localize } from '../curriculum/modules';

/**
 * ExperienceEngine turns the participant's wording into conversation state.
 * It deliberately avoids a single keyword -> canned reply mapping. The
 * character responds differently depending on what the participant actually
 * tried to discover and how much ambiguity they removed from the conversation.
 */
export class ExperienceEngine {
  private readonly module: CurriculumModule;

  constructor(module: CurriculumModule) { this.module = module; }

  opening(language: Language): RoleplayMessage {
    return { id: this.id(), speaker: 'character', text: localize(this.module.scenario.openingMessage, language), timestamp: Date.now() };
  }

  respond(language: Language, messages: RoleplayMessage[], stageIndex: number): RoleplayMessage {
    const stages = this.module.interaction.stages;
    if (!stages.length) return { id: this.id(), speaker: 'character', text: '', timestamp: Date.now() };
    const safe = Math.min(Math.max(stageIndex, 0), stages.length - 1);
    const stage = stages[safe];
    const userTurns = messages.filter(m => m.speaker === 'user');
    const last = userTurns[userTurns.length - 1]?.text?.trim() ?? '';
    const evidence = inspectLanguage(last);

    const expected = stage.expectedInteractionTypes;
    const strategy = chooseStrategy(expected, evidence, safe, userTurns.length);
    const base = localize(stage.replies[strategy], language);

    // Make the character acknowledge the *kind* of information the participant
    // requested. This is intentionally lightweight and curriculum-safe: it does
    // not invent facts that are not present in the supplied curriculum.
    const bridge = adaptiveBridge(language, strategy, evidence);
    const reply = bridge ? `${base} ${bridge}` : base;

    return { id: this.id(), speaker: 'character', text: reply, timestamp: Date.now() };
  }

  private id() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
}

export interface TurnEvidence {
  clarifying: boolean;
  open: boolean;
  closed: boolean;
  concrete: boolean;
  personOrRole: boolean;
  timeOrPlace: boolean;
  observable: boolean;
  empathy: boolean;
  judgment: boolean;
  assumption: boolean;
  generalization: boolean;
}

export function inspectLanguage(text: string): TurnEvidence {
  const t = text.toLowerCase().trim();
  const words = t.split(/\s+/).filter(Boolean);
  const question = /[?]$/.test(t) || /^(who|what|when|where|which|how|why|apa|siapa|kapan|di mana|mana|bagaimana|mengapa|wat|wie|wanneer|waar|welk|hoe|waarom)\b/.test(t);
  const clarifying = question && /\b(who|what|when|where|which|how|siapa|apa|kapan|di mana|mana|bagaimana|mengapa|wie|wanneer|waar|welk|hoe|waarom)\b/.test(t);
  const open = /\b(tell me more|tell me|describe|what happened|what do you mean|ceritakan|jelaskan|apa yang terjadi|bagaimana|vertel|wat gebeurde|hoe)\b/.test(t);
  const closed = /^(so|are|is|do|did|will|jadi|apakah|benarkah|dus|is het|klopt)\b/.test(t);
  const concrete = /\b(yesterday|today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|kemarin|hari ini|besok|senin|selasa|rabu|kamis|jumat|sabtu|minggu|gisteren|vandaag|morgen|maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag|meeting|rapat|meeting|project|proyek|deadline|klien|client)\b/.test(t) || words.length >= 8;
  const personOrRole = /\b(who|siapa|manager|manajer|director|direktur|team|tim|colleague|rekan|client|klien|manager|collega|wie)\b/.test(t);
  const timeOrPlace = /\b(when|where|kapan|di mana|when|waar|wanneer|kemarin|hari ini|besok|yesterday|today|tomorrow|meeting|rapat)\b/.test(t);
  const observable = /\b(said|say|did|do|happened|interrupted|sent|wrote|mengatakan|katakan|terjadi|menyela|mengirim|menulis|zei|gebeurde|onderbrak)\b/.test(t);
  const empathy = /\b(understand|sounds|must be|frustrat|concern|khawatir|frustrasi|paham|mengerti|begrijp|klinkt|zorgelijk)\b/.test(t);
  const judgment = /\b(lazy|careless|incompetent|stupid|malas|ceroboh|tidak kompeten|bodoh|lui|onbekwaam|dom)\b/.test(t);
  const assumption = /\b(obviously|clearly|probably|i assume|pasti|jelas|mungkin dia|saya kira|tentu|waarschijnlijk|duidelijk|ik neem aan)\b/.test(t);
  const generalization = /\b(always|never|everyone|nobody|selalu|tidak pernah|semua orang|tidak ada yang|altijd|nooit|iedereen|niemand)\b/.test(t);
  return { clarifying, open, closed, concrete, personOrRole, timeOrPlace, observable, empathy, judgment, assumption, generalization };
}

function chooseStrategy(expected: Array<'clarify'|'empathy'|'specific'|'reflect'>, e: TurnEvidence, stage: number, turn: number): 'clarify'|'empathy'|'specific'|'fallback' {
  if (expected.includes('specific') && (e.concrete || e.personOrRole || e.timeOrPlace || e.observable)) return 'specific';
  if (expected.includes('clarify') && e.clarifying) return 'clarify';
  if (expected.includes('empathy') && e.empathy) return 'empathy';
  if (expected.includes('clarify') && e.open) return 'clarify';
  // A different fallback is useful when participants repeat a move: it keeps
  // the interaction from feeling like a slot machine with one canned answer.
  if (turn > 0 && stage > 0 && (e.judgment || e.assumption || e.generalization)) return 'empathy';
  return 'fallback';
}

function adaptiveBridge(language: Language, strategy: string, e: TurnEvidence): string {
  if (strategy === 'specific' && e.personOrRole && e.timeOrPlace) return tx(language, 'You narrowed it to a person and a situation.', 'Anda mempersempitnya ke orang dan situasi tertentu.', 'Je beperkte het tot een persoon en een specifieke situatie.');
  if (strategy === 'specific' && e.personOrRole) return tx(language, 'You asked me to make the person involved explicit.', 'Anda meminta saya memperduidelas siapa yang terlibat.', 'Je vroeg me om duidelijk te maken wie erbij betrokken was.');
  if (strategy === 'specific' && e.timeOrPlace) return tx(language, 'You asked for the situation rather than the general story.', 'Anda meminta situasinya, bukan cerita yang masih umum.', 'Je vroeg naar de situatie in plaats van naar het algemene verhaal.');
  if (strategy === 'specific' && e.observable) return tx(language, 'You brought the conversation toward something observable.', 'Anda membawa percakapan ke sesuatu yang bisa diamati.', 'Je bracht het gesprek naar iets waarneembaars.');
  if (strategy === 'clarify' && e.open) return tx(language, 'That opened the story up before we narrowed it down.', 'Itu membuka cerita sebelum kita mempersempitnya.', 'Dat opende het verhaal voordat we het specifieker maakten.');
  if (strategy === 'empathy' && e.judgment) return tx(language, 'There is a strong conclusion in that wording; let me stay with the situation.', 'Ada kesimpulan kuat dalam kalimat itu; mari tetap pada situasinya.', 'Er zit een sterke conclusie in die formulering; laten we bij de situatie blijven.');
  return '';
}

function tx(language: Language, en: string, id: string, nl: string) { return language === 'id' ? id : language === 'nl' ? nl : en; }
