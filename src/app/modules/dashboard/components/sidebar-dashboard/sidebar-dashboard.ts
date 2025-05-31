import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
  OnInit,
  signal,
  computed,
  effect,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';
import { AuthService } from '../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Select, SelectChangeEvent } from 'primeng/select';
import { ProjectService } from '../../services/project.service';
import { ProjectModel } from '../../models/project.model';
import { SelectElement } from '../../pages/create-project/datas';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { CookieService } from '../../../../shared/services/cookie.service';

@Component({
  selector: 'app-sidebar-dashboard',
  templateUrl: './sidebar-dashboard.html',
  styleUrls: ['./sidebar-dashboard.css'],
  standalone: true,
  imports: [PanelMenu, Select, CommonModule, FormsModule],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateY(0%)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarDashboard implements OnInit {
  // Services and Router
  private readonly auth = inject(AuthService);
  private readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  private readonly cookieService = inject(CookieService);

  // Signals for UI State
  items = signal<MenuItem[]>([]);
  isLoading = signal(true);
  isMenuOpen = signal(false);
  isDropdownOpen = signal(false);

  // User and Project Data Signals
  protected readonly user = toSignal(this.auth.user$);
  private readonly _userProjects = signal<ProjectModel[]>([]);
  protected readonly selectedProject = signal<SelectElement | undefined>(
    undefined
  );
  protected readonly projectIdFromCookie = signal<string | null>(null);

  // Computed signal for dropdown project list
  dropDownProjects = computed(() => {
    return this._userProjects().map((p) => ({
      name: p.name,
      code: p.id!,
    }));
  });

  @ViewChild('menu') menuRef!: ElementRef;

  constructor() {
    // Initialize projectIdFromCookie from saved cookie
    const savedProjectId = this.cookieService.get('projectId');
    if (savedProjectId) {
      this.projectIdFromCookie.set(savedProjectId);
    }

    // Effect to update sidebar menu when selectedProject changes
    effect(() => {
      if (this.selectedProject()) {
        this.updateSidebarRoutes();
      }
    });

    // Effect to react to projectIdFromCookie changes and user's projects list
    effect(
      () => {
        const projects = this._userProjects();
        const cookieId = this.projectIdFromCookie();
        const isLoadingProjects = this.isLoading();

        if (isLoadingProjects) {
          return; // Wait for projects to load
        }

        if (cookieId) {
          const projectFromCookie = projects.find((p) => p.id === cookieId);
          if (projectFromCookie) {
            // Valid project from cookie - set it as selected
            this.selectedProject.set({
              name: projectFromCookie.name,
              code: cookieId,
            });
          } else {
            // Invalid project ID in cookie
            if (projects.length > 0) {
              console.warn(
                `Project ID '${cookieId}' from cookie not found. Using first project instead.`
              );
              const firstProject = projects[0];
              // Set first project as selected and save to cookie
              this.selectedProject.set({
                name: firstProject.name,
                code: firstProject.id!,
              });
              this.cookieService.set('projectId', firstProject.id!);
            } else {
              // No projects available, and cookie ID is invalid
              this.selectedProject.set(undefined);
              this.cookieService.remove('projectId');
            }
          }
        } else {
          // No project ID in cookie
          if (projects.length > 0) {
            // Select the first project by default if no specific project in cookie
            const firstProject = projects[0];
            this.selectedProject.set({
              name: firstProject.name,
              code: firstProject.id!,
            });
            this.cookieService.set('projectId', firstProject.id!);
          } else {
            // No projects and no cookie ID
            this.selectedProject.set(undefined);
          }
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit() {
    this.isLoading.set(true);
    this.auth.user$
      .pipe(
        first(),
        switchMap((user) => {
          if (!user) {
            console.log('User not authenticated.');
            this._userProjects.set([]);
            this.isLoading.set(false);
            return EMPTY;
          }
          return this.projectService.getProjects(); // Fetches projects
        })
      )
      .subscribe({
        next: (projects) => {
          this._userProjects.set(projects);
          const initialCookieId = this.cookieService.get('projectId'); // Get ID from cookie


          if (projects.length > 0) {
            if (!initialCookieId) {
              // No project ID in cookie on initial load, save to cookie and navigate to the first project
              console.log(
                'No initial project ID in cookie, navigating to first project.'
              );
              const firstProject = projects[0];
              this.cookieService.set('projectId', firstProject.id!);
              this.router.navigate([`console/dashboard/${firstProject.id!}`], {
                replaceUrl: true,
              });
            } else {
              const projectExists = projects.find(
                (p) => p.id === initialCookieId
              );
              if (!projectExists) {
                // Initial project ID from URL is invalid (not in user's list)
                console.warn(
                  `Initial project ID '${initialCookieId}' not found. Navigating to first project.`
                );
                const firstProject = projects[0];
                this.cookieService.set('projectId', firstProject.id!);
                this.router.navigate(
                  [`console/dashboard/${firstProject.id!}`],
                  { replaceUrl: true }
                );
              }
              // If initialCookieId is valid, the effect will handle setting selectedProject.
            }
          } else {
            // No projects for the user
            console.log('User has no projects.');
            // If there was an initialCookieId, it's effectively invalid now.
            // The effect will set selectedProject to undefined.
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching projects in ngOnInit:', err);
          this._userProjects.set([]);
          this.isLoading.set(false);
        },
      });
  }

  onProjectChange(event: SelectChangeEvent) {
    const projectId = event.value?.code;
    if (projectId) {
      // Save selected project to cookie
      this.cookieService.set('projectId', projectId);
      this.projectIdFromCookie.set(projectId);

      // Navigate to the project dashboard
      this.router.navigate([`/console/dashboard/${projectId}`]);
    }
  }

  updateSidebarRoutes() {
    const selectedProjectId = this.selectedProject()?.code;
    if (!selectedProjectId) return;

    this.items.set([
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        command: () =>
          this.navigateTo(`console/dashboard/${selectedProjectId}`),
      },
      {
        label: 'Branding',
        icon: 'pi pi-fw pi-palette',
        command: () => this.navigateTo(`console/branding/${selectedProjectId}`),
      },
      {
        label: 'Planing',
        icon: 'pi pi-fw pi-calendar',
        command: () => this.navigateTo(`console/planing/${selectedProjectId}`),
      },
      {
        label: 'Diagrams',
        icon: 'pi pi-fw pi-chart-line',
        command: () => this.navigateTo(`console/diagrams/${selectedProjectId}`),
      },
      {
        label: 'Landing',
        icon: 'pi pi-fw pi-desktop',
        command: () => this.navigateTo(`console/landing/${selectedProjectId}`),
      },
      {
        label: 'Tests',
        icon: 'pi pi-fw pi-check-square',
        command: () => this.navigateTo(`console/tests/${selectedProjectId}`),
      },
      {
        label: 'Developement',
        icon: 'pi pi-fw pi-code',
        command: () =>
          this.navigateTo(`console/developement/${selectedProjectId}`),
      },
    ]);
  }

  toggleMenu() {
    this.isMenuOpen.update((open) => !open);
  }

  toggleDropdown() {
    this.isDropdownOpen.update((open) => !open);
  }

  navigateTo(path: string) {
    this.isDropdownOpen.set(false);
    // Ne pas ajouter de slash car les chemins de menu incluent déjà 'console/'
    this.router.navigate([path]);
  }

  logout() {
    this.isDropdownOpen.set(false);
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (
      this.isMenuOpen() &&
      this.menuRef &&
      !this.menuRef.nativeElement.contains(event.target)
    ) {
      this.isMenuOpen.set(false);
    }
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutsideDropdown(targetElement: HTMLElement) {
    const dropdownButton = targetElement.closest('button.flex.items-center');
    const dropdownMenu = targetElement.closest('.fixed.right-0.mt-2');

    if (this.isDropdownOpen() && !dropdownButton && !dropdownMenu) {
      this.isDropdownOpen.set(false);
    }
  }
}
