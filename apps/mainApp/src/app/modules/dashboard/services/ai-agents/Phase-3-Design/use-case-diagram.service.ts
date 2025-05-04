import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { USE_CASE_DIAGRAM_PROMPT } from './prompts/use-case-diagram.prompt';

@Injectable({
  providedIn: 'root',
})
export class UsecaseDiagramService extends AiGenericPromptService {
  constructor() {
    super();
  }

  async generateDatas(
    history: string,
    projectDescription: string
  ): Promise<{ content: string; summary: string }> {
    const prompt = `${USE_CASE_DIAGRAM_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }
}
