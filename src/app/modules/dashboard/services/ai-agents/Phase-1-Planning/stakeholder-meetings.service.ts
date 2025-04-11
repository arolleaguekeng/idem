import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { STAKEHOLDER_MEETINGS_PROMPT } from './prompts/stakeholder-meetings.model';

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
   * @returns La réponse de l'API Lexi.
   */
  async organizeStakeholderMeetings(
    history: any[],
    projectDescription: string
  ): Promise<string> {
    const prompt = `${STAKEHOLDER_MEETINGS_PROMPT} : ${projectDescription}.`;
    return this.sendPrompt(history, prompt);
  }
}
