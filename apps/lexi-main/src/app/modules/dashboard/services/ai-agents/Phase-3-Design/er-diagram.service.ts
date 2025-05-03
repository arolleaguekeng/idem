import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { ER_DIAGRAM_PROMPT } from './prompts/er-diagram.prompt';

@Injectable({
  providedIn: 'root',
})
export class ErDiagramService extends AiGenericPromptService {
  constructor() {
    super();
  }

  async generateDatas(
    history: string,
    projectDescription: string
  ): Promise<{ content: string; summary: string }> {
    const prompt = `${ER_DIAGRAM_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }
}
