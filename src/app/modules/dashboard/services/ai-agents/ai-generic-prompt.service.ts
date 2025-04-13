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

  http = inject(HttpClient);
  auth = inject(Auth);
  async sendPrompt(history: string, prompt: string): Promise<any> {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const headers = new HttpHeaders({
        Authorization: `Bearer ${await user.getIdToken()}`,
        'Content-Type': 'application/json',
      });

      prompt = ` ${prompt}.  summary:  ${history}.  ${GENERIC_JSON_FORMAT_PROMPT}`;

      return await firstValueFrom(
        this.http.post<{ content: string; summary: string }>(
          this.apiUrl,
          { prompt },
          {
            headers,
          }
        )
      );
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
