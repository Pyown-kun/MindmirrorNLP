import type { RoleplayMessage, ScenarioContext } from '../../types/training';
import type { RoleplayService } from './AIService';
import { CLARIFYING_KEYWORDS, EMPATHY_KEYWORDS, findMatchedKeywords } from '../../utils/analysisRules';

interface StageLines {
  opening: string;
  onClarify: string;
  onEmpathy: string;
  onSpecific: string;
  fallback: string;
}

/**
 * Predefined dialogue per language for the "Give Feedback" scenario.
 * A future ExternalAIRoleplayService could replace this with live model
 * generation while keeping the same startScenario/respond contract.
 */
const SCENARIOS: Record<string, StageLines[]> = {
  en: [
    {
      opening: 'I know the task was late, but I have been dealing with several problems recently.',
      onClarify: "I've been overwhelmed with multiple projects recently.",
      onEmpathy: "Thank you for understanding. I didn't know how to explain the situation.",
      onSpecific: 'The new client project has taken much more time than expected.',
      fallback: "I'm not sure I follow — could you tell me more about what you mean?",
    },
    {
      opening: "I didn't want to bring it up earlier because I wasn't sure how you'd react.",
      onClarify: 'I was worried it would sound like an excuse.',
      onEmpathy: "That means a lot, thank you. It's been a hard few weeks.",
      onSpecific: "I've had to support a teammate who was out sick, on top of my own work.",
      fallback: 'I hear you. What would help you understand this better?',
    },
    {
      opening: "Honestly, I didn't realize how much this was affecting the team until now.",
      onClarify: 'I underestimated how tight the deadline actually was.',
      onEmpathy: "I appreciate you not jumping to conclusions about me.",
      onSpecific: "I can prioritize your deliverables first starting tomorrow.",
      fallback: "Can you clarify what you'd like me to focus on?",
    },
    {
      opening: "I want to fix this. What would a good outcome look like for you?",
      onClarify: 'A clear plan would help both of us, I think.',
      onEmpathy: 'I feel like we can actually solve this together now.',
      onSpecific: "I'll send you a revised timeline by end of day.",
      fallback: "Let's figure out next steps together — what do you suggest?",
    },
  ],
  id: [
    {
      opening: 'Saya tahu tugasnya terlambat, tapi saya sedang menghadapi beberapa masalah akhir-akhir ini.',
      onClarify: 'Saya kewalahan dengan beberapa proyek sekaligus akhir-akhir ini.',
      onEmpathy: 'Terima kasih sudah mau mengerti. Saya bingung cara menjelaskannya.',
      onSpecific: 'Proyek klien baru memakan waktu jauh lebih banyak dari perkiraan.',
      fallback: 'Saya kurang paham maksud Anda — bisa dijelaskan lagi?',
    },
    {
      opening: 'Saya tidak berani membicarakan ini lebih awal karena tidak yakin bagaimana reaksi Anda.',
      onClarify: 'Saya khawatir ini terdengar seperti alasan.',
      onEmpathy: 'Itu berarti banyak buat saya, terima kasih. Beberapa minggu ini berat.',
      onSpecific: 'Saya harus membantu rekan tim yang sakit, selain pekerjaan saya sendiri.',
      fallback: 'Saya dengar. Apa yang bisa membantu Anda memahami ini lebih baik?',
    },
    {
      opening: 'Jujur, saya baru sadar ini berdampak ke tim sebesar ini.',
      onClarify: 'Saya meremehkan seberapa ketat tenggat waktunya.',
      onEmpathy: 'Saya menghargai Anda tidak langsung menilai saya.',
      onSpecific: 'Saya bisa memprioritaskan tugas Anda mulai besok.',
      fallback: 'Bisa perjelas apa yang ingin Anda fokuskan?',
    },
    {
      opening: 'Saya ingin memperbaiki ini. Menurut Anda, hasil yang baik itu seperti apa?',
      onClarify: 'Saya rasa rencana yang jelas akan membantu kita berdua.',
      onEmpathy: 'Saya merasa kita bisa menyelesaikan ini bersama sekarang.',
      onSpecific: 'Saya akan kirim jadwal revisi sebelum akhir hari ini.',
      fallback: 'Mari kita cari langkah selanjutnya bersama — apa saran Anda?',
    },
  ],
  nl: [
    {
      opening: 'Ik weet dat de taak te laat was, maar ik heb de laatste tijd met problemen te maken gehad.',
      onClarify: 'Ik ben de laatste tijd overspoeld door meerdere projecten.',
      onEmpathy: 'Dank je voor je begrip. Ik wist niet hoe ik het moest uitleggen.',
      onSpecific: 'Het nieuwe klantproject heeft veel meer tijd gekost dan verwacht.',
      fallback: 'Ik snap het niet helemaal — kun je meer vertellen?',
    },
    {
      opening: 'Ik wilde het eerder niet ter sprake brengen omdat ik niet wist hoe je zou reageren.',
      onClarify: 'Ik was bang dat het als een excuus zou klinken.',
      onEmpathy: 'Dat betekent veel voor me, dank je. Het waren een paar zware weken.',
      onSpecific: 'Ik moest een zieke collega ondersteunen, naast mijn eigen werk.',
      fallback: 'Ik hoor je. Wat zou je helpen om dit beter te begrijpen?',
    },
    {
      opening: 'Eerlijk gezegd besefte ik pas nu hoezeer dit het team beïnvloedde.',
      onClarify: 'Ik onderschatte hoe krap de deadline eigenlijk was.',
      onEmpathy: 'Ik waardeer het dat je niet meteen conclusies trekt over mij.',
      onSpecific: 'Ik kan jouw taken vanaf morgen als eerste prioriteit geven.',
      fallback: 'Kun je verduidelijken waar je de focus op wilt leggen?',
    },
    {
      opening: 'Ik wil dit oplossen. Hoe zou een goed resultaat er voor jou uitzien?',
      onClarify: 'Een duidelijk plan zou ons allebei helpen, denk ik.',
      onEmpathy: 'Ik heb het gevoel dat we dit nu samen kunnen oplossen.',
      onSpecific: 'Ik stuur je vandaag nog een aangepaste planning.',
      fallback: 'Laten we samen de volgende stappen bepalen — wat stel je voor?',
    },
  ],
};

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export class SimpleRoleplayService implements RoleplayService {
  startScenario(context: ScenarioContext): RoleplayMessage {
    const stages = SCENARIOS[context.language] ?? SCENARIOS.en;
    return {
      id: genId(),
      speaker: 'character',
      text: stages[0].opening,
      timestamp: Date.now(),
    };
  }

  respond(context: ScenarioContext, messages: RoleplayMessage[]): RoleplayMessage {
    const stages = SCENARIOS[context.language] ?? SCENARIOS.en;
    const stageIndex = Math.min(context.stage, stages.length - 1);
    const stage = stages[stageIndex];

    const lastUserMessage = [...messages].reverse().find((m) => m.speaker === 'user');
    const text = lastUserMessage?.text ?? '';

    const isClarifying = findMatchedKeywords(text, CLARIFYING_KEYWORDS[context.language]).length > 0;
    const isEmpathetic = findMatchedKeywords(text, EMPATHY_KEYWORDS[context.language]).length > 0;
    const isSpecificQuestion = text.trim().endsWith('?') && text.trim().length > 12;

    let reply: string;
    if (isSpecificQuestion && isClarifying) {
      reply = stage.onSpecific;
    } else if (isEmpathetic) {
      reply = stage.onEmpathy;
    } else if (isClarifying) {
      reply = stage.onClarify;
    } else {
      reply = stage.fallback;
    }

    return {
      id: genId(),
      speaker: 'character',
      text: reply,
      timestamp: Date.now(),
    };
  }
}
