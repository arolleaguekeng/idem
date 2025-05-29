import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, throwError, from } from 'rxjs';
import { switchMap, map, take, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

// Define a basic interface for Diagram items
export interface DiagramItem {
  id?: string;
  name: string;
  type: string;
  data: any;
  summary: string;
}

@Injectable({
  providedIn: 'root',
})
export class DiagramService {
  private apiUrl = `${environment.services.api.url}/project/diagrams`;

  private http = inject(HttpClient);
  private auth = inject(Auth);

  constructor() {}

  private getAuthHeaders(): Observable<HttpHeaders> {
    return authState(this.auth).pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return throwError(() => new Error('User not authenticated for DiagramService operation'));
        }
        return from(user.getIdToken());
      }),
      map(token => {
        if (!token) {
          throw new Error('Failed to retrieve ID token. User authenticated but token is null.');
        }
        return new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
      }),
      catchError(error => {
        console.error('Error in getAuthHeaders:', error.message);
        return throwError(() => new Error('Authentication header could not be generated: ' + error.message));
      })
    );
  }

  // Create a new diagram item
  createDiagram(item: DiagramItem): Observable<DiagramItem> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.post<DiagramItem>(this.apiUrl, item, { headers });
      }),
      tap(response => console.log('createDiagram response:', response)),
      catchError(error => {
        console.error('Error in createDiagram:', error);
        return throwError(() => error);
      })
    );
  }

  // Get all diagram items (optionally by projectId)
  getDiagrams(projectId?: string): Observable<DiagramItem[]> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        let url = this.apiUrl;
        if (projectId) {
          url += `?projectId=${projectId}`;
        }
        return this.http.get<DiagramItem[]>(url, { headers });
      }),
      tap(response => console.log('getDiagrams response:', response)),
      catchError(error => {
        console.error('Error in getDiagrams:', error);
        return throwError(() => error);
      })
    );
  }

  // Get a specific diagram item by ID
  getDiagramById(id: string): Observable<DiagramItem> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.get<DiagramItem>(`${this.apiUrl}/${id}`, { headers });
      }),
      tap(response => console.log('getDiagramById response:', response)),
      catchError(error => {
        console.error(`Error in getDiagramById for ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Update a specific diagram item
  updateDiagram(id: string, item: Partial<DiagramItem>): Observable<DiagramItem> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.put<DiagramItem>(`${this.apiUrl}/${id}`, item, { headers });
      }),
      tap(response => console.log('updateDiagram response:', response)),
      catchError(error => {
        console.error(`Error in updateDiagram for ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Delete a specific diagram item
  deleteDiagram(id: string): Observable<void> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
      }),
      tap(response => console.log(`deleteDiagram response for ID ${id}:`, response)),
      catchError(error => {
        console.error(`Error in deleteDiagram for ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }
}
