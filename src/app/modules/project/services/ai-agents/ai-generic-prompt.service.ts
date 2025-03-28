import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '@angular/fire/auth'; // Firebase Auth
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiGenericPromptService {
  private apiUrl = 'http://localhost:3000/api/prompt'; // Remplace par ton URL backend
  // private apiUrl = 'https://lexis-api.vercel.app/api/prompt'; // Remplace par ton URL backend

  http = inject(HttpClient);
  auth = inject(Auth);
  async sendPrompt(history: any[], prompt: string): Promise<any> {
    try {
      console.log('----------send prompt------');
      const user = this.auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const idToken = await user.getIdToken(); // Récupérer le token Firebase

      const headers = new HttpHeaders({
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      });

      const body = { history, prompt };

      return await firstValueFrom(
        this.http.post(this.apiUrl, body, { headers })
      );
    } catch (error) {
      console.error('Error sending prompt:', error);
      throw error;
    }
  }
}
