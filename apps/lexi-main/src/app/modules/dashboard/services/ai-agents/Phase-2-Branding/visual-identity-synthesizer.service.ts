import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { VISUAL_IDENTITY_SYNTHESIZER_PROMPT } from './prompts/visual-identity-synthesizer.prompt';

@Injectable({
  providedIn: 'root',
})
export class VisualIdentitySynthesizerService extends AiGenericPromptService {
  constructor() {
    super();
  }

  async generateDatas(
    history: string,
    projectDescription: string
  ): Promise<{ content: string, summary: string }> {
    const prompt = ` ${VISUAL_IDENTITY_SYNTHESIZER_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }
}
