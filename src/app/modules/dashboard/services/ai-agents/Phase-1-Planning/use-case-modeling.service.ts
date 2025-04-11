import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { USE_CASE_MODELING_PROMPT } from './prompts/use-case-modeling.prompt';

@Injectable({
  providedIn: 'root',
})
export class UseCaseModelingService extends AiGenericPromptService {
  constructor() {
    super();
  }

  /**
   * Modélise les cas d'utilisation pour un projet.
   * @param projectDescription Description du projet.
   * @returns La réponse de l'API Lexi.
   */
  async modelUseCases(
    history: any[],
    projectDescription: string
  ): Promise<string> {
    const prompt = `${USE_CASE_MODELING_PROMPT} : ${projectDescription}.`;
    return this.sendPrompt(history, prompt);
  }
}
