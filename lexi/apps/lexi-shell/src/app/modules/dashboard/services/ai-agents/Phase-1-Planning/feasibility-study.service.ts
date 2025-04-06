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
   * @returns La réponse de l'API Lexi.
   */
  async analyzeFeasibility(
    history: any[],
    projectDescription: string
  ): Promise<string> {
    const prompt = ` ${FAISABILITY_PROMPT} ${projectDescription}.`;

    console.log('final prompr', prompt);
    return this.sendPrompt(history, prompt);
  }
}
