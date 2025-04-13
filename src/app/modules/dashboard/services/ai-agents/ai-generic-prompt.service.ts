import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth, User } from '@angular/fire/auth'; // Firebase Auth
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiGenericPromptService {
  private apiUrl = 'http://localhost:3000/api/prompt'; // Remplace par ton URL backend
  // private apiUrl = 'https://lexis-api.vercel.app/api/prompt'; // Remplace par ton URL backend
  constructor() {}

  http = inject(HttpClient);
  auth = inject(Auth);
  async sendPrompt(
    history: string,
    prompt: string
  ): Promise<any> {
    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const headers = new HttpHeaders({
        Authorization: `Bearer ${await user.getIdToken()}`,
        'Content-Type': 'application/json',
      });

      return await firstValueFrom(
        this.http.post(
          this.apiUrl,
          { history, prompt },
          {
            headers,
            responseType: 'text',
          }
        )
      );
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
