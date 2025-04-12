import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { CLASS_DIAGRAM_PROMPT } from './prompts/class-diagram.prompt';
import { ARCHITECTURE_DIAGRAM_PROMPT } from './prompts/architecture-diagramm.prompt';
import { ER_DIAGRAM_PROMPT } from './prompts/er-diagram.prompt';
import { SEQUENCE_DIAGRAM_PROMPT } from './prompts/sequence-diagramm.prompt';
import { USECASE_DIAGRAM_PROMPT } from './prompts/use-case-diagramm.prompt';

@Injectable({
  providedIn: 'root',
})
/**
 * Service for UML modeling.
 * This service is responsible for generating UML diagrams based on the project description.
 */
export class UMLModelingService extends AiGenericPromptService {
  constructor() {
    super();
  }

  async generateClassDiagramm(
    history: any[],
    projectDescription: string
  ): Promise<string> {
    const prompt = ` ${CLASS_DIAGRAM_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }

  async generateUseCaseDiagramm(
    history: any[],
    projectDescription: string
  ): Promise<string> {
    const prompt = ` ${USECASE_DIAGRAM_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }

  async generateSequenceDiagramm(
    history: any[],
    projectDescription: string
  ): Promise<string> {
    const prompt = ` ${SEQUENCE_DIAGRAM_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }

  async generateERDiagramm(
    history: any[],
    projectDescription: string
  ): Promise<string> {
    const prompt = ` ${ER_DIAGRAM_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }

  async generateArchitectureDiagramm(
    history: any[],
    projectDescription: string
  ): Promise<string> {
    const prompt = ` ${ARCHITECTURE_DIAGRAM_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }
}
