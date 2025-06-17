import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { DeploymentModel } from '../models/deployment.model';

@Injectable({
  providedIn: 'root'
})
export class DeploymentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.services.api.url;
  
  /**
   * Get all deployments for a project
   * @param projectId The ID of the project
   */
  getProjectDeployments(projectId: string): Observable<DeploymentModel[]> {
    return this.http.get<DeploymentModel[]>(`${this.apiUrl}/projects/${projectId}/deployments`).pipe(
      tap(deployments => console.log('Fetched deployments', deployments)),
      catchError(error => {
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
  getDeployment(projectId: string, deploymentId: string): Observable<DeploymentModel> {
    return this.http.get<DeploymentModel>(`${this.apiUrl}/projects/${projectId}/deployments/${deploymentId}`).pipe(
      tap(deployment => console.log('Fetched deployment', deployment)),
      catchError(error => {
        console.error('Error fetching deployment', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new deployment
   * @param projectId The ID of the project
   * @param deployment The deployment configuration
   */
  createDeployment(projectId: string, deployment: Partial<DeploymentModel>): Observable<DeploymentModel> {
    return this.http.post<DeploymentModel>(`${this.apiUrl}/projects/${projectId}/deployments`, deployment).pipe(
      tap(createdDeployment => console.log('Created deployment', createdDeployment)),
      catchError(error => {
        console.error('Error creating deployment', error);
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
  updateDeployment(projectId: string, deploymentId: string, updates: Partial<DeploymentModel>): Observable<DeploymentModel> {
    return this.http.patch<DeploymentModel>(`${this.apiUrl}/projects/${projectId}/deployments/${deploymentId}`, updates).pipe(
      tap(updatedDeployment => console.log('Updated deployment', updatedDeployment)),
      catchError(error => {
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
  cancelDeployment(projectId: string, deploymentId: string): Observable<DeploymentModel> {
    return this.http.post<DeploymentModel>(`${this.apiUrl}/projects/${projectId}/deployments/${deploymentId}/cancel`, {}).pipe(
      tap(deployment => console.log('Cancelled deployment', deployment)),
      catchError(error => {
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
  redeployDeployment(projectId: string, deploymentId: string): Observable<DeploymentModel> {
    return this.http.post<DeploymentModel>(`${this.apiUrl}/projects/${projectId}/deployments/${deploymentId}/redeploy`, {}).pipe(
      tap(deployment => console.log('Redeployed', deployment)),
      catchError(error => {
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
  getDeploymentLogs(projectId: string, deploymentId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/projects/${projectId}/deployments/${deploymentId}/logs`, { responseType: 'text' }).pipe(
      tap(logs => console.log('Fetched logs')),
      catchError(error => {
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
  validateRepository(repoUrl: string, accessToken?: string): Observable<string[]> {
    return this.http.post<{branches: string[]}>(`${this.apiUrl}/git/validate`, { repoUrl, accessToken }).pipe(
      map(response => response.branches),
      tap(branches => console.log('Fetched branches', branches)),
      catchError(error => {
        console.error('Error validating repository', error);
        return throwError(() => error);
      })
    );
  }
  
  /**
   * Get cloud provider regions
   * @param provider The cloud provider type
   */
  getProviderRegions(provider: 'aws' | 'gcp' | 'azure'): Observable<{id: string, name: string}[]> {
    return this.http.get<{id: string, name: string}[]>(`${this.apiUrl}/cloud/${provider}/regions`).pipe(
      tap(regions => console.log(`Fetched ${provider} regions`, regions)),
      catchError(error => {
        console.error(`Error fetching ${provider} regions`, error);
        return throwError(() => error);
      })
    );
  }
}
