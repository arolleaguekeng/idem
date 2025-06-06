import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CookieService } from '../../../../shared/services/cookie.service';
import { ProjectService } from '../../services/project.service';
import { ProjectModel } from '../../models/project.model';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, SafeHtmlPipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  protected readonly cookieService = inject(CookieService);
  protected readonly projectService = inject(ProjectService);

  readonly project = signal<ProjectModel | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  readonly architectureNamesList = computed(() => {
    const projectData = this.project();
    if (projectData?.analysisResultModel?.architectures && projectData.analysisResultModel.architectures.length > 0) {
      return projectData.analysisResultModel.architectures.map(a => a.name).join(', ');
    }
    return null; // Or 'Details not available', or an empty string, depending on desired template display
  });

  ngOnInit(): void {
    const projectId = this.cookieService.get('projectId');

    if (!projectId) {
      this.error.set('No project selected. Please select a project to view the dashboard.');
      this.isLoading.set(false);
      return;
    }

    this.projectService.getProjectById(projectId).subscribe({
      next: (projectData) => {
        if (projectData) {
          this.project.set(projectData);
        } else {
          this.error.set(`Project with ID ${projectId} not found.`);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching project data for dashboard:', err);
        this.error.set('Failed to load project data. Please try again later.');
        this.isLoading.set(false);
      },
    });
  }

  // Helper to get a relevant icon based on project type - extend as needed
  getProjectTypeIcon(type: string | undefined): string {
    switch (type) {
      case 'web':
        return '🌐'; // Globe icon
      case 'mobile':
        return '📱'; // Mobile phone icon
      case 'iot':
        return '🔗'; // Link icon for IoT
      case 'desktop':
        return '💻'; // Laptop icon
      default:
        return '❓'; // Question mark for unknown
    }
  }
}
