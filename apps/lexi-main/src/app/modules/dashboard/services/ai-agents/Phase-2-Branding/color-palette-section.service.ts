import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { COLOR_PALETTE_SECTION_PROMPT } from './prompts/color-palette-section.prompt';

@Injectable({
  providedIn: 'root',
})
export class ColorPaletteSectionService extends AiGenericPromptService {
  constructor() {
    super();
  }

  async generateDatas(
    history: string,
    projectDescription: string
  ): Promise<{ content: string, summary: string }> {
    const prompt = ` ${COLOR_PALETTE_SECTION_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }
}
