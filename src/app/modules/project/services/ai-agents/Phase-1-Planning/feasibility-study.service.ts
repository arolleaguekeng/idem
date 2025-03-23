import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';

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
  async analyzeFeasibility(projectDescription: string): Promise<string> {
    const prompt = `Analyse la faisabilité du projet suivant : ${projectDescription}.`;
    return this.callDeepSeekAPI(prompt);
  }
}
