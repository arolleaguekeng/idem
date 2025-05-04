import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { COLOR_PALETTE_SECTION_PROMPT } from './prompts/color-palette-section.prompt';
import { GLOBAL_CSS_PROMPT } from './prompts/global-css.prompt';

@Injectable({
  providedIn: 'root',
})
export class GlobalCssService extends AiGenericPromptService {
  constructor() {
    super();
  }

  async generateDatas(
    history: string,
    projectDescription: string
  ): Promise<{ content: string, summary: string }> {
    const prompt = ` ${GLOBAL_CSS_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }
}
