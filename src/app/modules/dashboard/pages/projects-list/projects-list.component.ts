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
import { LoaderComponent } from '../../../../components/loader/loader.component';
import { SafeHtmlPipe } from './safehtml.pipe';
import { AuthService } from '../../../auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-projects-list',
  imports: [DatePipe, LoaderComponent, SafeHtmlPipe,AsyncPipe,RouterLink],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsListComponent implements OnInit {
  userProjects: ProjectModel[] = [];
  recentProjects: ProjectModel[] = [];
  projectService = inject(ProjectService);
  auth = inject(AuthService);
  user$ = this.auth.user$;
  isLoading = signal(true);
  isMenuOpen = false;
  isDropdownOpen = false;
  router = inject(Router);
  @ViewChild('menu') menuRef!: ElementRef;
  async ngOnInit() {
    try {
      this.userProjects = await this.projectService.getAllUserProjects();
      this.recentProjects = this.userProjects
        .slice()
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 3);
      console.log('userProjects', this.userProjects);
      this.isLoading.set(false);
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
