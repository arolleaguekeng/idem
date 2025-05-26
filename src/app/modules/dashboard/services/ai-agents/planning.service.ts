import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PlanningModel } from '../../models/planning.model';

@Injectable({
  providedIn: 'root',
})
export class PlanningService {
  private apiUrl = `${environment.services.api.url}/project/project-planning-items`;

  private http = inject(HttpClient);
  private auth = inject(Auth);

  constructor() {}

  private async getAuthHeaders(): Promise<HttpHeaders> {
    const user = this.auth.currentUser;
    if (!user)
      throw new Error('User not authenticated for PlanningService operation');
    const token = await user.getIdToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Create a new project planning item
  async createPlanningItem(item: PlanningModel): Promise<PlanningModel> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(
      this.http.post<PlanningModel>(this.apiUrl, item, { headers })
    );
  }

  // Get all project planning items (optionally by projectId)
  async getPlanningItems(projectId?: string): Promise<PlanningModel[]> {
    const headers = await this.getAuthHeaders();
    let url = this.apiUrl;
    if (projectId) {
      url += `?projectId=${projectId}`;
    }
    return firstValueFrom(this.http.get<PlanningModel[]>(url, { headers }));
  }

  // Get a specific project planning item by ID
  async getPlanningItemById(id: string): Promise<PlanningModel> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(
      this.http.get<PlanningModel>(`${this.apiUrl}/${id}`, { headers })
    );
  }

  // Update a specific project planning item
  async updatePlanningItem(
    id: string,
    item: Partial<PlanningModel>
  ): Promise<PlanningModel> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(
      this.http.put<PlanningModel>(`${this.apiUrl}/${id}`, item, { headers })
    );
  }

  // Delete a specific project planning item
  async deletePlanningItem(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(
      this.http.delete<void>(`${this.apiUrl}/${id}`, { headers })
    );
  }
}
