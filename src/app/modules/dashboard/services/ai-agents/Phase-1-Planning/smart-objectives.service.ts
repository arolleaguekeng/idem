import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { SMART_OBJECTIVES_PROMPT } from './prompts/smart-objectives.prompt';

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
   * @returns La réponse de l'API Lexi.
   */
  async defineSmartObjectives(
    history: string,
    projectDescription: string
  ): Promise<string> {
    const prompt = `${SMART_OBJECTIVES_PROMPT} : ${projectDescription}.`;
    return this.sendPrompt(history, prompt);
  }
}
