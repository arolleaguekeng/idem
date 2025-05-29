import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BusinessPlanModel } from '../../models/businessPlan.model';

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
  async createPlanningItem(item: BusinessPlanModel): Promise<BusinessPlanModel> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(
      this.http.post<BusinessPlanModel>(this.apiUrl, item, { headers })
    );
  }

  // Get all project planning items (optionally by projectId)
  async getPlanningItems(projectId?: string): Promise<BusinessPlanModel[]> {
    const headers = await this.getAuthHeaders();
    let url = this.apiUrl;
    if (projectId) {
      url += `?projectId=${projectId}`;
    }
    return firstValueFrom(this.http.get<BusinessPlanModel[]>(url, { headers }));
  }

  // Get a specific project planning item by ID
  async getPlanningItemById(id: string): Promise<BusinessPlanModel> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(
      this.http.get<BusinessPlanModel>(`${this.apiUrl}/${id}`, { headers })
    );
  }

  // Update a specific project planning item
  async updatePlanningItem(
    id: string,
    item: Partial<BusinessPlanModel>
  ): Promise<BusinessPlanModel> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(
      this.http.put<BusinessPlanModel>(`${this.apiUrl}/${id}`, item, { headers })
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
