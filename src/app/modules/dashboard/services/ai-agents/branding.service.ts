import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BrandIdentityModel } from '../../models/brand-identity.model';

@Injectable({
  providedIn: 'root',
})
export class BrandingService {
  private apiUrl = `${environment.services.api.url}/project/brandings`;

  private http = inject(HttpClient);
  private auth = inject(Auth);

  constructor() {}

  private async getAuthHeaders(): Promise<HttpHeaders> {
    const user = this.auth.currentUser;
    if (!user)
      throw new Error('User not authenticated for BrandingService operation');
    const token = await user.getIdToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Create a new branding item
  async createBrandIdentityModel(
    item: BrandIdentityModel
  ): Promise<BrandIdentityModel> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(
      this.http.post<BrandIdentityModel>(this.apiUrl, item, { headers })
    );
  }

  // Get all branding items
  async getBrandIdentityModels(
    projectId: string
  ): Promise<BrandIdentityModel[]> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(
      this.http.get<BrandIdentityModel[]>(this.apiUrl, { headers })
    );
  }

  // Get a specific branding item by ID
  async getBrandIdentityModelById(id: string): Promise<BrandIdentityModel> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(
      this.http.get<BrandIdentityModel>(`${this.apiUrl}/${id}`, { headers })
    );
  }

  // Update a specific branding item
  async updateBrandIdentityModel(
    id: string,
    item: Partial<BrandIdentityModel>
  ): Promise<BrandIdentityModel> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(
      this.http.put<BrandIdentityModel>(`${this.apiUrl}/${id}`, item, {
        headers,
      })
    );
  }

  // Delete a specific branding item
  async deleteBrandIdentityModel(id: string): Promise<void> {
    const headers = await this.getAuthHeaders();
    return firstValueFrom(
      this.http.delete<void>(`${this.apiUrl}/${id}`, { headers })
    );
  }
}
