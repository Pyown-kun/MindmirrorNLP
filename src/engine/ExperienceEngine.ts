import type {
  CurriculumModule,
  RoleplayMessage,
  Language,
} from '../types/training';

import {
  CLARIFYING_KEYWORDS,
  EMPATHY_KEYWORDS,
  findMatchedKeywords,
} from '../utils/analysisRules';

import { localize } from '../curriculum/modules';

export class ExperienceEngine {
  private readonly module: CurriculumModule;

  constructor(module: CurriculumModule) {
    this.module = module;
  }

  opening(language: Language): RoleplayMessage {
    return {
      id: this.id(),
      speaker: 'character',
      text: localize(
        this.module.scenario.openingMessage,
        language
      ),
      timestamp: Date.now(),
    };
  }

  respond(
    language: Language,
    messages: RoleplayMessage[],
    stageIndex: number
  ): RoleplayMessage {
    const stages = this.module.interaction.stages;

    // Prevent invalid access when a module has no interaction stages.
    if (stages.length === 0) {
      return {
        id: this.id(),
        speaker: 'character',
        text: '',
        timestamp: Date.now(),
      };
    }

    const safeStageIndex = Math.min(
      Math.max(stageIndex, 0),
      stages.length - 1
    );

    const stage = stages[safeStageIndex];

    const last =
      [...messages]
        .reverse()
        .find((message) => message.speaker === 'user')
        ?.text ?? '';

    const clarify =
      findMatchedKeywords(
        last,
        CLARIFYING_KEYWORDS[language]
      ).length > 0;

    const empathy =
      findMatchedKeywords(
        last,
        EMPATHY_KEYWORDS[language]
      ).length > 0;

    const specific =
      last.trim().endsWith('?') &&
      last.trim().length > 18;

    const key = specific
      ? 'specific'
      : clarify
        ? 'clarify'
        : empathy
          ? 'empathy'
          : 'fallback';

    return {
      id: this.id(),
      speaker: 'character',
      text: localize(stage.replies[key], language),
      timestamp: Date.now(),
    };
  }

  private id(): string {
    return `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
  }
}