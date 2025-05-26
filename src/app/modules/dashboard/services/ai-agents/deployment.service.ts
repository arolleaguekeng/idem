import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';

// Define a basic interface for Deployment items
export interface DeploymentItem {
  id?: string;
  environment: string; // e.g., 'staging', 'production'
  status?: string;
  deployedAt?: Date;
  // Add other properties as needed
}

@Injectable({
  providedIn: 'root',
})
export class DeploymentService {
  private apiUrl = `${environment.services.api.url}/project/deployments`;

  private http = inject(HttpClient);
  private auth = inject(Auth);

  constructor() {}

  private async getAuthHeaders(): Promise<HttpHeaders> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not authenticated for DeploymentService operation');
    const token = await user.getIdToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Create a new deployment item
  async createDeploymentItem(item: DeploymentItem): Promise<DeploymentItem> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(this.http.post<DeploymentItem>(this.apiUrl, item, { headers }));
  }

  // Get all deployment items
  async getDeploymentItems(): Promise<DeploymentItem[]> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(this.http.get<DeploymentItem[]>(this.apiUrl, { headers }));
  }

  // Get a specific deployment item by ID
  async getDeploymentItemById(id: string): Promise<DeploymentItem> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(this.http.get<DeploymentItem>(`${this.apiUrl}/${id}`, { headers }));
  }

  // Update a specific deployment item
  async updateDeploymentItem(id: string, item: Partial<DeploymentItem>): Promise<DeploymentItem> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(this.http.put<DeploymentItem>(`${this.apiUrl}/${id}`, item, { headers }));
  }

  // Delete a specific deployment item
  async deleteDeploymentItem(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }));
  }
}