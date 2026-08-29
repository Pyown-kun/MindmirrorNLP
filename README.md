# MindMirror

**Think Better. Speak Better.**

MindMirror is an interactive communication-training demo inspired by NLP
(Neuro-Linguistic Programming) reflection concepts. It turns a communication
training session into a short, structured, and practical digital experience:

```
REFLECT → REFRAME → ROLEPLAY → ANALYSIS → RESULT
```

Built as a hackathon prototype, MindMirror runs **entirely offline** — no
external AI API key is required. All "AI" behavior (mindset analysis,
roleplay responses, communication scoring) is powered by a transparent,
rule-based engine, designed behind a clean interface so it can be swapped
for a real LLM later without touching any page or component.

---

## Features

- **16-step guided flow**: Welcome → Name → Training Selection → Situation →
  Mirror (emotion) → Initial Thought → Mindset Analysis → Reframe →
  Perspective Shift → Roleplay → Analyzing → Result → Skill Breakdown →
  NLP Insights → Before/After Journey → Training Complete.
- **Simple AI Analysis Engine**: rule-based detection of generalizations,
  judgments/labels, and mind-reading assumptions, in three languages.
- **Simple Roleplay Engine**: a scripted-but-reactive conversation partner
  ("Alex") that responds differently to clarifying questions, empathetic
  language, and specific follow-ups, with sensible fallbacks for anything
  else the user types.
- **Transparent scoring**: Empathy, Specificity, Clarity, NLP Practice, and
  Self-Awareness scores (0–100) computed from what the user actually wrote
  and did — no hidden/fake numbers.
- **Full trilingual support**: English 🇬🇧, Bahasa Indonesia 🇮🇩, and
  Nederlands 🇳🇱 — every screen, button, question, and generated result.
- **Fully responsive**: mobile-first layout, tested conceptually from
  375px up to 1440px, with a compact stepper on mobile and a horizontal
  stepper on desktop.
- **Extensible AI architecture**: `AIAnalysisService` and `RoleplayService`
  interfaces so future OpenAI / Claude / Gemini / local-LLM implementations
  can be dropped in with a one-line swap.

---

## Technology Stack

| Layer          | Choice                                   |
|----------------|-------------------------------------------|
| Framework      | React 19 + TypeScript                     |
| Build tool     | Vite                                      |
| Styling        | Tailwind CSS v4                           |
| Icons          | lucide-react                              |
| State          | React Context (`LanguageContext`, `TrainingContext`) |
| AI Engine      | Custom rule-based `SimpleAnalysisService` / `SimpleRoleplayService` |

No backend, database, or API key is required for the demo.

---

## Installation & Running

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── ui/                    # Button, MirrorPane, Fields (Input/TextArea)
│   ├── layout/PageShell.tsx   # Shared header + stepper + centered content
│   ├── LanguageSelector.tsx
│   ├── ProgressStepper.tsx
│   ├── ProgressBar.tsx
│   ├── TrainingCard.tsx
│   ├── AnalysisCard.tsx
│   ├── RoleplayChat.tsx
│   └── ScoreCard.tsx
│
├── pages/
│   ├── Welcome.tsx
│   ├── NameInput.tsx
│   ├── TrainingSelection.tsx
│   ├── SituationInput.tsx
│   ├── MirrorPhase.tsx
│   ├── InitialThought.tsx
│   ├── Analysis.tsx
│   ├── Reframe.tsx
│   ├── PerspectiveShift.tsx
│   ├── Roleplay.tsx
│   ├── Analyzing.tsx
│   ├── TrainingResult.tsx
│   ├── ResultDetails.tsx
│   ├── NLPInsights.tsx
│   ├── BeforeAfter.tsx
│   └── TrainingComplete.tsx
│
├── services/ai/
│   ├── AIService.ts            # AIAnalysisService & RoleplayService interfaces
│   ├── SimpleAnalysisService.ts
│   ├── SimpleRoleplayService.ts
│   └── index.ts                 # Active-implementation factory (swap point)
│
├── locales/
│   ├── en.ts / id.ts / nl.ts
│   └── index.ts
│
├── context/
│   ├── LanguageContext.tsx
│   └── TrainingContext.tsx
│
├── types/training.ts            # TrainingSession & related domain types
├── utils/
│   ├── analysisRules.ts         # Keyword tables per language
│   └── scoring.ts                # Score blending + insight selection
└── App.tsx
```

---

## The Simple AI Analysis Engine

The engine is rule-based, transparent, and requires no external model:

1. **Mindset analysis** (`analyzeMindset`) scans the user's free-text
   "first thought" for three pattern types, using per-language keyword
   lists in `utils/analysisRules.ts`:
   - **Generalization** — "always", "never", "everyone"… (`selalu`,
     `tidak pernah`… / `altijd`, `nooit`…)
   - **Judgment / Labeling** — "lazy", "stupid", "doesn't care"… (`malas`,
     `bodoh`… / `lui`, `dom`…)
   - **Assumption / Mind Reading** — "he thinks", "obviously"… (`dia
     pikir`, `pasti`… / `hij denkt`, `duidelijk`…)

   Each match is attributed to the sentence it came from and shown as an
   `AnalysisCard` with an explanation and improvement tip. If nothing is
   detected, the user gets positive, non-judgmental feedback instead.

2. **Conversation analysis** (`analyzeConversation`) looks at the user's
   roleplay messages and computes five 0–100 scores from measurable
   signals: presence of empathy language, clarifying questions, average
   sentence length / question usage, avoidance of generalizations and
   labels, and completion of the earlier reflection/reframe steps
   (blended in `utils/scoring.ts`). Nothing here is a psychological
   diagnosis — it is a communication-training heuristic, and the UI is
   careful to say so.

3. **Roleplay logic** (`SimpleRoleplayService`) matches the user's message
   against clarifying/empathy keyword lists and picks from four
   predefined conversation stages per language, with a graceful fallback
   line if nothing matches.

---

## Replacing the Simple Engine with a Real AI Model

The app depends only on two interfaces, defined in
`src/services/ai/AIService.ts`:

```typescript
interface AIAnalysisService {
  analyzeMindset(input: AnalysisInput): AnalysisResult;
  analyzeConversation(messages: RoleplayMessage[], language: Language): CommunicationAnalysis;
}

interface RoleplayService {
  startScenario(context: ScenarioContext): RoleplayMessage;
  respond(context: ScenarioContext, messages: RoleplayMessage[]): RoleplayMessage;
}
```

To integrate OpenAI, Claude, Gemini, a local model (Ollama, etc.), or any
custom NLP service:

1. Create a new file, e.g. `src/services/ai/ClaudeAnalysisService.ts`,
   and implement `AIAnalysisService` by calling the real API instead of
   keyword matching (same for `RoleplayService` in a
   `ClaudeRoleplayService.ts`).
2. Open `src/services/ai/index.ts` and swap the exported instance:

   ```typescript
   // Before
   export const analysisService: AIAnalysisService = new SimpleAnalysisService();

   // After
   export const analysisService: AIAnalysisService = new ClaudeAnalysisService(apiKey);
   ```

3. Nothing else changes — every page imports `analysisService` /
   `roleplayService` from this one module, so the rest of the app is
   completely decoupled from which implementation is active.

This makes MindMirror a genuine "swap-the-engine" architecture: the
hackathon demo works fully offline today, and upgrading to a real AI
model later is a two-file change.

---

## Notes on Scope

- Only the **Give Feedback** training scenario is fully implemented for
  this MVP, per the brief. "Handle Conflict" and "Leadership Conversation"
  are shown as selectable cards marked **Coming Soon**.
- MindMirror is a communication-training tool, not a psychological,
  medical, or personality-diagnostic instrument, and its copy is written
  to avoid implying otherwise.

## Privacy & GDPR-style controls

MindMirror includes an opt-in privacy notice and local data controls:
- Training data is stored locally only after consent.
- The user's name is intentionally excluded from browser persistence.
- Stored training data expires automatically after 90 days.
- Users can open **Privasi & Data** at any time and delete stored training data.
- No profiling, advertising, or data-selling functionality is included.
- The current AI services are rule-based and run without an external API.

