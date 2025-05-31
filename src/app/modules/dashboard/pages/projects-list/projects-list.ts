import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ProjectModel } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Loader } from '../../../../components/loader/loader';
import { SafeHtmlPipe } from './safehtml.pipe';
import { AuthService } from '../../../auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { first, Observable, of } from 'rxjs';

@Component({
  selector: 'app-projects-list',
  imports: [Loader, AsyncPipe, DatePipe, SafeHtmlPipe],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsList implements OnInit {
  // Services
  private readonly projectService = inject(ProjectService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // Data signals and state
  protected readonly userProjects$ = signal<Observable<ProjectModel[]>>(of([]));
  protected readonly recentProjects = signal<ProjectModel[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly isMenuOpen = signal(false);
  protected readonly isDropdownOpen = signal(false);
  protected readonly user$ = this.auth.user$;
  @ViewChild('menu') menuRef!: ElementRef;
  ngOnInit() {
    try {
      this.user$.pipe(first()).subscribe((user) => {
        if (user) {
          this.projectService.getProjects().subscribe((projects) => {
            console.log('projects', projects);
            this.recentProjects.set(
              projects
                .slice()
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, 3)
            );
          });
        } else {
          console.log('User not found');
        }
        this.isLoading.set(false);
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      this.isLoading.set(false);
    }
  }

  /**
   * Toggle main menu visibility
   */
  protected toggleMenu() {
    this.isMenuOpen.update((open) => !open);
  }

  /**
   * Toggle user dropdown menu visibility
   */
  protected toggleDropdown() {
    this.isDropdownOpen.update((open) => !open);
  }

  /**
   * Logout user and navigate to login page
   */
  protected logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Navigate to project dashboard and set project cookie
   */
  protected openProjectDashboard(projectId: string) {
    this.isDropdownOpen.set(false);

    // Navigate to updated route format (simplified path)
    this.router.navigate([`console/dashboard/${projectId}`]);
  }
}
