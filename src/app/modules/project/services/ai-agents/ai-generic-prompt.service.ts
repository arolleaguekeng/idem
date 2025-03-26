import { Injectable } from '@angular/core';
import OpenAI from 'openai';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AiGenericPromptService {
  protected openai: OpenAI;
  apiKey = 'environment.deepSeekApiKey;';

  constructor() {
    this.openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  /**
   * Méthode générique pour interagir avec l'API DeepSeek.
   * @param prompt Le prompt à envoyer à l'API.
   * @returns La réponse de l'API.
   */
  protected async callDeepSeekAPI(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'deepseek-reasoner',
        messages: [{ role: 'user', content: prompt }],
      });
      const content = response.choices[0].message.content;
      if (content === null) {
        throw new Error('API response content is null');
      }
      return content;
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API DeepSeek :", error);
      throw error;
    }
  }
}
