import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';

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
   * @returns La réponse de l'API DeepSeek.
   */
  async modelUseCases(
    history: any[],
    projectDescription: string
  ): Promise<string> {
    const prompt = `Modélise les cas d'utilisation pour le projet suivant : ${projectDescription}.`;
    return this.sendPrompt(history, prompt);
  }
}
