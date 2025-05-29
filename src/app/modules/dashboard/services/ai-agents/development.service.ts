import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, throwError, from } from 'rxjs';
import { switchMap, map, take, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

// Define a basic interface for Development items
export interface DevelopmentItem {
  id?: string;
  taskName: string;
  status?: string;
  // Add other properties as needed
}

@Injectable({
  providedIn: 'root',
})
export class DevelopmentService {
  private apiUrl = `${environment.services.api.url}/project/developments`;

  private http = inject(HttpClient);
  private auth = inject(Auth);

  constructor() {}

  private getAuthHeaders(): Observable<HttpHeaders> {
    return authState(this.auth).pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return throwError(() => new Error('User not authenticated for DevelopmentService operation'));
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

  // Create a new development item
  createDevelopmentItem(item: DevelopmentItem): Observable<DevelopmentItem> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.post<DevelopmentItem>(this.apiUrl, item, { headers });
      }),
      tap(response => console.log('createDevelopmentItem response:', response)),
      catchError(error => {
        console.error('Error in createDevelopmentItem:', error);
        throw error;
      })
    );
  }

  // Get all development items
  getDevelopmentItems(): Observable<DevelopmentItem[]> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.get<DevelopmentItem[]>(this.apiUrl, { headers });
      }),
      tap(response => console.log('getDevelopmentItems response:', response)),
      catchError(error => {
        console.error('Error in getDevelopmentItems:', error);
        throw error;
      })
    );
  }

  // Get a specific development item by ID
  getDevelopmentItemById(id: string): Observable<DevelopmentItem> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.get<DevelopmentItem>(`${this.apiUrl}/${id}`, { headers });
      }),
      tap(response => console.log('getDevelopmentItemById response:', response)),
      catchError(error => {
        console.error(`Error in getDevelopmentItemById for ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Update a specific development item
  updateDevelopmentItem(id: string, item: Partial<DevelopmentItem>): Observable<DevelopmentItem> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.put<DevelopmentItem>(`${this.apiUrl}/${id}`, item, { headers });
      }),
      tap(response => console.log('updateDevelopmentItem response:', response)),
      catchError(error => {
        console.error(`Error in updateDevelopmentItem for ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Delete a specific development item
  deleteDevelopmentItem(id: string): Observable<void> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
      }),
      tap(response => console.log(`deleteDevelopmentItem response for ID ${id}:`, response)),
      catchError(error => {
        console.error(`Error in deleteDevelopmentItem for ID ${id}:`, error);
        throw error;
      })
    );
  }
}