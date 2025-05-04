import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { CLASS_DIAGRAM_PROMPT } from './prompts/class-diagram.prompt';

@Injectable({
  providedIn: 'root',
})
export class ClassDiagramService extends AiGenericPromptService {
  constructor() {
    super();
  }

  async generateDatas(
    history: string,
    projectDescription: string
  ): Promise<{ content: string; summary: string }> {
    const prompt = `${CLASS_DIAGRAM_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }
}
