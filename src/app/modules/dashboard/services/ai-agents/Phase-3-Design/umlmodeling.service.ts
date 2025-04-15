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
    history: string,
    projectDescription: string
  ): Promise<{ content: string; summary: string }> {
    const prompt = ` ${CLASS_DIAGRAM_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }

  async generateUseCaseDiagramm(
    history: string,
    projectDescription: string
  ): Promise<{ content: string; summary: string }> {
    const prompt = ` ${USECASE_DIAGRAM_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }

  async generateSequenceDiagramm(
    history: string,
    projectDescription: string
  ): Promise<{ content: string; summary: string }> {
    const prompt = ` ${SEQUENCE_DIAGRAM_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }

  async generateERDiagramm(
    history: string,
    projectDescription: string
  ): Promise<{ content: string; summary: string }> {
    const prompt = ` ${ER_DIAGRAM_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }

  async generateArchitectureDiagramm(
    history: string,
    projectDescription: string
  ): Promise<{ content: string; summary: string }> {
    const prompt = ` ${ARCHITECTURE_DIAGRAM_PROMPT} ${projectDescription}.`;

    return this.sendPrompt(history, prompt);
  }
}
