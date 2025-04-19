import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { LOGO_GENERATION_PROMPT } from './prompts/logo-generation.prompt';
import { LogoModel } from '../../../models/logo.model';

@Injectable({
  providedIn: 'root',
})
export class LogoGenerationService extends AiGenericPromptService {
  constructor() {
    super();
  }

  async generateDatas(
    history: string,
    projectDescription: string
  ): Promise<{ content: LogoModel; summary: string }> {
    const prompt = `${LOGO_GENERATION_PROMPT} ${projectDescription}.`;
    
    // Appel à la méthode parente
    const response = await super.sendPrompt(history, prompt);
    
    // Transformation de la réponse string en LogoModel
    return {
      content: this.parseLogoContent(response.content),
      summary: response.summary
    };
  }

  private parseLogoContent(content: string): LogoModel {
    try {
      // Supprime les éventuels markdown autour du JSON
      const cleanedContent = content.replace(/^```json\s*/, '').replace(/```$/, '').trim();
      const parsed = JSON.parse(cleanedContent);
      
      // Validation basique de la structure
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid logo data format');
      }
      
      return parsed as LogoModel;
    } catch (error) {
      console.error('Failed to parse logo content:', error);
      throw new Error('Failed to parse AI response into LogoModel');
    }
  }
}