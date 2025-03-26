import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { FAISABILITY_PROMPT } from './prompts/faisability.prompt';

@Injectable({
  providedIn: 'root',
})
export class FeasibilityStudyService extends AiGenericPromptService {
  constructor() {
    super();
  }

  /**
   * Analyse la faisabilité d'un projet.
   * @param projectDescription Description du projet.
   * @returns La réponse de l'API DeepSeek.
   */
  async analyzeFeasibility(
    history: any[],
    projectDescription: string
  ): Promise<string> {
    const prompt = ` ${FAISABILITY_PROMPT} ${projectDescription}.`;
    return this.sendPrompt(history, prompt);
  }
}
