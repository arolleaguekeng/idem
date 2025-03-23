import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';

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
   * @returns La réponse de l'API DeepSeek.
   */
  async analyzeRisks(projectDescription: string): Promise<string> {
    const prompt = `Identifie les risques potentiels du projet suivant : ${projectDescription}.`;
    return this.callDeepSeekAPI(prompt);
  }
}
