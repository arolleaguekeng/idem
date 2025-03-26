import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';

@Injectable({
  providedIn: 'root',
})
export class SmartObjectivesService extends AiGenericPromptService {
  constructor() {
    super();
  }

  /**
   * Définit les objectifs SMART pour un projet.
   * @param projectDescription Description du projet.
   * @returns La réponse de l'API DeepSeek.
   */
  async defineSmartObjectives(
    history: any[],
    projectDescription: string
  ): Promise<string> {
    const prompt = `Définis des objectifs SMART pour le projet suivant : ${projectDescription}.`;
    return this.sendPrompt(history, prompt);
  }
}
