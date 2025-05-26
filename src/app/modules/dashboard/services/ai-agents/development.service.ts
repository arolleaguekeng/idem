import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';

// Define a basic interface for Development items
export interface DevelopmentItem {
  id?: string;
  taskName: string;
  status?: string;
  // Add other properties as needed
}

@Injectable({
  providedIn: 'root',
})
export class DevelopmentService {
  private apiUrl = `${environment.services.api.url}/project/developments`;

  private http = inject(HttpClient);
  private auth = inject(Auth);

  constructor() {}

  private async getAuthHeaders(): Promise<HttpHeaders> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not authenticated for DevelopmentService operation');
    const token = await user.getIdToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Create a new development item
  async createDevelopmentItem(item: DevelopmentItem): Promise<DevelopmentItem> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(this.http.post<DevelopmentItem>(this.apiUrl, item, { headers }));
  }

  // Get all development items
  async getDevelopmentItems(): Promise<DevelopmentItem[]> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(this.http.get<DevelopmentItem[]>(this.apiUrl, { headers }));
  }

  // Get a specific development item by ID
  async getDevelopmentItemById(id: string): Promise<DevelopmentItem> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(this.http.get<DevelopmentItem>(`${this.apiUrl}/${id}`, { headers }));
  }

  // Update a specific development item
  async updateDevelopmentItem(id: string, item: Partial<DevelopmentItem>): Promise<DevelopmentItem> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(this.http.put<DevelopmentItem>(`${this.apiUrl}/${id}`, item, { headers }));
  }

  // Delete a specific development item
  async deleteDevelopmentItem(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }));
  }
}