import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { ARCHITECTURE_DIAGRAM_PROMPT } from './prompts/architecture-diagram.prompt';

@Injectable({
  providedIn: 'root',
})
export class ArchitectureDiagramService extends AiGenericPromptService {
  constructor() {
    super();
  }

  async generateDatas(
    history: string,
    projectDescription: string
  ): Promise<{ content: string; summary: string }> {
    const prompt = `${ARCHITECTURE_DIAGRAM_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }
}
