import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  Eye,
  FileText,
  LayoutDashboard,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
  type LucideIcon,
} from 'lucide-react';

import type {
  CurriculumModule,
  Language,
  LocalizedList,
  LocalizedText,
  PatternType,
} from '../types/training';

import {
  cloneModule,
  createBlankModule,
  deleteManagedModule,
  getManagedModules,
  getParticipantCount,
  languageLabels,
  patternLabels,
  type CurriculumStatus,
  type ManagedCurriculum,
  upsertManagedModule,
} from '../services/curriculumStore';

import { logoutAdmin } from './AdminLogin';

/* =========================================================
   CONSTANTS & TYPES
========================================================= */

const tabs = [
  'Basic Information',
  'Scenario',
  'Interaction',
  'Pattern Rules',
  'Reflection',
  'Aha Moment',
  'Takeaway',
  'Review & Publish',
] as const;

const langs: Language[] = ['en', 'id', 'nl'];

type AdminView = 'dashboard' | 'management' | 'builder';

type AdminNavigationItem = {
  key: Exclude<AdminView, 'builder'>;
  label: string;
  icon: LucideIcon;
};

type DashboardStat = {
  value: number;
  label: string;
  icon: LucideIcon;
};

const adminNavigation: AdminNavigationItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    key: 'management',
    label: 'Curriculum Management',
    icon: FileText,
  },
];

const patternTypes: PatternType[] = [
  'generalization',
  'judgment',
  'assumption',
];

const blankLocalizedText = (): LocalizedText => ({
  en: '',
  id: '',
  nl: '',
});

const listFrom = (
  value: LocalizedList,
  lang: Language,
): string => {
  return value[lang].join('\n');
};

const setList = (
  value: LocalizedList,
  lang: Language,
  text: string,
): LocalizedList => {
  return {
    ...value,
    [lang]: text
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean),
  };
};

const setText = (
  value: LocalizedText,
  lang: Language,
  text: string,
): LocalizedText => {
  return {
    ...value,
    [lang]: text,
  };
};

/* =========================================================
   MAIN ADMIN PORTAL
========================================================= */

export const AdminPortal = () => {
  const [modules, setModules] = useState<ManagedCurriculum[]>(
    getManagedModules,
  );

  const [view, setView] = useState<AdminView>('dashboard');

  const [editing, setEditing] =
    useState<CurriculumModule | null>(null);

  const [step, setStep] = useState(0);

  const [lang, setLang] = useState<Language>('en');

  const refresh = () => {
    setModules(getManagedModules());
  };

  const openBuilder = (module?: CurriculumModule) => {
    setEditing(
      module
        ? cloneModule(module)
        : createBlankModule(),
    );

    setStep(0);
    setLang('en');
    setView('builder');
  };

  const publish = (
    module: CurriculumModule,
    status: CurriculumStatus,
  ) => {
    upsertManagedModule(module, status);
    refresh();
  };

  const stats = useMemo(
    () => ({
      total: modules.length,
      published: modules.filter(
        (module) => module.status === 'published',
      ).length,
      drafts: modules.filter(
        (module) => module.status === 'draft',
      ).length,
    }),
    [modules],
  );

  /* =======================================================
     BUILDER VIEW
  ======================================================= */

  if (view === 'builder' && editing) {
    return (
      <Builder
        module={editing}
        setModule={setEditing}
        step={step}
        setStep={setStep}
        lang={lang}
        setLang={setLang}
        onBack={() => {
          refresh();
          setView('management');
        }}
        onSave={(status) => {
          publish(editing, status);
          setView('management');
        }}
      />
    );
  }

  /* =======================================================
     ADMIN LAYOUT
  ======================================================= */

  return (
    <div className="min-h-screen bg-mist text-ink">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 px-4 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>
              <div className="font-display text-lg font-bold">
                MindMirror CMS
              </div>

              <div className="text-xs text-muted">
                Curriculum Management Portal
              </div>
            </div>
          </div>

          <button
            type="button"
            className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-mist"
            onClick={() => {
              logoutAdmin();
              window.location.href = '/';
            }}
          >
            <ArrowLeft className="mr-2 inline h-4 w-4" />
            Participant App
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-8 lg:flex-row">
        {/* SIDEBAR */}
        <aside className="lg:w-56">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col">
            {adminNavigation.map(
              ({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setView(key)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                    view === key
                      ? 'bg-primary text-white'
                      : 'bg-white text-muted hover:bg-white/70'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ),
            )}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1">
          {view === 'dashboard' ? (
            <Dashboard
              stats={stats}
              modules={modules}
              onManage={() => setView('management')}
              onCreate={() => openBuilder()}
            />
          ) : (
            <Management
              modules={modules}
              onCreate={() => openBuilder()}
              onEdit={openBuilder}
              onPublish={publish}
              onDelete={(id) => {
                deleteManagedModule(id);
                refresh();
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

/* =========================================================
   DASHBOARD
========================================================= */

const Dashboard = ({
  stats,
  modules,
  onManage,
  onCreate,
}: {
  stats: {
    total: number;
    published: number;
    drafts: number;
  };
  modules: ManagedCurriculum[];
  onManage: () => void;
  onCreate: () => void;
}) => {
  const dashboardStats: DashboardStat[] = [
    {
      value: stats.total,
      label: 'Modules',
      icon: BookOpen,
    },
    {
      value: stats.published,
      label: 'Published',
      icon: Upload,
    },
    {
      value: getParticipantCount(),
      label: 'Participants',
      icon: BarChart3,
    },
  ];

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Admin Dashboard
          </p>

          <h1 className="mt-1 font-display text-3xl font-bold">
            Welcome back, Admin
          </h1>

          <p className="mt-2 text-sm text-muted">
            Create, test and publish reusable learning
            experiences.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" />
          Create New Module
        </button>
      </div>

      {/* STATISTICS */}
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {dashboardStats.map(
          ({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
            >
              <Icon className="h-5 w-5 text-primary" />

              <div className="mt-4 font-mono-num text-3xl font-bold">
                {value}
              </div>

              <div className="text-sm text-muted">
                {label}
              </div>
            </div>
          ),
        )}
      </div>

      {/* RECENT MODULES */}
      <section className="mt-7 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold">
              Recent Modules
            </h2>

            <p className="mt-1 text-sm text-muted">
              Manage the curriculum available to
              participants.
            </p>
          </div>

          <button
            type="button"
            onClick={onManage}
            className="shrink-0 text-sm font-semibold text-primary"
          >
            View all
            <ChevronRight className="inline h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {modules.length === 0 ? (
            <EmptyModulesState onCreate={onCreate} />
          ) : (
            modules
              .slice(0, 4)
              .map((module) => (
                <ModuleRow
                  key={module.id}
                  module={module}
                />
              ))
          )}
        </div>
      </section>
    </div>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyModulesState = ({
  onCreate,
}: {
  onCreate: () => void;
}) => (
  <div className="rounded-xl border border-dashed border-black/10 p-8 text-center">
    <BookOpen className="mx-auto h-8 w-8 text-muted" />

    <h3 className="mt-3 font-semibold">
      No modules yet
    </h3>

    <p className="mt-1 text-sm text-muted">
      Create your first learning experience.
    </p>

    <button
      type="button"
      onClick={onCreate}
      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
    >
      <Plus className="h-4 w-4" />
      Create Module
    </button>
  </div>
);

/* =========================================================
   MODULE ROW
========================================================= */

const ModuleRow = ({
  module,
}: {
  module: ManagedCurriculum;
}) => (
  <div className="flex flex-col gap-3 rounded-xl border border-black/5 p-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0">
      <div className="truncate font-semibold">
        {module.title.en || 'Untitled module'}
      </div>

      <div className="mt-1 text-xs text-muted">
        {module.id} · Updated{' '}
        {new Date(
          module.updatedAt,
        ).toLocaleDateString()}
      </div>
    </div>

    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
        module.status === 'published'
          ? 'bg-aqua/10 text-aqua'
          : 'bg-amber/10 text-amber'
      }`}
    >
      {module.status === 'published'
        ? 'Published'
        : 'Draft'}
    </span>
  </div>
);

/* =========================================================
   MANAGEMENT
========================================================= */

const Management = ({
  modules,
  onCreate,
  onEdit,
  onPublish,
  onDelete,
}: {
  modules: ManagedCurriculum[];
  onCreate: () => void;
  onEdit: (module: CurriculumModule) => void;
  onPublish: (
    module: CurriculumModule,
    status: CurriculumStatus,
  ) => void;
  onDelete: (id: string) => void;
}) => {
  const [preview, setPreview] =
    useState<CurriculumModule | null>(null);

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Curriculum Management
          </p>

          <h1 className="mt-1 font-display text-3xl font-bold">
            Learning Experiences
          </h1>

          <p className="mt-2 text-sm text-muted">
            One place to author, preview and publish
            curriculum.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white"
        >
          <Plus className="h-4 w-4" />
          Create New Module
        </button>
      </div>

      {/* MODULE LIST */}
      <div className="mt-7 grid gap-4">
        {modules.length === 0 ? (
          <EmptyModulesState onCreate={onCreate} />
        ) : (
          modules.map((module) => (
            <div
              key={module.id}
              className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* INFORMATION */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-bold">
                      {module.title.en ||
                        'Untitled module'}
                    </h2>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        module.status ===
                        'published'
                          ? 'bg-aqua/10 text-aqua'
                          : 'bg-amber/10 text-amber'
                      }`}
                    >
                      {module.status}
                    </span>
                  </div>

                  <p className="mt-1 line-clamp-2 text-sm text-muted">
                    {module.description.en ||
                      'No description yet.'}
                  </p>

                  <div className="mt-3 text-xs text-muted">
                    {module.scenario.characters.length}{' '}
                    character
                    {module.scenario.characters
                      .length !== 1
                      ? 's'
                      : ''}{' '}
                    ·{' '}
                    {
                      module.interaction.stages
                        .length
                    }{' '}
                    interaction stages ·{' '}
                    {module.estimatedDuration} min
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold transition hover:bg-mist"
                    onClick={() => onEdit(module)}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold transition hover:bg-mist"
                    onClick={() => setPreview(module)}
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                    onClick={() =>
                      onPublish(
                        module,
                        module.status ===
                          'published'
                          ? 'draft'
                          : 'published',
                      )
                    }
                  >
                    {module.status ===
                    'published'
                      ? 'Unpublish'
                      : 'Publish'}
                  </button>

                  <button
                    type="button"
                    className="rounded-lg p-2 text-rose transition hover:bg-rose/10"
                    title="Delete module"
                    aria-label="Delete module"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Delete this module?',
                        )
                      ) {
                        onDelete(module.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PREVIEW */}
      {preview && (
        <PreviewModal
          module={preview}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
};

/* =========================================================
   PREVIEW MODAL
========================================================= */

const PreviewModal = ({
  module,
  onClose,
}: {
  module: CurriculumModule;
  onClose: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Experience Preview"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Experience Preview
            </p>

            <h2 className="mt-1 font-display text-2xl font-bold">
              {module.title.en ||
                'Untitled module'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted hover:bg-mist"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {/* SCENARIO */}
          <div className="rounded-xl bg-mist p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-muted">
              Scenario
            </div>

            <div className="mt-1 font-semibold">
              {module.scenario.title.en ||
                'No scenario title'}
            </div>

            <p className="mt-2 text-sm text-muted">
              {module.scenario.context.en ||
                'No context configured.'}
            </p>

            {module.scenario.openingMessage
              .en && (
              <div className="mt-3 rounded-lg bg-white p-3 text-sm">
                “
                {
                  module.scenario
                    .openingMessage.en
                }
                ”
              </div>
            )}
          </div>

          {/* CHARACTERS */}
          {module.scenario.characters.length >
            0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-muted">
                Characters
              </div>

              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {module.scenario.characters.map(
                  (character, index) => (
                    <div
                      key={`${character.name.en}-${index}`}
                      className="rounded-lg border border-black/5 p-3"
                    >
                      <div className="font-semibold">
                        {character.name.en ||
                          `Character ${
                            index + 1
                          }`}
                      </div>

                      <div className="mt-1 text-xs text-muted">
                        {character.role.en ||
                          'No role configured'}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {/* INTERACTION */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-muted">
              Interaction Flow
            </div>

            <div className="mt-2 space-y-2">
              {module.interaction.stages
                .length === 0 ? (
                <div className="rounded-lg border border-dashed border-black/10 p-4 text-sm text-muted">
                  No interaction stages
                  configured.
                </div>
              ) : (
                module.interaction.stages.map(
                  (stage, index) => (
                    <div
                      key={`stage-${index}`}
                      className="rounded-lg border border-black/5 p-3 text-sm"
                    >
                      <b>Stage {index + 1}</b>

                      <div className="mt-1">
                        {stage.prompt.en ||
                          'No prompt configured.'}
                      </div>
                    </div>
                  ),
                )
              )}
            </div>
          </div>

          {/* REFLECTION + AHA */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-black/5 p-4">
              <b>Reflection</b>

              <p className="mt-2 text-sm text-muted">
                {module.reflection.questions
                  .en[0] ||
                  'No question configured.'}
              </p>
            </div>

            <div className="rounded-xl border border-black/5 p-4">
              <b>Aha Moment</b>

              <p className="mt-2 text-sm text-muted">
                {module.ahaMoment.userPrompt
                  .en ||
                  'No prompt configured.'}
              </p>
            </div>
          </div>

          {/* TAKEAWAY */}
          <div className="rounded-xl bg-primary/5 p-4">
            <b>Takeaway</b>

            <p className="mt-2 text-sm text-muted">
              {module.takeaway.practicalChallenge
                .en ||
                'No takeaway configured.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   BUILDER
========================================================= */

function Builder({
  module,
  setModule,
  step,
  setStep,
  lang,
  setLang,
  onBack,
  onSave,
}: {
  module: CurriculumModule;
  setModule: (module: CurriculumModule) => void;
  step: number;
  setStep: (step: number) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onBack: () => void;
  onSave: (status: CurriculumStatus) => void;
}) {
  /* =======================================================
     GENERIC UPDATE HELPERS
  ======================================================= */

  const update = (
    patch: Partial<CurriculumModule>,
  ) => {
    setModule({
      ...module,
      ...patch,
    });
  };

  const updateScenario = (
    patch: Partial<CurriculumModule['scenario']>,
  ) => {
    update({
      scenario: {
        ...module.scenario,
        ...patch,
      },
    });
  };

  const updateInteraction = (
    patch: Partial<CurriculumModule['interaction']>,
  ) => {
    update({
      interaction: {
        ...module.interaction,
        ...patch,
      },
    });
  };

  const updateReflection = (
    patch: Partial<CurriculumModule['reflection']>,
  ) => {
    update({
      reflection: {
        ...module.reflection,
        ...patch,
      },
    });
  };

  const updateAha = (
    patch: Partial<CurriculumModule['ahaMoment']>,
  ) => {
    update({
      ahaMoment: {
        ...module.ahaMoment,
        ...patch,
      },
    });
  };

  const updateTakeaway = (
    patch: Partial<CurriculumModule['takeaway']>,
  ) => {
    update({
      takeaway: {
        ...module.takeaway,
        ...patch,
      },
    });
  };

  /* =======================================================
     FIELD HELPERS
  ======================================================= */

  const textField = (
    label: string,
    value: LocalizedText,
    onChange: (value: LocalizedText) => void,
  ) => (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">
        {label}
      </span>

      <input
        type="text"
        value={value[lang]}
        onChange={(event) =>
          onChange(
            setText(
              value,
              lang,
              event.target.value,
            ),
          )
        }
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
      />
    </label>
  );

  const textArea = (
    label: string,
    value: LocalizedText,
    onChange: (value: LocalizedText) => void,
  ) => (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">
        {label}
      </span>

      <textarea
        rows={4}
        value={value[lang]}
        onChange={(event) =>
          onChange(
            setText(
              value,
              lang,
              event.target.value,
            ),
          )
        }
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
      />
    </label>
  );

  const listArea = (
    label: string,
    value: LocalizedList,
    onChange: (value: LocalizedList) => void,
  ) => (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">
        {label}{' '}
        <span className="font-normal text-muted">
          (one per line)
        </span>
      </span>

      <textarea
        rows={4}
        value={listFrom(value, lang)}
        onChange={(event) =>
          onChange(
            setList(
              value,
              lang,
              event.target.value,
            ),
          )
        }
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary"
      />
    </label>
  );

  /* =======================================================
     ADD CHARACTER
  ======================================================= */

  const addCharacter = () => {
    updateScenario({
      characters: [
        ...module.scenario.characters,
        {
          name: blankLocalizedText(),
          role: blankLocalizedText(),
        },
      ],
    });
  };

  const removeCharacter = (
    index: number,
  ) => {
    updateScenario({
      characters:
        module.scenario.characters.filter(
          (_, characterIndex) =>
            characterIndex !== index,
        ),
    });
  };

  /* =======================================================
     ADD INTERACTION STAGE
  ======================================================= */

  const addInteractionStage = () => {
    updateInteraction({
      stages: [
        ...module.interaction.stages,
        {
          prompt: blankLocalizedText(),
          expectedInteractionTypes: [
            'clarify',
          ],
          replies: {
            clarify: blankLocalizedText(),
            empathy: blankLocalizedText(),
            specific: blankLocalizedText(),
            fallback: blankLocalizedText(),
          },
        },
      ],
    });
  };

  const removeInteractionStage = (
    index: number,
  ) => {
    updateInteraction({
      stages:
        module.interaction.stages.filter(
          (_, stageIndex) =>
            stageIndex !== index,
        ),
    });
  };

  /* =======================================================
     CONTENT
  ======================================================= */

  const content = () => {
    /* -----------------------------------------------------
       STEP 0 - BASIC INFORMATION
    ----------------------------------------------------- */

    if (step === 0) {
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          {textField(
            'Module Title',
            module.title,
            (value) =>
              update({
                title: value,
              }),
          )}

          {textField(
            'Category',
            module.category,
            (value) =>
              update({
                category: value,
              }),
          )}

          <div className="sm:col-span-2">
            {textArea(
              'Description',
              module.description,
              (value) =>
                update({
                  description: value,
                }),
            )}
          </div>

          <div className="sm:col-span-2">
            {textArea(
              'Learning Objective',
              module.learningObjective,
              (value) =>
                update({
                  learningObjective: value,
                }),
            )}
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold">
              Estimated Duration
              (minutes)
            </span>

            <input
              type="number"
              min={1}
              value={module.estimatedDuration}
              onChange={(event) => {
                const value =
                  Number(
                    event.target.value,
                  );

                update({
                  estimatedDuration:
                    Number.isFinite(
                      value,
                    ) && value > 0
                      ? value
                      : 1,
                });
              }}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-primary"
            />
          </label>

          {textField(
            'Difficulty',
            module.difficulty,
            (value) =>
              update({
                difficulty: value,
              }),
          )}
        </div>
      );
    }

    /* -----------------------------------------------------
       STEP 1 - SCENARIO
    ----------------------------------------------------- */

    if (step === 1) {
      return (
        <div className="space-y-5">
          {textField(
            'Scenario Title',
            module.scenario.title,
            (value) =>
              updateScenario({
                title: value,
              }),
          )}

          {textArea(
            'Context',
            module.scenario.context,
            (value) =>
              updateScenario({
                context: value,
              }),
          )}

          {textArea(
            'Opening Message',
            module.scenario.openingMessage,
            (value) =>
              updateScenario({
                openingMessage: value,
              }),
          )}

          <div className="rounded-xl border border-black/5 bg-mist p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <b>Characters</b>

                <p className="mt-1 text-xs text-muted">
                  Define the characters
                  involved in this
                  learning scenario.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center text-sm font-semibold text-primary"
                onClick={addCharacter}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Character
              </button>
            </div>

            {module.scenario.characters
              .length === 0 ? (
              <div className="rounded-xl border border-dashed border-black/10 bg-white p-5 text-center text-sm text-muted">
                No characters added.
              </div>
            ) : (
              module.scenario.characters.map(
                (
                  character,
                  index,
                ) => (
                  <div
                    key={`character-${index}`}
                    className="mb-4 rounded-xl bg-white p-4 last:mb-0"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <b className="text-sm">
                        Character{' '}
                        {index + 1}
                      </b>

                      <button
                        type="button"
                        onClick={() =>
                          removeCharacter(
                            index,
                          )
                        }
                        className="rounded-lg p-2 text-rose hover:bg-rose/10"
                        aria-label={`Remove character ${
                          index + 1
                        }`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {textField(
                        'Name',
                        character.name,
                        (value) => {
                          const characters =
                            [
                              ...module
                                .scenario
                                .characters,
                            ];

                          characters[
                            index
                          ] = {
                            ...character,
                            name: value,
                          };

                          updateScenario({
                            characters,
                          });
                        },
                      )}

                      {textField(
                        'Role',
                        character.role,
                        (value) => {
                          const characters =
                            [
                              ...module
                                .scenario
                                .characters,
                            ];

                          characters[
                            index
                          ] = {
                            ...character,
                            role: value,
                          };

                          updateScenario({
                            characters,
                          });
                        },
                      )}
                    </div>
                  </div>
                ),
              )
            )}
          </div>
        </div>
      );
    }

    /* -----------------------------------------------------
       STEP 2 - INTERACTION
    ----------------------------------------------------- */

    if (step === 2) {
      return (
        <div className="space-y-5">
          {listArea(
            'Interaction Prompts',
            module.interaction.prompts,
            (value) =>
              updateInteraction({
                prompts: value,
              }),
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-lg font-bold">
                Interaction Stages
              </h3>

              <p className="mt-1 text-xs text-muted">
                Configure how the
                experience responds to
                participant input.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center text-sm font-semibold text-primary"
              onClick={
                addInteractionStage
              }
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Stage
            </button>
          </div>

          {module.interaction.stages
            .length === 0 ? (
            <div className="rounded-xl border border-dashed border-black/10 p-6 text-center text-sm text-muted">
              No interaction stages
              configured.
            </div>
          ) : (
            module.interaction.stages.map(
              (stage, index) => (
                <div
                  key={`interaction-stage-${index}`}
                  className="rounded-xl border border-black/10 bg-white p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <b>
                        Stage{' '}
                        {index + 1}
                      </b>

                      <p className="mt-1 text-xs text-muted">
                        Configure prompt
                        and response
                        behavior.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeInteractionStage(
                          index,
                        )
                      }
                      className="rounded-lg p-2 text-rose hover:bg-rose/10"
                      aria-label={`Remove stage ${
                        index + 1
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {textArea(
                    'Prompt',
                    stage.prompt,
                    (value) => {
                      const stages =
                        [
                          ...module
                            .interaction
                            .stages,
                        ];

                      stages[index] = {
                        ...stage,
                        prompt:
                          value,
                      };

                      updateInteraction({
                        stages,
                      });
                    },
                  )}

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {(
                      [
                        'clarify',
                        'empathy',
                        'specific',
                        'fallback',
                      ] as const
                    ).map(
                      (type) => (
                        <div key={type}>
                          {textArea(
                            `${type
                              .charAt(
                                0,
                              )
                              .toUpperCase()}${type.slice(
                              1,
                            )} Reply`,
                            stage.replies[
                              type
                            ],
                            (value) => {
                              const stages =
                                [
                                  ...module
                                    .interaction
                                    .stages,
                                ];

                              stages[
                                index
                              ] = {
                                ...stage,
                                replies:
                                  {
                                    ...stage.replies,
                                    [type]:
                                      value,
                                  },
                              };

                              updateInteraction({
                                stages,
                              });
                            },
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ),
            )
          )}
        </div>
      );
    }

    /* -----------------------------------------------------
       STEP 3 - PATTERN RULES
    ----------------------------------------------------- */

    if (step === 3) {
      return (
        <div className="space-y-5">
          {/* PATTERN TYPES */}
          <div>
            <h3 className="font-display text-lg font-bold">
              Pattern Types
            </h3>

            <p className="mt-1 text-sm text-muted">
              Select the cognitive patterns
              that this module should detect.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {patternTypes.map(
              (pattern) => {
                const checked =
                  module.patternRules.rules.includes(
                    pattern,
                  );

                return (
                  <label
                    key={pattern}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      checked
                        ? 'border-primary bg-primary/5'
                        : 'border-black/10 bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(
                        event,
                      ) => {
                        const rules =
                          event
                            .target
                            .checked
                            ? [
                                ...new Set(
                                  [
                                    ...module
                                      .patternRules
                                      .rules,
                                    pattern,
                                  ],
                                ),
                              ]
                            : module.patternRules.rules.filter(
                                (
                                  item,
                                ) =>
                                  item !==
                                  pattern,
                              );

                        update({
                          patternRules:
                            {
                              ...module.patternRules,
                              rules,
                            },
                        });
                      }}
                    />

                    <span className="text-sm font-semibold">
                      {
                        patternLabels[
                          pattern
                        ]
                      }
                    </span>
                  </label>
                );
              },
            )}
          </div>

          {/* KEYWORDS */}
          <div className="rounded-xl border border-black/5 bg-mist p-4">
            <h3 className="font-display font-bold">
              Keywords by Language
            </h3>

            <p className="mt-1 text-xs text-muted">
              Use commas to separate
              keywords. These feed the
              Simple Analysis rule engine.
            </p>

            {/* LANGUAGE TABS */}
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {langs.map(
                (language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() =>
                      setLang(
                        language,
                      )
                    }
                    className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                      lang ===
                      language
                        ? 'bg-primary text-white'
                        : 'bg-white'
                    }`}
                  >
                    {
                      languageLabels[
                        language
                      ]
                    }
                  </button>
                ),
              )}
            </div>

            {/* KEYWORD INPUTS */}
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {patternTypes.map(
                (pattern) => (
                  <label
                    key={pattern}
                    className="block"
                  >
                    <span className="mb-2 block text-sm font-semibold">
                      {
                        patternLabels[
                          pattern
                        ]
                      }
                    </span>

                    <input
                      type="text"
                      value={module.patternRules.keywordGroups[
                        lang
                      ][pattern].join(
                        ', ',
                      )}
                      onChange={(
                        event,
                      ) => {
                        const keywordGroups =
                          {
                            ...module
                              .patternRules
                              .keywordGroups,
                            [lang]: {
                              ...module
                                .patternRules
                                .keywordGroups[
                                lang
                              ],
                            },
                          };

                        keywordGroups[
                          lang
                        ][pattern] =
                          event.target.value
                            .split(
                              ',',
                            )
                            .map(
                              (
                                item,
                              ) =>
                                item.trim(),
                            )
                            .filter(
                              Boolean,
                            );

                        update({
                          patternRules:
                            {
                              ...module.patternRules,
                              keywordGroups,
                            },
                        });
                      }}
                      className="w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-sm outline-none focus:border-primary"
                    />
                  </label>
                ),
              )}
            </div>
          </div>
        </div>
      );
    }

    /* -----------------------------------------------------
       STEP 4 - REFLECTION
    ----------------------------------------------------- */

    if (step === 4) {
      return (
        <div className="space-y-5">
          {listArea(
            'Reflection Questions',
            module.reflection.questions,
            (value) =>
              updateReflection({
                questions: value,
              }),
          )}

          {listArea(
            'Comparison Prompts',
            module.reflection
              .comparisonPrompts,
            (value) =>
              updateReflection({
                comparisonPrompts:
                  value,
              }),
          )}
        </div>
      );
    }

    /* -----------------------------------------------------
       STEP 5 - AHA MOMENT
    ----------------------------------------------------- */

    if (step === 5) {
      return (
        <div className="space-y-5">
          {textField(
            'Aha Moment Title',
            module.ahaMoment.title,
            (value) =>
              updateAha({
                title: value,
              }),
          )}

          {textArea(
            'Trigger',
            module.ahaMoment.trigger,
            (value) =>
              updateAha({
                trigger: value,
              }),
          )}

          {textArea(
            'Reflection Prompt',
            module.ahaMoment.userPrompt,
            (value) =>
              updateAha({
                userPrompt: value,
              }),
          )}

          {textArea(
            'System Insight',
            module.ahaMoment.systemInsight,
            (value) =>
              updateAha({
                systemInsight: value,
              }),
          )}

          <div className="rounded-xl bg-primary/5 p-4 text-sm text-muted">
            Initial and later participant
            responses are captured
            automatically from the
            experience. Admin defines how
            the comparison is framed.
          </div>
        </div>
      );
    }

    /* -----------------------------------------------------
       STEP 6 - TAKEAWAY
    ----------------------------------------------------- */

    if (step === 6) {
      return (
        <div className="space-y-5">
          {textField(
            'Takeaway Title',
            module.takeaway.title,
            (value) =>
              updateTakeaway({
                title: value,
              }),
          )}

          {textArea(
            'Practical Challenge',
            module.takeaway
              .practicalChallenge,
            (value) =>
              updateTakeaway({
                practicalChallenge:
                  value,
              }),
          )}

          {textArea(
            'Real-world Prompt',
            module.takeaway
              .realWorldPrompt,
            (value) =>
              updateTakeaway({
                realWorldPrompt:
                  value,
              }),
          )}
        </div>
      );
    }

    /* -----------------------------------------------------
       STEP 7 - REVIEW & PUBLISH
    ----------------------------------------------------- */

    return (
      <div className="space-y-5">
        <div className="rounded-2xl bg-primary/5 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Ready to publish
          </p>

          <h2 className="mt-1 font-display text-2xl font-bold">
            {module.title[lang] ||
              'Untitled module'}
          </h2>

          <p className="mt-2 text-sm text-muted">
            Review the experience, then save
            it as draft or publish it to the
            participant Training Library.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ReviewItem
            label="Module Title"
            value={
              module.title[lang]
            }
          />

          <ReviewItem
            label="Category"
            value={
              module.category[lang]
            }
          />

          <ReviewItem
            label="Scenario"
            value={
              module.scenario.title[
                lang
              ]
            }
          />

          <ReviewItem
            label="Interaction"
            value={`${module.interaction.stages.length} stages`}
          />

          <ReviewItem
            label="Patterns"
            value={
              module.patternRules.rules
                .map(
                  (pattern) =>
                    patternLabels[
                      pattern
                    ],
                )
                .join(', ') ||
              'None'
            }
          />

          <ReviewItem
            label="Reflection"
            value={`${module.reflection.questions[lang].length} questions`}
          />

          <ReviewItem
            label="Aha Moment"
            value={
              module.ahaMoment.title[
                lang
              ]
            }
          />

          <ReviewItem
            label="Takeaway"
            value={
              module.takeaway.title[
                lang
              ]
            }
          />
        </div>
      </div>
    );
  };

  /* =======================================================
     BUILDER LAYOUT
  ======================================================= */

  const isFirstStep = step === 0;
  const isLastStep =
    step === tabs.length - 1;

  return (
    <div className="min-h-screen bg-mist">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/95 px-4 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">
              Back to Management
            </span>
            <span className="sm:hidden">
              Back
            </span>
          </button>

          <div className="hidden font-display font-bold sm:block">
            Curriculum Builder
          </div>

          {/* LANGUAGE SWITCHER */}
          <div className="flex items-center gap-1 rounded-lg bg-mist p-1">
            {langs.map(
              (language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() =>
                    setLang(
                      language,
                    )
                  }
                  className={`rounded-md px-2.5 py-1.5 text-xs font-bold ${
                    lang === language
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-muted'
                  }`}
                >
                  {
                    languageLabels[
                      language
                    ]
                  }
                </button>
              ),
            )}
          </div>
        </div>
      </header>

      {/* BUILDER CONTENT */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          {/* STEPS */}
          <aside className="h-fit rounded-2xl border border-black/5 bg-white p-3 shadow-sm lg:sticky lg:top-24">
            <div className="mb-3 px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted">
              Module Builder
            </div>

            <div className="flex gap-2 overflow-x-auto lg:flex-col">
              {tabs.map(
                (title, index) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() =>
                      setStep(
                        index,
                      )
                    }
                    className={`flex shrink-0 items-center justify-between rounded-lg px-3 py-3 text-left text-sm transition ${
                      index === step
                        ? 'bg-primary font-semibold text-white'
                        : 'text-muted hover:bg-mist'
                    }`}
                  >
                    <span>
                      {index + 1}.{' '}
                      {title}
                    </span>

                    {index < step && (
                      <Check className="ml-2 h-4 w-4 shrink-0" />
                    )}
                  </button>
                ),
              )}
            </div>
          </aside>

          {/* FORM */}
          <section className="min-w-0 rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-7">
            {/* STEP HEADER */}
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Step {step + 1} of{' '}
                {tabs.length}
              </p>

              <h1 className="mt-1 font-display text-2xl font-bold">
                {tabs[step]}
              </h1>

              <p className="mt-1 text-sm text-muted">
                Content is stored
                independently from the
                experience engine.
              </p>
            </div>

            {/* CONTENT */}
            {content()}

            {/* FOOTER */}
            <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-black/5 pt-5 sm:flex-row">
              <button
                type="button"
                disabled={isFirstStep}
                onClick={() =>
                  setStep(
                    Math.max(
                      0,
                      step - 1,
                    ),
                  )
                }
                className="rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold transition hover:bg-mist disabled:cursor-not-allowed disabled:opacity-30"
              >
                Previous
              </button>

              <div className="flex flex-wrap justify-end gap-2">
                {isLastStep ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        onSave(
                          'draft',
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-black/10 px-4 py-3 text-sm font-semibold transition hover:bg-mist"
                    >
                      <Save className="h-4 w-4" />
                      Save Draft
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onSave(
                          'published',
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
                    >
                      <Upload className="h-4 w-4" />
                      Publish Module
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setStep(
                        Math.min(
                          tabs.length -
                            1,
                          step + 1,
                        ),
                      )
                    }
                    className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
                  >
                    Save & Continue
                    <ChevronRight className="ml-1 inline h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   REVIEW ITEM
========================================================= */

const ReviewItem = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => (
  <div className="rounded-xl border border-black/5 bg-white p-4">
    <div className="text-xs font-semibold uppercase tracking-wide text-muted">
      {label}
    </div>

    <div className="mt-1 break-words font-semibold">
      {value || 'Not filled'}
    </div>
  </div>
);