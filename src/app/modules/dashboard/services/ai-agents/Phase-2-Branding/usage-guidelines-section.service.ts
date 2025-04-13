import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { USAGE_GUIDELINES_SECTION_PROMPT } from './prompts/usage-guidelines-section.prompt';

@Injectable({
  providedIn: 'root',
})
export class UsageGuidelinesSectionService extends AiGenericPromptService {
  constructor() {
    super();
  }

  async generateDatas(
    history: string,
    projectDescription: string
  ): Promise<string> {
    const prompt = ` ${USAGE_GUIDELINES_SECTION_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }
}
