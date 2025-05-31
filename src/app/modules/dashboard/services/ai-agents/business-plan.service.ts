import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, throwError, from } from 'rxjs';
import { switchMap, map, take, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { BusinessPlanModel } from '../../models/businessPlan.model';

@Injectable({
  providedIn: 'root',
})
export class BusinessPlanService {
  private apiUrl = `${environment.services.api.url}/project/businessPlans`;

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
              new Error(
                'User not authenticated for BusinessPlanService operation'
              )
          );
        }
        return from(user.getIdToken());
      }),
      map((token) => {
        return new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
      })
    );
  }

  // Create a new project businessplan item
  createBusinessplanItem(projectId: string): Observable<BusinessPlanModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.post<BusinessPlanModel>(
          `${this.apiUrl}/${projectId}`,
          {},
          {
            headers,
          }
        );
      }),
      tap((response) =>
        console.log('createBusinessplanItem response:', response)
      ),
      catchError((error) => {
        console.error('Error in createBusinessplanItem:', error);
        throw error;
      })
    );
  }

  // Get all project businessplan items (optionally by projectId)
  getBusinessplanItems(projectId?: string): Observable<BusinessPlanModel[]> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        let url = this.apiUrl;
        if (projectId) {
          url += `?projectId=${projectId}`;
        }
        return this.http.get<BusinessPlanModel[]>(url, { headers });
      }),
      tap((response) =>
        console.log('getBusinessplanItems response:', response)
      ),
      catchError((error) => {
        console.error('Error in getBusinessplanItems:', error);
        throw error;
      })
    );
  }

  // Get a specific project businessplan item by ID
  getBusinessplanItemById(id: string): Observable<BusinessPlanModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.get<BusinessPlanModel>(`${this.apiUrl}/${id}`, {
          headers,
        });
      }),
      tap((response) =>
        console.log('getBusinessplanItemById response:', response)
      ),
      catchError((error) => {
        console.error(`Error in getBusinessplanItemById for ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Update a specific project businessplan item
  updateBusinessplanItem(
    id: string,
    item: Partial<BusinessPlanModel>
  ): Observable<BusinessPlanModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.put<BusinessPlanModel>(`${this.apiUrl}/${id}`, item, {
          headers,
        });
      }),
      tap((response) =>
        console.log('updateBusinessplanItem response:', response)
      ),
      catchError((error) => {
        console.error(`Error in updateBusinessplanItem for ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Delete a specific project businessplan item
  deleteBusinessplanItem(id: string): Observable<void> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
      }),
      tap((response) =>
        console.log(`deleteBusinessplanItem response for ID ${id}:`, response)
      ),
      catchError((error) => {
        console.error(`Error in deleteBusinessplanItem for ID ${id}:`, error);
        throw error;
      })
    );
  }
}
