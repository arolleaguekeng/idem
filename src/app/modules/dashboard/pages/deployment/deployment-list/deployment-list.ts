import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { DeploymentModel } from '../../../models/deployment.model';
import { CookieService } from '../../../../../shared/services/cookie.service';
import { DeploymentService } from '../../../services/deployment.service';
import { Loader } from "../../../../../components/loader/loader";

@Component({
  selector: 'app-deployment-list',
  standalone: true,
  imports: [CommonModule, RouterLink, Loader],
  templateUrl: './deployment-list.html',
  styleUrl: './deployment-list.css',
})
export class DeploymentList implements OnInit {
  // Angular-initialized properties
  protected readonly deployments = signal<DeploymentModel[]>([]);
  protected readonly loading = signal<boolean>(true);
  protected readonly error = signal<string | null>(null);
  protected readonly projectId = signal<string | null>(null);

  // Services
  private readonly deploymentService = inject(DeploymentService);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    // Get project ID from cookie
    const projectId = this.cookieService.get('projectId');
    this.projectId.set(projectId);

    if (projectId) {
      this.fetchDeployments(projectId);
    } else {
      this.loading.set(false);
      this.error.set('No active project selected');
    }
  }

  DEPLOYMENTS_DATAS: DeploymentModel[] = [
    {
      id: '1',
      name: 'Deployment 1',
      status: 'deployed',
      environment: 'production',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      projectId: '1',
      mode: 'beginner',
      frameworkType: 'angular',
    },
    {
      id: '2',
      name: 'Deployment 2',
      status: 'deployed',
      environment: 'production',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      projectId: '1',
      mode: 'beginner',
      frameworkType: 'angular',
    },
    {
      id: '3',
      name: 'Deployment 3',
      status: 'deployed',
      environment: 'production',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      projectId: '1',
      mode: 'beginner',
      frameworkType: 'angular',
    },
  ];

  protected fetchDeployments(projectId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.deploymentService
      .getProjectDeployments(projectId)
      .pipe(
        tap((deployments) => {
          console.log('Deployments received:', deployments);
          this.deployments.set(deployments);
          this.loading.set(false);
        }),
        catchError((error) => {
          console.error('Error fetching deployments', error);
          this.error.set('Failed to load deployments');
          this.loading.set(false);

          // Fallback to mock data in development
          if (environment.environment === 'dev') {
            console.warn('Using mock deployment data in development mode');
            this.deployments.set(this.DEPLOYMENTS_DATAS);
          }

          return of([]);
        })
      )
      .subscribe();
  }

  protected getStatusClass(status: string): string {
    switch (status) {
      case 'deployed':
        return 'status-success';
      case 'building':
      case 'infrastructure-provisioning':
      case 'deploying':
        return 'status-progress';
      case 'failed':
      case 'cancelled':
        return 'status-error';
      case 'configuring':
      case 'pending':
        return 'status-pending';
      case 'rollback':
        return 'status-warning';
      default:
        return 'status-default';
    }
  }

  /**
   * Navigates to the deployment details page for the selected deployment
   */
  protected viewDeploymentDetails(deploymentId: string, event: MouseEvent): void {
    // Don't trigger if clicking on an interactive element (links, buttons)
    const target = event.target as HTMLElement;
    if (
      target.closest('a') || 
      target.closest('button') || 
      target.tagName.toLowerCase() === 'a' || 
      target.tagName.toLowerCase() === 'button'
    ) {
      return;
    }
    
    // Navigate to the deployment details page
    this.router.navigate(['/console/dashboard', this.projectId(), 'deployment', deploymentId]);
  }

  protected formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  }

  protected truncateUrl(url: string): string {
    if (!url) return 'N/A';
    return url.replace(/^https?:\/\/(www\.)?/, '');
  }
}
