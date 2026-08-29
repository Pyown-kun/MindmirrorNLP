import { SimpleAnalysisService } from './SimpleAnalysisService';
import { SimpleRoleplayService } from './SimpleRoleplayService';
import type { AIAnalysisService, RoleplayService } from './AIService';

/**
 * This is the single place that decides which concrete implementation
 * of the AI interfaces is active.
 *
 * To integrate a real model later, implement `AIAnalysisService` /
 * `RoleplayService` (see AIService.ts) in a new file, e.g.
 * `ClaudeAnalysisService.ts`, and swap the export below:
 *
 *   export const analysisService: AIAnalysisService = new ClaudeAnalysisService(apiKey);
 *
 * No other file in the app needs to change.
 */
export const analysisService: AIAnalysisService = new SimpleAnalysisService();
export const roleplayService: RoleplayService = new SimpleRoleplayService();

export type { AIAnalysisService, RoleplayService };
