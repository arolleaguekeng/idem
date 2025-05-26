import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { DiagramModel } from '../../models/diagram.model';



@Injectable({
  providedIn: 'root',
})
export class DiagramsService {
  // Renamed class to DiagramsService to match filename
  private apiUrl = `${environment.services.api.url}/project/diagrams`;

  private http = inject(HttpClient);
  private auth = inject(Auth);

  constructor() {}

  private async getAuthHeaders(): Promise<HttpHeaders> {
    const user = this.auth.currentUser;
    if (!user)
      throw new Error('User not authenticated for DiagramsService operation');
    const token = await user.getIdToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Create a new diagram item
  async createDiagram(item: DiagramModel): Promise<DiagramModel> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(
      this.http.post<DiagramModel>(this.apiUrl, item, { headers })
    );
  }

  // Get all diagram items (optionally by projectId)
  async getDiagrams(projectId?: string): Promise<DiagramModel[]> {
    const headers = await this.getAuthHeaders();
    let url = this.apiUrl;
    if (projectId) {
      url += `?projectId=${projectId}`;
    }
    return firstValueFrom(this.http.get<DiagramModel[]>(url, { headers }));
  }

  // Get a specific diagram item by ID
  async getDiagramById(id: string): Promise<DiagramModel> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(
      this.http.get<DiagramModel>(`${this.apiUrl}/${id}`, { headers })
    );
  }

  // Update a specific diagram item
  async updateDiagram(
    id: string,
    item: Partial<DiagramModel>
  ): Promise<DiagramModel> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(
      this.http.put<DiagramModel>(`${this.apiUrl}/${id}`, item, { headers })
    );
  }

  // Delete a specific diagram item
  async deleteDiagram(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(
      this.http.delete<void>(`${this.apiUrl}/${id}`, { headers })
    );
  }
}
