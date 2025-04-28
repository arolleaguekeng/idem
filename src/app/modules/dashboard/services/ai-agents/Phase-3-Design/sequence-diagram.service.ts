import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { SEQUENCE_DIAGRAM_PROMPT } from './prompts/sequence-diagram.prompt';

@Injectable({
  providedIn: 'root',
})
export class SequenceDiagramService extends AiGenericPromptService {
  constructor() {
    super();
  }

  async generateDatas(
    history: string,
    projectDescription: string
  ): Promise<{ content: string; summary: string }> {
    const prompt = `${SEQUENCE_DIAGRAM_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }
}
