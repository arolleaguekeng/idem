import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, throwError, from } from 'rxjs';
import { switchMap, map, take, catchError, tap } from 'rxjs/operators';
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

  private getAuthHeaders(): Observable<HttpHeaders> {
    return authState(this.auth).pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return throwError(() => new Error('User not authenticated for DeploymentService operation'));
        }
        return from(user.getIdToken()); // Convert Promise<string> to Observable<string>
      }),
      map(token => {
        return new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
      })
    );
  }

  // Create a new deployment item
  createDeploymentItem(item: DeploymentItem): Observable<DeploymentItem> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.post<DeploymentItem>(this.apiUrl, item, { headers });
      }),
      tap(response => console.log('createDeploymentItem response:', response)),
      catchError(error => {
        console.error('Error in createDeploymentItem:', error);
        throw error;
      })
    );
  }

  // Get all deployment items
  getDeploymentItems(): Observable<DeploymentItem[]> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.get<DeploymentItem[]>(this.apiUrl, { headers });
      }),
      tap(response => console.log('getDeploymentItems response:', response)),
      catchError(error => {
        console.error('Error in getDeploymentItems:', error);
        throw error;
      })
    );
  }

  // Get a specific deployment item by ID
  getDeploymentItemById(id: string): Observable<DeploymentItem> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.get<DeploymentItem>(`${this.apiUrl}/${id}`, { headers });
      }),
      tap(response => console.log('getDeploymentItemById response:', response)),
      catchError(error => {
        console.error(`Error in getDeploymentItemById for ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Update a specific deployment item
  updateDeploymentItem(id: string, item: Partial<DeploymentItem>): Observable<DeploymentItem> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.put<DeploymentItem>(`${this.apiUrl}/${id}`, item, { headers });
      }),
      tap(response => console.log('updateDeploymentItem response:', response)),
      catchError(error => {
        console.error(`Error in updateDeploymentItem for ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Delete a specific deployment item
  deleteDeploymentItem(id: string): Observable<void> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
      }),
      tap(response => console.log(`deleteDeploymentItem response for ID ${id}:`, response)),
      catchError(error => {
        console.error(`Error in deleteDeploymentItem for ID ${id}:`, error);
        throw error;
      })
    );
  }
}