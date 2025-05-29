import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, throwError, from } from 'rxjs';
import { switchMap, map, take, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { DiagramModel } from '../../models/diagram.model';

@Injectable({
  providedIn: 'root',
})
export class DiagramsService {
  private apiUrl = `${environment.services.api.url}/project/diagrams`;

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
              new Error('User not authenticated for DiagramsService operation')
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

  // Create a new diagram item
  createDiagram(item: DiagramModel): Observable<DiagramModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.post<DiagramModel>(this.apiUrl, item, { headers });
      }),
      tap((response) => console.log('createDiagram response:', response)),
      catchError((error) => {
        console.error('Error in createDiagram:', error);
        return throwError(() => error);
      })
    );
  }

  // Get all diagram items (optionally by projectId)
  getDiagrams(projectId?: string): Observable<DiagramModel[]> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        let url = this.apiUrl;
        if (projectId) {
          url += `?projectId=${projectId}`;
        }
        return this.http.get<DiagramModel[]>(url, { headers });
      }),
      tap((response) => console.log('getDiagrams response:', response)),
      catchError((error) => {
        console.error('Error in getDiagrams:', error);
        return throwError(() => error);
      })
    );
  }

  // Get a specific diagram item by ID
  getDiagramById(id: string): Observable<DiagramModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.get<DiagramModel>(`${this.apiUrl}/${id}`, { headers });
      }),
      tap((response) => console.log('getDiagramById response:', response)),
      catchError((error) => {
        console.error(`Error in getDiagramById for ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Update a specific diagram item
  updateDiagram(
    id: string,
    item: Partial<DiagramModel>
  ): Observable<DiagramModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.put<DiagramModel>(`${this.apiUrl}/${id}`, item, {
          headers,
        });
      }),
      tap((response) => console.log('updateDiagram response:', response)),
      catchError((error) => {
        console.error(`Error in updateDiagram for ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Delete a specific diagram item
  deleteDiagram(id: string): Observable<void> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
      }),
      tap((response) =>
        console.log(`deleteDiagram response for ID ${id}:`, response)
      ),
      catchError((error) => {
        console.error(`Error in deleteDiagram for ID ${id}:`, error);
        return throwError(() => error);
      })
    );
  }
}
