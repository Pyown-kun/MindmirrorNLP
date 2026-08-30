import type { RoleplayMessage, ScenarioContext } from '../../types/training';
import type { RoleplayService } from './AIService';
import { ExperienceEngine } from '../../engine/ExperienceEngine';
import { getCurriculumModule } from '../../curriculum/modules';

export class SimpleRoleplayService implements RoleplayService {
  startScenario(context: ScenarioContext): RoleplayMessage {
    return new ExperienceEngine(getCurriculumModule(context.moduleId ?? null)).opening(context.language);
  }

  respond(context: ScenarioContext, messages: RoleplayMessage[]): RoleplayMessage {
    return new ExperienceEngine(getCurriculumModule(context.moduleId ?? null)).respond(context.language, messages, context.stage);
  }
}
