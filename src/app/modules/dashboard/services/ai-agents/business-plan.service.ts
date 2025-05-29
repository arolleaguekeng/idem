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

  // Create a new project planning item
  createPlanningItem(item: BusinessPlanModel): Observable<BusinessPlanModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.post<BusinessPlanModel>(this.apiUrl, item, {
          headers,
        });
      }),
      tap((response) => console.log('createPlanningItem response:', response)),
      catchError((error) => {
        console.error('Error in createPlanningItem:', error);
        throw error;
      })
    );
  }

  // Get all project planning items (optionally by projectId)
  getPlanningItems(projectId?: string): Observable<BusinessPlanModel[]> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        let url = this.apiUrl;
        if (projectId) {
          url += `?projectId=${projectId}`;
        }
        return this.http.get<BusinessPlanModel[]>(url, { headers });
      }),
      tap((response) => console.log('getPlanningItems response:', response)),
      catchError((error) => {
        console.error('Error in getPlanningItems:', error);
        throw error;
      })
    );
  }

  // Get a specific project planning item by ID
  getPlanningItemById(id: string): Observable<BusinessPlanModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.get<BusinessPlanModel>(`${this.apiUrl}/${id}`, {
          headers,
        });
      }),
      tap((response) => console.log('getPlanningItemById response:', response)),
      catchError((error) => {
        console.error(`Error in getPlanningItemById for ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Update a specific project planning item
  updatePlanningItem(
    id: string,
    item: Partial<BusinessPlanModel>
  ): Observable<BusinessPlanModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.put<BusinessPlanModel>(`${this.apiUrl}/${id}`, item, {
          headers,
        });
      }),
      tap((response) => console.log('updatePlanningItem response:', response)),
      catchError((error) => {
        console.error(`Error in updatePlanningItem for ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Delete a specific project planning item
  deletePlanningItem(id: string): Observable<void> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
      }),
      tap((response) =>
        console.log(`deletePlanningItem response for ID ${id}:`, response)
      ),
      catchError((error) => {
        console.error(`Error in deletePlanningItem for ID ${id}:`, error);
        throw error;
      })
    );
  }
}
