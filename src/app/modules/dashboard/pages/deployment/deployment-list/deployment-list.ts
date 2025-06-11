import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { DeploymentModel } from '../../../models/deployment.model';
import { CookieService } from '../../../../../shared/services/cookie.service';
import { DeploymentService } from '../../../services/deployment.service';

@Component({
  selector: 'app-deployment-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

  protected fetchDeployments(projectId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.deploymentService
      .getProjectDeployments(projectId)
      .pipe(
        tap((deployments) => {
          this.deployments.set(deployments);
          this.loading.set(false);
        }),
        catchError((error) => {
          console.error('Error fetching deployments', error);
          this.error.set('Failed to load deployments');
          this.loading.set(false);
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

  protected formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  }

  protected truncateUrl(url: string): string {
    if (!url) return 'N/A';
    return url.replace(/^https?:\/\/(www\.)?/, '');
  }
}
