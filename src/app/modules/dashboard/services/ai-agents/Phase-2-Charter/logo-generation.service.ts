import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { LOGO_GENERATION_PROMPT } from './prompts/logo-generation.prompt';

@Injectable({
  providedIn: 'root',
})
export class LogoGenerationService extends AiGenericPromptService {
  constructor() {
    super();
  }

  async generateDatas(
    history: string,
    projectDescription: string
  ): Promise<string> {
    const prompt = ` ${LOGO_GENERATION_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }
}
