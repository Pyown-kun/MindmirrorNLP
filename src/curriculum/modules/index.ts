import type { CurriculumModule, Language, LocalizedText, CurriculumStage } from '../../types/training';
import { PATTERN_KEYWORDS } from '../../utils/analysisRules';

const tx = (en: string, id: string, nl: string): LocalizedText => ({ en, id, nl });
const list = (en: string[], id: string[], nl: string[]) => ({ en, id, nl });

const commonStages: { language: CurriculumStage[]; perspective: CurriculumStage[] } = {
  language: [
    {
      prompt: tx('Ask what happened in one concrete instance.', 'Tanyakan apa yang terjadi dalam satu kejadian konkret.', 'Vraag wat er in één concreet geval gebeurde.'),
      expectedInteractionTypes: ['clarify', 'specific'],
      replies: {
        clarify: tx('Yesterday, my manager interrupted me during the meeting.', 'Kemarin, manajer saya menyela saya saat rapat.', 'Gisteren onderbrak mijn manager me tijdens de vergadering.'),
        empathy: tx('It was frustrating because I felt I could not finish my point.', 'Itu membuat frustrasi karena saya merasa tidak bisa menyelesaikan penjelasan saya.', 'Het was frustrerend omdat ik mijn punt niet kon afmaken.'),
        specific: tx('It happened during the client update around the project timeline.', 'Itu terjadi saat pembaruan klien tentang jadwal proyek.', 'Het gebeurde tijdens de update aan de klant over de projectplanning.'),
        fallback: tx('There is one meeting that stands out. What would you like to know about it?', 'Ada satu rapat yang paling menonjol. Apa yang ingin Anda ketahui?', 'Er is één vergadering die eruit springt. Wat wil je erover weten?'),
      },
    },
    {
      prompt: tx('Explore the observable details before interpreting them.', 'Gali detail yang dapat diamati sebelum menafsirkannya.', 'Verken de waarneembare details voordat je ze interpreteert.'),
      expectedInteractionTypes: ['clarify', 'empathy', 'specific'],
      replies: {
        clarify: tx('I had prepared three points, but we only discussed the first one.', 'Saya menyiapkan tiga poin, tetapi kami hanya membahas poin pertama.', 'Ik had drie punten voorbereid, maar we bespraken alleen het eerste.'),
        empathy: tx('Thanks for asking instead of assuming what I meant.', 'Terima kasih sudah bertanya daripada langsung berasumsi.', 'Bedankt dat je het vraagt in plaats van aan te nemen wat ik bedoelde.'),
        specific: tx('The interruption happened just before I explained the risk to the client.', 'Penyelaan terjadi tepat sebelum saya menjelaskan risiko kepada klien.', 'De onderbreking kwam vlak voordat ik het risico aan de klant uitlegde.'),
        fallback: tx('The details are easier to see when we focus on the specific moment.', 'Detailnya lebih mudah terlihat ketika kita fokus pada momen tertentu.', 'De details worden duidelijker als we ons op het specifieke moment richten.'),
      },
    },
  ],
  perspective: [
    {
      prompt: tx('Notice the difference between a label and what you can actually observe.', 'Perhatikan perbedaan antara label dan hal yang benar-benar dapat Anda amati.', 'Let op het verschil tussen een label en wat je werkelijk kunt waarnemen.'),
      expectedInteractionTypes: ['clarify', 'specific'],
      replies: {
        clarify: tx('I missed two deadlines last month because I underestimated the handover work.', 'Saya melewatkan dua tenggat bulan lalu karena meremehkan pekerjaan serah terima.', 'Ik miste vorige maand twee deadlines omdat ik het overdrachtswerk onderschatte.'),
        empathy: tx('I appreciate being asked what is getting in the way.', 'Saya menghargai ketika ditanya apa yang menjadi kendala.', 'Ik waardeer het dat je vraagt wat me in de weg zit.'),
        specific: tx('The latest delay was on the reporting task, not every task I own.', 'Keterlambatan terbaru terjadi pada tugas pelaporan, bukan semua tugas saya.', 'De laatste vertraging zat in de rapportagetaak, niet in elke taak die ik heb.'),
        fallback: tx('It helps when we separate what happened from the story we attach to it.', 'Membantu ketika kita memisahkan apa yang terjadi dari cerita yang kita kaitkan dengannya.', 'Het helpt om te scheiden wat er gebeurde van het verhaal dat we eraan koppelen.'),
      },
    },
    {
      prompt: tx('Ask before deciding why the other person acted that way.', 'Bertanyalah sebelum memutuskan mengapa orang lain bertindak seperti itu.', 'Vraag voordat je beslist waarom de ander zo handelde.'),
      expectedInteractionTypes: ['clarify', 'empathy', 'reflect'],
      replies: {
        clarify: tx('I thought I could finish it alone, but a dependency changed midweek.', 'Saya pikir bisa menyelesaikannya sendiri, tetapi ada ketergantungan yang berubah di tengah minggu.', 'Ik dacht dat ik het alleen kon afronden, maar halverwege de week veranderde een afhankelijkheid.'),
        empathy: tx('It is easier to talk about the problem when I am not being judged for it.', 'Lebih mudah membicarakan masalah ketika saya tidak langsung dinilai.', 'Het is makkelijker om over het probleem te praten als ik er niet op wordt beoordeeld.'),
        specific: tx('The dependency was an approval from another team that arrived two days late.', 'Ketergantungannya adalah persetujuan dari tim lain yang datang terlambat dua hari.', 'De afhankelijkheid was een goedkeuring van een ander team die twee dagen te laat kwam.'),
        fallback: tx('There may be more than one reason. What would you want to check first?', 'Mungkin ada lebih dari satu alasan. Apa yang ingin Anda cek terlebih dahulu?', 'Er kan meer dan één reden zijn. Wat zou je eerst willen controleren?'),
      },
    },
  ],
};

const base = (module: CurriculumModule): CurriculumModule => module;

export const curriculumModules: CurriculumModule[] = [
  base({
    id: 'language-specificity',
    title: tx('LANGUAGE & SPECIFICITY', 'BAHASA & SPESIFIKASI', 'TAAL & SPECIFICITEIT'),
    description: tx('Explore how broad statements become more useful when you make them specific.', 'Jelajahi bagaimana pernyataan luas menjadi lebih berguna ketika dibuat spesifik.', 'Ontdek hoe brede uitspraken bruikbaarder worden wanneer je ze specifieker maakt.'),
    learningObjective: tx('Experience the shift from “everyone / always” to one observable event.', 'Rasakan perubahan dari “semua orang / selalu” menuju satu kejadian yang dapat diamati.', 'Ervaar de verschuiving van “iedereen / altijd” naar één waarneembare gebeurtenis.'),
    category: tx('Language', 'Bahasa', 'Taal'), difficulty: tx('Introductory', 'Dasar', 'Introductie'), estimatedDuration: 7, available: true,
    scenario: { title: tx('A meeting that went wrong', 'Rapat yang berjalan buruk', 'Een vergadering die misliep'), context: tx('A colleague says nobody listens to them. Your task is not to fix it immediately — first, explore what happened.', 'Seorang rekan berkata tidak ada yang mau mendengarkannya. Tugas Anda bukan langsung memperbaiki — pertama, gali apa yang terjadi.', 'Een collega zegt dat niemand naar hen luistert. Je taak is niet om het meteen op te lossen — verken eerst wat er gebeurde.'), characters: [{ name: tx('Alex', 'Alex', 'Alex'), role: tx('Your colleague', 'Rekan kerja Anda', 'Je collega') }], openingMessage: tx('Nobody ever listens to me.', 'Tidak ada yang pernah mau mendengarkan saya.', 'Niemand luistert ooit naar me.') },
    interaction: { stages: commonStages.language, prompts: list(['What happened?', 'Can you give me a specific example?', 'When did this happen?'], ['Apa yang terjadi?', 'Bisa beri saya contoh spesifik?', 'Kapan ini terjadi?'], ['Wat gebeurde er?', 'Kun je een concreet voorbeeld geven?', 'Wanneer gebeurde dit?']), expectedInteractionTypes: ['clarify', 'specific'] },
    patternRules: { rules: ['generalization'], keywordGroups: PATTERN_KEYWORDS, detectionLogic: 'keyword' },
    reflection: { questions: list(['Which question helped you understand the situation better?', 'What changed when you asked for a specific example?'], ['Pertanyaan mana yang membantu Anda memahami situasi lebih baik?', 'Apa yang berubah ketika Anda meminta contoh spesifik?'], ['Welke vraag hielp je de situatie beter begrijpen?', 'Wat veranderde toen je om een concreet voorbeeld vroeg?']), comparisonPrompts: list(['Broad statement → specific event', 'Assumption → observable detail'], ['Pernyataan luas → kejadian spesifik', 'Asumsi → detail yang dapat diamati'], ['Brede uitspraak → concreet voorval', 'Aanname → waarneembaar detail']) },
    ahaMoment: { title: tx('YOUR AHA MOMENT', 'MOMEN AHA ANDA', 'JOUW AHA-MOMENT'), trigger: tx('You moved from a broad statement toward a concrete example.', 'Anda bergerak dari pernyataan luas menuju contoh konkret.', 'Je bewoog van een brede uitspraak naar een concreet voorbeeld.'), userPrompt: tx('What do you notice about your own questioning?', 'Apa yang Anda perhatikan dari cara Anda bertanya?', 'Wat valt je op aan je eigen manier van vragen?'), systemInsight: tx('Specific questions gave the conversation something real to work with.', 'Pertanyaan spesifik memberi percakapan sesuatu yang nyata untuk digali.', 'Specifieke vragen gaven het gesprek iets concreets om mee te werken.') },
    takeaway: { title: tx('TAKE THIS WITH YOU', 'BAWA PELAJARAN INI', 'NEEM DIT MEE'), practicalChallenge: tx('Before your next difficult conversation, replace one broad statement with one question about a specific event.', 'Sebelum percakapan sulit berikutnya, ganti satu pernyataan luas dengan satu pertanyaan tentang kejadian spesifik.', 'Vervang vóór je volgende lastige gesprek één brede uitspraak door één vraag over een concreet voorval.'), realWorldPrompt: tx('“What happened in the specific situation you are referring to?”', '“Apa yang terjadi dalam situasi spesifik yang Anda maksud?”', '“Wat gebeurde er in de specifieke situatie waar je naar verwijst?”') },
  }),
  base({
    id: 'perspective-reframing',
    title: tx('PERSPECTIVE & REFRAMING', 'PERSPEKTIF & REFRAMING', 'PERSPECTIEF & HERKADERING'),
    description: tx('Experience how your first interpretation can shape the conversation — and how curiosity can open another view.', 'Rasakan bagaimana interpretasi awal dapat membentuk percakapan — dan bagaimana rasa ingin tahu membuka sudut pandang lain.', 'Ervaar hoe je eerste interpretatie het gesprek kan sturen — en hoe nieuwsgierigheid een ander perspectief opent.'),
    learningObjective: tx('Separate what you observe from the meaning you attach to it.', 'Pisahkan apa yang Anda amati dari makna yang Anda berikan.', 'Scheid wat je waarneemt van de betekenis die je eraan geeft.'),
    category: tx('Perspective', 'Perspektif', 'Perspectief'), difficulty: tx('Intermediate', 'Menengah', 'Gemiddeld'), estimatedDuration: 8, available: true,
    scenario: { title: tx('A missed deadline', 'Tenggat yang terlewat', 'Een gemiste deadline'), context: tx('You are frustrated with a teammate who has missed deadlines. Notice what happens when you explore the situation instead of deciding who they are.', 'Anda frustrasi dengan rekan yang melewatkan tenggat. Perhatikan apa yang terjadi ketika Anda menggali situasi alih-alih menentukan seperti apa dirinya.', 'Je bent gefrustreerd over een collega die deadlines mist. Merk op wat er gebeurt wanneer je de situatie verkent in plaats van te beslissen wie die persoon is.'), characters: [{ name: tx('Sam', 'Sam', 'Sam'), role: tx('Your team member', 'Anggota tim Anda', 'Je teamlid') }], openingMessage: tx('I know I have missed deadlines. It probably looks like I just do not care.', 'Saya tahu saya melewatkan tenggat. Mungkin terlihat seperti saya memang tidak peduli.', 'Ik weet dat ik deadlines heb gemist. Het lijkt misschien alsof het me gewoon niet kan schelen.') },
    interaction: { stages: commonStages.perspective, prompts: list(['What made the deadline difficult?', 'What happened on the latest task?', 'What would help next time?'], ['Apa yang membuat tenggat itu sulit?', 'Apa yang terjadi pada tugas terakhir?', 'Apa yang akan membantu lain kali?'], ['Wat maakte de deadline lastig?', 'Wat gebeurde er bij de laatste taak?', 'Wat zou de volgende keer helpen?']), expectedInteractionTypes: ['clarify', 'empathy', 'specific'] },
    patternRules: { rules: ['judgment', 'assumption'], keywordGroups: PATTERN_KEYWORDS, detectionLogic: 'keyword' },
    reflection: { questions: list(['Where did you notice yourself separating the person from the behavior?', 'What became possible when you asked before assuming?'], ['Di mana Anda melihat diri Anda memisahkan orang dari perilakunya?', 'Apa yang menjadi mungkin ketika Anda bertanya sebelum berasumsi?'], ['Waar merkte je dat je de persoon van het gedrag scheidde?', 'Wat werd mogelijk toen je vroeg voordat je aannam?']), comparisonPrompts: list(['Label → observable behavior', 'Assumption → exploration'], ['Label → perilaku yang dapat diamati', 'Asumsi → eksplorasi'], ['Label → waarneembaar gedrag', 'Aanname → verkenning']) },
    ahaMoment: { title: tx('YOUR AHA MOMENT', 'MOMEN AHA ANDA', 'JOUW AHA-MOMENT'), trigger: tx('You explored circumstances before deciding what the behavior meant.', 'Anda menggali keadaan sebelum menentukan arti dari perilaku tersebut.', 'Je verkende omstandigheden voordat je bepaalde wat het gedrag betekende.'), userPrompt: tx('What do you notice about the difference between your first interpretation and your later questions?', 'Apa yang Anda perhatikan dari perbedaan interpretasi awal dan pertanyaan Anda kemudian?', 'Wat valt je op aan het verschil tussen je eerste interpretatie en je latere vragen?'), systemInsight: tx('You shifted from describing a person to exploring the situation around the behavior.', 'Anda bergeser dari menggambarkan seseorang menjadi menggali situasi di balik perilaku.', 'Je verschoof van de persoon beschrijven naar de situatie rond het gedrag verkennen.') },
    takeaway: { title: tx('TAKE THIS WITH YOU', 'BAWA PELAJARAN INI', 'NEEM DIT MEE'), practicalChallenge: tx('When a behavior triggers a label, pause and ask one question about the observable situation.', 'Ketika perilaku memicu label, berhenti sejenak dan ajukan satu pertanyaan tentang situasi yang dapat diamati.', 'Wanneer gedrag een label oproept, pauzeer en stel één vraag over de waarneembare situatie.'), realWorldPrompt: tx('“What happened, and what do I know for sure?”', '“Apa yang terjadi, dan apa yang benar-benar saya ketahui?”', '“Wat gebeurde er, en wat weet ik zeker?”') },
  }),
  base({
    id: 'future-curriculum',
    title: tx('NEW MODULE', 'MODUL BARU', 'NIEUWE MODULE'),
    description: tx('A reusable placeholder ready to receive future curriculum content.', 'Placeholder yang dapat digunakan kembali untuk menerima konten kurikulum mendatang.', 'Een herbruikbare placeholder die klaar is voor toekomstige curriculuminhoud.'),
    learningObjective: tx('Demonstrate that a new learning experience can be added through curriculum configuration.', 'Mendemonstrasikan bahwa pengalaman belajar baru dapat ditambahkan melalui konfigurasi kurikulum.', 'Demonstreren dat een nieuwe leerervaring via curriculumconfiguratie kan worden toegevoegd.'),
    category: tx('Template', 'Template', 'Sjabloon'), difficulty: tx('Configurable', 'Dapat dikonfigurasi', 'Configureerbaar'), estimatedDuration: 5, available: false,
    scenario: { title: tx('Future scenario', 'Skenario mendatang', 'Toekomstig scenario'), context: tx('This module is a template. Replace its curriculum data to create a new experience without changing the engine.', 'Modul ini adalah template. Ganti data kurikulumnya untuk membuat pengalaman baru tanpa mengubah engine.', 'Deze module is een sjabloon. Vervang de curriculumdata om een nieuwe ervaring te maken zonder de engine te wijzigen.'), characters: [{ name: tx('Character', 'Karakter', 'Personage'), role: tx('Future participant', 'Peserta mendatang', 'Toekomstige deelnemer') }], openingMessage: tx('This is where a future curriculum scenario begins.', 'Di sinilah skenario kurikulum mendatang dimulai.', 'Hier begint een toekomstig curriculumscenario.') },
    interaction: { stages: commonStages.language, prompts: list(['Add a curriculum prompt here.'], ['Tambahkan prompt kurikulum di sini.'], ['Voeg hier een curriculumvraag toe.']), expectedInteractionTypes: ['reflect'] },
    patternRules: { rules: ['generalization', 'judgment', 'assumption'], keywordGroups: PATTERN_KEYWORDS, detectionLogic: 'hybrid' },
    reflection: { questions: list(['What did you notice in your interaction?'], ['Apa yang Anda perhatikan dalam interaksi Anda?'], ['Wat viel je op in je interactie?']), comparisonPrompts: list(['Replace these prompts with curriculum-specific comparisons.'], ['Ganti prompt ini dengan perbandingan khusus kurikulum.'], ['Vervang deze prompt door curriculum-specifieke vergelijkingen.']) },
    ahaMoment: { title: tx('YOUR AHA MOMENT', 'MOMEN AHA ANDA', 'JOUW AHA-MOMENT'), trigger: tx('This template becomes meaningful when future curriculum data is supplied.', 'Template ini menjadi bermakna ketika data kurikulum mendatang ditambahkan.', 'Dit sjabloon wordt betekenisvol wanneer toekomstige curriculumdata wordt toegevoegd.'), userPrompt: tx('What would you want participants to notice?', 'Apa yang ingin Anda peserta sadari?', 'Wat wil je dat deelnemers opmerken?'), systemInsight: tx('The engine is ready to turn curriculum content into an experience.', 'Engine siap mengubah konten kurikulum menjadi pengalaman.', 'De engine is klaar om curriculuminhoud in een ervaring om te zetten.') },
    takeaway: { title: tx('TAKE THIS WITH YOU', 'BAWA PELAJARAN INI', 'NEEM DIT MEE'), practicalChallenge: tx('Replace this takeaway with a module-specific real-world practice.', 'Ganti takeaway ini dengan praktik dunia nyata khusus modul.', 'Vervang deze takeaway door een modulespecifieke praktijk.'), realWorldPrompt: tx('Add the real-world prompt here.', 'Tambahkan prompt dunia nyata di sini.', 'Voeg hier de praktijkvraag toe.') },
  }),
];

export const getCurriculumModule = (id: string | null): CurriculumModule => curriculumModules.find((m) => m.id === id) ?? curriculumModules[0];
export const localize = (value: LocalizedText, language: Language) => value[language] || value.en;
