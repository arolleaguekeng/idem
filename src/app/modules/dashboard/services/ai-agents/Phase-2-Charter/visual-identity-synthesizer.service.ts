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
    history: any[],
    projectDescription: string
  ): Promise<string> {
    const prompt = ` ${VISUAL_IDENTITY_SYNTHESIZER_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }
}
