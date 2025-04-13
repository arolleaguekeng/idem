import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { TYPOGRAPHY_SECTION_PROMPT } from './prompts/typography-section.prompt';

@Injectable({
  providedIn: 'root',
})
export class TypographySectionService extends AiGenericPromptService {
  constructor() {
    super();
  }

  async generateDatas(
    history: string,
    projectDescription: string
  ): Promise<string> {
    const prompt = ` ${TYPOGRAPHY_SECTION_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }
}
