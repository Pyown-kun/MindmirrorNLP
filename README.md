# MindMirror

**Think Better. Speak Better.**

MindMirror is a reusable experiential-learning framework for professional communication training. The product is intentionally not centered on “an AI chatbot that analyzes communication and gives a score”. The primary journey is:

```text
EXPERIENCE → INTERACTION → SELF-RECOGNITION → REFLECTION → AHA MOMENT → PRACTICAL TAKEAWAY
```

Participants first experience a realistic situation, interact with it, look back at their own words, reflect, identify an insight, and leave with a practical action. Numeric communication indicators remain available only as secondary training signals.

## Architecture

```text
MINDMIRROR PLATFORM
├── EXPERIENCE ENGINE
│   ├── Navigation / session flow
│   ├── Scenario rendering
│   ├── Roleplay interaction
│   ├── Reflection comparison
│   └── Aha-moment support
│
└── CURRICULUM ENGINE
    ├── Modules
    ├── Scenarios / characters
    ├── Interaction stages
    ├── Pattern rules
    ├── Reflection questions
    ├── Aha prompts
    └── Practical takeaways
```

The engine is reusable; curriculum data is replaceable.

## Project structure

```text
src/
├── curriculum/
│   ├── curriculum.types.ts
│   └── modules/
│       └── index.ts                 # curriculum configuration
├── engine/
│   ├── ExperienceEngine.ts          # scenario + interaction engine
│   ├── ReflectionEngine.ts          # before/after comparison
│   └── AhaMomentEngine.ts           # self-recognition support
├── services/ai/
│   ├── AIService.ts                 # abstraction interfaces
│   ├── SimpleAnalysisService.ts     # offline rule-based analysis
│   ├── SimpleRoleplayService.ts     # curriculum-driven roleplay
│   └── index.ts                     # implementation swap point
├── pages/
│   ├── TrainingSelection.tsx        # Experience Library
│   ├── ModuleIntro.tsx
│   ├── Roleplay.tsx
│   ├── LookBack.tsx
│   ├── Reflection.tsx
│   ├── AhaMoment.tsx
│   ├── Takeaway.tsx
│   └── ResultDetails.tsx             # optional skill indicators
├── types/training.ts
├── locales/en.ts / id.ts / nl.ts
└── App.tsx
```

## Learning flow

```text
WELCOME
  ↓
NAME
  ↓
EXPERIENCE LIBRARY
  ↓
MODULE INTRODUCTION
  ↓
MODULE SCENARIO
  ↓
ROLEPLAY / RESPONSE
  ↓
LOOK BACK
  ↓
REFLECTION
  ↓
AHA MOMENT
  ↓
PRACTICAL TAKEAWAY
  ↓
OPTIONAL SKILL INSIGHTS
  ↓
COMPLETE
```

Patterns are deliberately not taught as definitions before the interaction. The participant sees the pattern emerge through the conversation and only then reflects on it.

## How to add a new curriculum module

Open `src/curriculum/modules/index.ts` and add another `CurriculumModule` configuration. A module defines:

1. `id`, title, description, learning objective, category, difficulty and duration.
2. `scenario` — title, context, characters and opening message.
3. `interaction.stages` — prompts, expected interaction types and reactive replies.
4. `patternRules` — language-specific keyword groups and detection mode.
5. `reflection` — reflection questions and comparison prompts.
6. `ahaMoment` — trigger, participant prompt and educational insight.
7. `takeaway` — practical challenge and real-world prompt.

Every localized text field contains `en`, `id`, and `nl`, so the same engine can render all supported languages.

The intended workflow is:

```text
NEW CURRICULUM CONTENT
        ↓
MODULE CONFIGURATION
        ↓
EXPERIENCE ENGINE
        ↓
NEW LEARNING EXPERIENCE
```

No core page needs to be rewritten for a normal new module.

## Current sample curriculum

- **Language & Specificity** — broad statements become concrete through questioning.
- **Perspective & Reframing** — participants separate observable behavior from labels and assumptions.
- **New Module** — an intentionally unavailable template demonstrating where future curriculum content can be configured.

The previous “Give Feedback” concept is no longer the top-level architecture. Communication scenarios can exist inside modules.

## Simple AI Analysis

The demo remains fully offline and uses `SimpleAnalysisService`. It supports:

- pattern detection;
- interaction comparison;
- reflection support;
- aha-moment support;
- practical-takeaway support;
- secondary communication indicators.

The pattern detector uses transparent language-specific rules. It is an educational heuristic, not a scientific or psychological measurement.

The existing AI abstraction remains in `src/services/ai/AIService.ts`, so a future OpenAI, Claude, Gemini, or local-model implementation can replace the simple service without changing the experience pages.

## Language system

English, Bahasa Indonesia, and Nederlands are supported throughout the revised experience. Curriculum content is localized in the curriculum data itself; UI labels remain in the locale files.

## Responsive design

The existing mobile-first Tailwind styling is preserved. The revised experience uses responsive grids and stacked comparison cards so that long translated content remains readable on mobile, tablet, laptop and desktop widths without horizontal overflow.

## Installation & running

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

No external API key or backend is required for the demo.

## Important implementation decisions

- Existing React + TypeScript + Vite + Tailwind stack is preserved.
- Existing session, language, privacy, roleplay, responsive UI and scoring capabilities are reused.
- The experience flow no longer asks the participant to enter `Who are you talking to? / What happened?` or `What is your first thought about this person?`; the module scenario supplies the context and the participant's first roleplay response becomes the baseline for later reflection.
- Scores are shown only after the participant has reached the reflection, aha moment and practical takeaway.
- Curriculum data owns module-specific content, while the engine owns reusable behavior.

## Admin / Curriculum Management Portal

MindMirror now includes a CMS-style Admin Portal at `/admin` with a login gate. It turns curriculum authoring from a developer-only JSON/TypeScript workflow into a trainer-facing content workflow:

`Admin Dashboard → Create/Edit Module → Preview → Save Draft / Publish → Participant Experience Library`

The builder covers Basic Information, Scenario, Interaction Stages, Pattern Rules, Reflection, Aha Moment, Takeaway, and Review & Publish. English, Bahasa Indonesia, and Nederlands can be authored independently.

### MVP persistence

For the demo, curriculum management uses browser `localStorage` as a mock database. Published modules are automatically read by the participant Experience Library, while drafts remain unavailable to participants. This keeps the demo self-contained and requires no external API.

### Adding a curriculum module

1. Open `/admin`.
2. Sign in with the demo admin account (`admin@mindmirror.demo` / `mindmirror`).
3. Open the Admin / Curriculum Portal.
2. Select **Create New Module**.
3. Fill localized content for English, Indonesia, and Nederlands.
4. Define the scenario and characters.
5. Add interaction stages and response branches.
6. Configure pattern rules and keywords.
7. Add reflection questions and comparison prompts.
8. Define the Aha Moment prompt and insight.
9. Define the practical takeaway.
10. Preview the experience.
11. Save as Draft or Publish.

Publishing makes the module available in the participant Training Library without changing the core Experience Engine.


## Admin Login

The CMS is available at `/admin`. Users are shown an Admin Sign In screen before the dashboard is rendered.

For the demo, authentication is stored in `sessionStorage` and uses:

- Email: `admin@mindmirror.demo`
- Password: `mindmirror`

This is intentionally a local demo authentication layer. A production deployment should replace it with a secure backend or identity provider.

After successful login, the user is redirected/reloaded into the Admin Dashboard. Signing out removes the admin session and returns to the participant application.
