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

  // Create a new diagram
  createDiagramModel(projectId: string): Observable<DiagramModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.post<DiagramModel>(
          `${this.apiUrl}/generate/${projectId}`,
          {},
          { headers }
        );
      }),
      tap((response) => console.log('createDiagramModel response:', response)),
      catchError((error) => {
        console.error('Error in createDiagramModel:', error);
        throw error;
      })
    );
  }

  // Get all diagrams for a project
  getDiagramModels(projectId: string): Observable<DiagramModel[]> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.get<DiagramModel[]>(
          `${this.apiUrl}?projectId=${projectId}`,
          { headers }
        );
      }),
      tap((response) => console.log('getDiagramModels response:', response)),
      catchError((error) => {
        console.error('Error in getDiagramModels:', error);
        throw error;
      })
    );
  }

  // Get a specific diagram by project ID
  getDiagramModelById(projectId: string): Observable<DiagramModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.get<DiagramModel>(
          `${this.apiUrl}/getAll/${projectId}`,
          { headers }
        );
      }),
      tap((response) => console.log('getDiagramModelById response:', response)),
      catchError((error) => {
        console.error(
          `Error in getDiagramModelById for ID ${projectId}:`,
          error
        );
        throw error;
      })
    );
  }

  // Update a specific diagram
  updateDiagramModel(
    id: string,
    item: Partial<DiagramModel>
  ): Observable<DiagramModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.put<DiagramModel>(`${this.apiUrl}/${id}`, item, {
          headers,
        });
      }),
      tap((response) => console.log('updateDiagramModel response:', response)),
      catchError((error) => {
        console.error(`Error in updateDiagramModel for ID ${id}:`, error);
        throw error;
      })
    );
  }

  // Delete a specific diagram
  deleteDiagramModel(id: string): Observable<void> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
      }),
      tap((response) =>
        console.log(`deleteDiagramModel response for ID ${id}:`, response)
      ),
      catchError((error) => {
        console.error(`Error in deleteDiagramModel for ID ${id}:`, error);
        throw error;
      })
    );
  }
}
