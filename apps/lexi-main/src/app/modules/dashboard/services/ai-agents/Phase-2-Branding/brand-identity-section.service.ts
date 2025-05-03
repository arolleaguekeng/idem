import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { BRAND_IDENTITY_SECTION_PROMPT } from './prompts/brand-identity-section.prompt';

@Injectable({
  providedIn: 'root',
})
export class BrandIdentitySectionService extends AiGenericPromptService {
  constructor() {
    super();
  }
  async generateDatas(
      history: string,
      projectDescription: string
    ): Promise<{ content: string, summary: string }> {
      const prompt = ` ${BRAND_IDENTITY_SECTION_PROMPT} ${projectDescription}.`;
  
      return this.sendPrompt(history, prompt);
    }
}
