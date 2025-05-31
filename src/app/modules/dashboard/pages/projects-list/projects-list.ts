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
  imports: [DatePipe, Loader, SafeHtmlPipe, AsyncPipe, RouterLink],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsList implements OnInit {
  userProjects$: Observable<ProjectModel[]> = of([]);
  recentProjects: ProjectModel[] = [];
  projectService = inject(ProjectService);
  auth = inject(AuthService);
  user$ = this.auth.user$;
  isLoading = signal(true);
  isMenuOpen = false;
  isDropdownOpen = false;
  router = inject(Router);
  @ViewChild('menu') menuRef!: ElementRef;
  ngOnInit() {
    try {
      this.user$.pipe(first()).subscribe((user) => {
        if (user) {
          this.userProjects$ = this.projectService.getProjects();
          this.userProjects$.subscribe((projects) => {
            this.recentProjects = projects
              .slice()
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .slice(0, 3);
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

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // navigateTo(path: string) {
  //   this.isDropdownOpen = false;
  //   this.router.navigate([`/${path}`]);
  // }

  logout() {
    this.isDropdownOpen = false;
    this.auth.logout();
    // this.router.navigate(['/login']);
  }

  openProjectDashboard(projectId: string) {
    this.isDropdownOpen = false;
    this.router.navigate([`console/${projectId}/dashboard/${projectId}`]);
  }
}
