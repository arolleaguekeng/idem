import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { GENERIC_JSON_FORMAT_PROMPT } from './prompts/aditional.prompt';

@Injectable({
  providedIn: 'root',
})
export class AiGenericPromptService {
  private apiUrl = 'http://localhost:3000/api/prompt';
  // private apiUrl = 'https://lexis-api.vercel.app/api/prompt';
  
  constructor() {}

  private http = inject(HttpClient);
  private auth = inject(Auth);

  async sendPrompt(history: string, prompt: string): Promise<{ content: string; summary: string }> {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const token = await user.getIdToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });

      const fullPrompt = [
        prompt?.trim(),
        history ? `Contexte: ${history.trim()}` : '',
        GENERIC_JSON_FORMAT_PROMPT,
      ].filter(Boolean).join('\n\n');

      const requestBody = {
        provider: 'DEEPSEEK', 
        modelName: 'deepseek/deepseek-chat-v3-0324:free', 
        prompt: fullPrompt,
        llmOptions: {
          maxOutputTokens: 800 
        }
      };

      const response = await firstValueFrom(
        this.http.post<{ content: string; summary: string }>(
          this.apiUrl,
          requestBody,
          { headers }
        )
      );

    
      if (!response?.content || !response?.summary) {
        throw new Error('Réponse AI invalide: format attendu non respecté');
      }

      return response;
    } catch (error) {
      console.error('Erreur:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error?.error instanceof ErrorEvent) {
 
      return new Error(`Erreur réseau: ${error.error.message}`);
    } else if (error?.status) {

      return new Error(`Erreur ${error.status}: ${error.message}`);
    }
    return error instanceof Error ? error : new Error('Erreur inconnue');
  }
}