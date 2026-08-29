import type {
  AnalysisInput,
  AnalysisResult,
  CommunicationAnalysis,
  RoleplayMessage,
  ScenarioContext,
} from '../../types/training';

/**
 * AIAnalysisService
 * ------------------
 * Generic abstraction for "mindset" and "conversation" analysis.
 *
 * The demo ships with `SimpleAnalysisService`, a rule-based engine that
 * needs no external API key. To plug in a real AI model later, implement
 * this same interface, e.g.:
 *
 *   class OpenAIAnalysisService implements AIAnalysisService { ... }
 *   class ClaudeAnalysisService implements AIAnalysisService { ... }
 *   class GeminiAnalysisService implements AIAnalysisService { ... }
 *   class LocalLLMAnalysisService implements AIAnalysisService { ... }
 *
 * Then swap the instance created in `services/ai/index.ts` — nothing in
 * the pages/components needs to change because they only depend on this
 * interface.
 */
export interface AIAnalysisService {
  analyzeMindset(input: AnalysisInput): AnalysisResult;
  analyzeConversation(
    messages: RoleplayMessage[],
    language: AnalysisInput['language']
  ): CommunicationAnalysis;
}

/**
 * RoleplayService
 * ---------------
 * Generic abstraction for the simulated conversation partner.
 *
 * The demo ships with `SimpleRoleplayService`, driven by keyword
 * matching and predefined scenario stages. A future `ExternalAIRoleplayService`
 * could call an LLM to generate the character's replies while keeping the
 * exact same method signatures.
 */
export interface RoleplayService {
  startScenario(context: ScenarioContext): RoleplayMessage;
  respond(context: ScenarioContext, messages: RoleplayMessage[]): RoleplayMessage;
}
