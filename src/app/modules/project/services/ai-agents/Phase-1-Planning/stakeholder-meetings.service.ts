import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';

@Injectable({
  providedIn: 'root',
})
export class StakeholderMeetingsService extends AiGenericPromptService {
  constructor() {
    super();
  }

  /**
   * Planifie et organise les réunions avec les parties prenantes.
   * @param projectDescription Description du projet.
   * @returns La réponse de l'API DeepSeek.
   */
  async organizeStakeholderMeetings(
    projectDescription: string
  ): Promise<string> {
    const prompt = `Planifie les réunions avec les parties prenantes pour le projet suivant : ${projectDescription}.`;
    return this.callDeepSeekAPI(prompt);
  }
}
