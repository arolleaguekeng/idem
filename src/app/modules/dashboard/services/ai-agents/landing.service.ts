import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LandingModel } from '../../models/landing.model';



@Injectable({
  providedIn: 'root',
})
export class LandingService {
  private apiUrl = `${environment.services.api.url}/project/landings`; // Adjusted to match your backend routes

  private http = inject(HttpClient);
  private auth = inject(Auth);

  constructor() {}

  private async getAuthHeaders(): Promise<HttpHeaders> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not authenticated for LandingService operation');
    const token = await user.getIdToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Create a new landing item
  async createLandingModel(item: LandingModel): Promise<LandingModel> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(this.http.post<LandingModel>(this.apiUrl, item, { headers }));
  }

  // Get all landing items
  async getLandingModels(): Promise<LandingModel[]> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(this.http.get<LandingModel[]>(this.apiUrl, { headers }));
  }

  // Get a specific landing item by ID
  async getLandingModelById(id: string): Promise<LandingModel> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(this.http.get<LandingModel>(`${this.apiUrl}/${id}`, { headers }));
  }

  // Update a specific landing item
  async updateLandingModel(id: string, item: Partial<LandingModel>): Promise<LandingModel> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(this.http.put<LandingModel>(`${this.apiUrl}/${id}`, item, { headers }));
  }

  // Delete a specific landing item
  async deleteLandingModel(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }));
  }
}