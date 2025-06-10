import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, throwError, from } from 'rxjs';
import { switchMap, map, take, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ProjectModel } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = `${environment.services.api.url}/projects`;

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
              new Error('User not authenticated for ProjectService operation')
          );
        }
        return from(user.getIdToken());
      }),
      map((token) => {
        if (!token) {
          throw new Error(
            'Failed to retrieve ID token. User authenticated but token is null.'
          );
        }
        return new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });
      }),
      catchError((error) => {
        console.error(
          'Error in getAuthHeaders for ProjectService:',
          error.message
        );
        return throwError(
          () =>
            new Error(
              'Authentication header could not be generated for ProjectService: ' +
                error.message
            )
        );
      })
    );
  }

  createProject(projectData: ProjectModel): Observable<string> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.post<{ message: string; projectId: string }>(
          `${this.apiUrl}/create`,
          projectData,
          {
            headers,
          }
        );
      }),
      map((response) => response.projectId),
      tap((projectId) => console.log('createProject response:', projectId)),
      catchError((error) => {
        console.error('Error in createProject:', error);
        return throwError(() => error);
      })
    );
  }

  getProjects(): Observable<ProjectModel[]> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.get<ProjectModel[]>(`${this.apiUrl}`, {
          headers,
        });
      }),
      tap((response) => console.log('getProjects response:', response)),
      catchError((error) => {
        console.error('Error in getProjects:', error);
        return throwError(() => error);
      })
    );
  }

  getProjectById(projectId: string): Observable<ProjectModel | null> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.get<ProjectModel>(`${this.apiUrl}/get/${projectId}`, {
          headers,
        });
      }),
      tap((response) =>
        console.log(`getProjectById response for ${projectId}:`, response)
      ),
      catchError((error) => {
        console.error(`Error in getProjectById for ${projectId}:`, error);
        return throwError(() => error);
      })
    );
  }

  updateProject(
    projectId: string,
    updatedData: Partial<ProjectModel>
  ): Observable<ProjectModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.put<ProjectModel>(
          `${this.apiUrl}/update/${projectId}`,
          updatedData,
          { headers }
        );
      }),
      tap((response) =>
        console.log(`updateProject response for ${projectId}:`, response)
      ),
      catchError((error) => {
        console.error(`Error in updateProject for ${projectId}:`, error);
        return throwError(() => error);
      })
    );
  }

  deleteProject(projectId: string): Observable<void> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) => {
        return this.http.delete<void>(`${this.apiUrl}/delete/${projectId}`, {
          headers,
        });
      }),
      tap((response) =>
        console.log(`deleteProject response for ${projectId}:`, response)
      ),
      catchError((error) => {
        console.error(`Error in deleteProject for ${projectId}:`, error);
        return throwError(() => error);
      })
    );
  }

  getProjectDescriptionForPrompt(project: ProjectModel) {
    const projectDescription = `
        Projet à analyser :
        - Nom du projet: ${project.name}
        - Description du projet : ${project.description}
        - Type d'application : ${project.type}
        - Contraintes techniques principales : ${project.constraints.join(', ')}
        - Composition de l'équipe : ${project.teamSize} développeurs
        - Périmètre fonctionnel couvert : ${project.scope}
        - Fourchette budgétaire prévue : ${project.budgetIntervals}
        - Publics cibles concernés : ${project.targets}
`;

    return projectDescription;
  }
}
