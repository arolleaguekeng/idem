import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { RISK_ANALYSIS_PROMPT } from './prompts/risk-analylsis.prompt';

@Injectable({
  providedIn: 'root',
})
export class RiskAnalysisService extends AiGenericPromptService {
  constructor() {
    super();
  }

  /**
   * Analyse les risques d'un projet.
   * @param projectDescription Description du projet.
   * @returns La réponse de l'API Lexi.
   */
  async analyzeRisks(
    history: string,
    projectDescription: string
  ): Promise<{ content: string; summary: string }> {
    const prompt = `${RISK_ANALYSIS_PROMPT} : ${projectDescription}.`;
    return this.sendPrompt(history, prompt);
  }
}
