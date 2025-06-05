import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, throwError, from } from 'rxjs';
import { switchMap, map, take, catchError, tap } from 'rxjs/operators';
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

  private getAuthHeaders(): Observable<HttpHeaders> {
    return authState(this.auth).pipe(
      take(1),
      switchMap((user) => {
        if (!user) {
          return throwError(
            () =>
              new Error('User not authenticated for BrandingService operation')
          );
        }
        return from(user.getIdToken()); // Convert Promise<string> to Observable<string>
      }),
      map((token) => {
        return new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
      })
    );
  }

  // Create a new branding item
  createBrandIdentityModel(projectId: string): Observable<BrandIdentityModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.post<BrandIdentityModel>(
          `${this.apiUrl}/generate/${projectId}`,
          {},
          { headers }
        );
      }),
      tap((response) =>
        console.log('createBrandIdentityModel response:', response)
      ),
      catchError((error) => {
        console.error('Error in createBrandIdentityModel:', error);
        throw error;
      })
    );
  }

  // Generate Logo Colors and Typography for a project
  generateLogoColorsAndTypography(
    projectId: string
  ): Observable<BrandIdentityModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.post<BrandIdentityModel>(
          `${this.apiUrl}/genColorsAndTypography/${projectId}`,
          { headers }
        );
      }),
      tap((response) =>
        console.log('generateLogoColorsAndTypography response:', response)
      ),
      catchError((error) => {
        console.error('Error in generateLogoColorsAndTypography:', error);
        throw error;
      })
    );
  }

  // Get all branding items for a project (assuming API needs projectId for filtering)
  // If API doesn't filter by projectId here, this might need adjustment or projectId removed.
  getBrandIdentityModels(projectId: string): Observable<BrandIdentityModel[]> {
    // Assuming the API endpoint for all items is just this.apiUrl
    // and filtering by projectId is either done by the backend via token or needs a query param.
    // For now, let's assume the GET to this.apiUrl returns all accessible items.
    // If it needs a projectId in the path or query, this URL formation needs to change.
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.get<BrandIdentityModel[]>(
          `${this.apiUrl}?projectId=${projectId}`,
          { headers }
        ); // Example: using projectId as query param
      }),
      tap((response) =>
        console.log('getBrandIdentityModels response:', response)
      ),
      catchError((error) => {
        console.error('Error in getBrandIdentityModels:', error);
        throw error;
      })
    );
  }

  // Get a specific branding item by ID
  getBrandIdentityModelById(projectId: string): Observable<BrandIdentityModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.get<BrandIdentityModel>(
          `${this.apiUrl}/getAll/${projectId}`,
          { headers }
        );
      }),
      tap((response) =>
        console.log('getBrandIdentityModelById response:', response)
      ),
      catchError((error) => {
        console.error(
          `Error in getBrandIdentityModelById for ID ${projectId}:`,
          error
        );
        throw error;
      })
    );
  }

  // Update a specific branding item
  updateBrandIdentityModel(
    id: string,
    item: Partial<BrandIdentityModel>
  ): Observable<BrandIdentityModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.put<BrandIdentityModel>(`${this.apiUrl}/${id}`, item, {
          headers,
        });
      }),
      tap((response) =>
        console.log('updateBrandIdentityModel response:', response)
      ),
      catchError((error) => {
        console.error(`Error in updateBrandIdentityModel for ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Delete a specific branding item
  deleteBrandIdentityModel(id: string): Observable<void> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
      }),
      tap((response) =>
        console.log('deleteBrandIdentityModel response for ID ${id}:', response)
      ),
      catchError((error) => {
        console.error(`Error in deleteBrandIdentityModel for ID ${id}:`, error);
        throw error;
      })
    );
  }
}
