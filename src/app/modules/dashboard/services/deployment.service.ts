import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { DeploymentModel } from '../models/deployment.model';
import { Auth, authState } from '@angular/fire/auth';

// Interfaces nécessaires après la suppression de deployment.api.model.ts
interface GitRepositoryValidationRequest {
  repoUrl: string;
  accessToken?: string;
}

interface GitRepositoryValidationResponse {
  valid: boolean;
  branches: string[];
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DeploymentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.services.api.url}/project`;
  private auth = inject(Auth);

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

  /**
   * Create a new deployment
   * @param deployment The deployment configuration
   */
  createDeployment(
    deployment: Partial<DeploymentModel>
  ): Observable<DeploymentModel> {
    console.log('Creating deployment:', deployment);
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<DeploymentModel>(
          `${this.apiUrl}/deployments/create`,
          deployment,
          {
            headers,
          }
        )
      ),
      tap((createdDeployment) =>
        console.log('Created deployment', createdDeployment)
      ),
      catchError((error) => {
        console.error('Error creating deployment', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get all deployments for a project
   * @param projectId The ID of the project
   */
  getProjectDeployments(projectId: string): Observable<DeploymentModel[]> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<DeploymentModel[]>(
          `${this.apiUrl}/projects/${projectId}/deployments`,
          { headers }
        )
      ),
      tap((deployments) => console.log('Fetched deployments', deployments)),
      catchError((error) => {
        console.error('Error fetching deployments', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a deployment by its ID
   * @param projectId The ID of the project
   * @param deploymentId The ID of the deployment
   */
  getDeploymentById(
    projectId: string,
    deploymentId: string
  ): Observable<DeploymentModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<DeploymentModel>(
          `${this.apiUrl}/projects/${projectId}/deployments/${deploymentId}`,
          { headers }
        )
      ),
      tap((deployment) => console.log('Fetched deployment', deployment)),
      catchError((error) => {
        console.error('Error fetching deployment', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing deployment configuration
   * @param projectId The ID of the project
   * @param deploymentId The ID of the deployment
   * @param updates The deployment updates
   */
  updateDeployment(
    projectId: string,
    deploymentId: string,
    updates: Partial<DeploymentModel>
  ): Observable<DeploymentModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.patch<DeploymentModel>(
          `${this.apiUrl}/projects/${projectId}/deployments/${deploymentId}`,
          updates,
          { headers }
        )
      ),
      tap((updatedDeployment) =>
        console.log('Updated deployment', updatedDeployment)
      ),
      catchError((error) => {
        console.error('Error updating deployment', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Cancel an ongoing deployment
   * @param projectId The ID of the project
   * @param deploymentId The ID of the deployment
   */
  cancelDeployment(
    projectId: string,
    deploymentId: string
  ): Observable<DeploymentModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<DeploymentModel>(
          `${this.apiUrl}/projects/${projectId}/deployments/${deploymentId}/cancel`,
          {},
          { headers }
        )
      ),
      tap((deployment) => console.log('Cancelled deployment', deployment)),
      catchError((error) => {
        console.error('Error cancelling deployment', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Trigger a redeployment of an existing deployment
   * @param projectId The ID of the project
   * @param deploymentId The ID of the deployment
   */
  redeployDeployment(
    projectId: string,
    deploymentId: string
  ): Observable<DeploymentModel> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<DeploymentModel>(
          `${this.apiUrl}/projects/${projectId}/deployments/${deploymentId}/redeploy`,
          {},
          { headers }
        )
      ),
      tap((deployment) => console.log('Redeployed', deployment)),
      catchError((error) => {
        console.error('Error redeploying', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get deployment logs
   * @param projectId The ID of the project
   * @param deploymentId The ID of the deployment
   */
  getDeploymentLogs(
    projectId: string,
    deploymentId: string
  ): Observable<string> {
    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get(
          `${this.apiUrl}/projects/${projectId}/deployments/${deploymentId}/logs`,
          { headers, responseType: 'text' }
        )
      ),
      tap((logs) => console.log('Fetched logs')),
      catchError((error) => {
        console.error('Error fetching logs', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Validate Git repository and fetch available branches
   * @param repoUrl The repository URL
   * @param accessToken Optional access token for private repositories
   */
  validateGitRepository(
    repoUrl: string,
    accessToken?: string
  ): Observable<string[]> {
    const request: GitRepositoryValidationRequest = {
      repoUrl,
      accessToken,
    };

    return this.getAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<GitRepositoryValidationResponse>(
          `${this.apiUrl}/git/validate`,
          request,
          { headers }
        )
      ),
      map((response) => response.branches),
      tap((branches) => console.log('Fetched branches', branches)),
      catchError((error) => {
        console.error('Error validating repository', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get cloud provider regions
   * @param provider The cloud provider type
   */
  getProviderRegions(
    provider: 'aws' | 'gcp' | 'azure'
  ): Observable<{ id: string; name: string }[]> {
    return this.http
      .get<{ id: string; name: string }[]>(
        `${this.apiUrl}/cloud/${provider}/regions`
      )
      .pipe(
        tap((regions) => console.log(`Fetched ${provider} regions`, regions)),
        catchError((error) => {
          console.error(`Error fetching ${provider} regions`, error);
          return throwError(() => error);
        })
      );
  }
}
