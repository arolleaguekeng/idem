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
  Signal,
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
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import { EMPTY, from, iif, of } from 'rxjs';

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
  private auth = inject(AuthService);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals for UI State
  items = signal<MenuItem[]>([]);
  isLoading = signal(true);
  isMenuOpen = signal(false);
  isDropdownOpen = signal(false);

  // User and Project Data Signals
  user = toSignal(this.auth.user$);
  private _userProjects = signal<ProjectModel[]>([]);
  selectedProject = signal<SelectElement | undefined>(undefined);
  readonly projectIdFromRoute: Signal<string | null>; // Defined in constructor

  // Computed signal for dropdown project list
  dropDownProjects = computed(() => {
    return this._userProjects().map((p) => ({
      name: p.name,
      code: p.id!,
    }));
  });

  @ViewChild('menu') menuRef!: ElementRef;

  constructor() {
    this.projectIdFromRoute = toSignal(
      this.route.paramMap.pipe(map(params => params.get('id'))),
      { initialValue: this.route.snapshot.paramMap.get('id') } // Sync initial value from snapshot
    );

    // Effect to update sidebar menu when selectedProject changes
    effect(() => {
      if (this.selectedProject()) {
        this.updateSidebarRoutes();
      }
    });

    // Effect to react to projectIdFromRoute changes and user's projects list
    effect(() => {
      const projects = this._userProjects();
      const routeId = this.projectIdFromRoute();
      const isLoadingProjects = this.isLoading();

      if (isLoadingProjects) {
        return; // Wait for projects to load
      }

      if (routeId) {
        const projectFromRoute = projects.find(p => p.id === routeId);
        if (projectFromRoute) {
          this.selectedProject.set({ name: projectFromRoute.name, code: routeId });
        } else {
          // Invalid project ID in route
          if (projects.length > 0) {
            console.warn(`Project ID '${routeId}' from route not found. Navigating to first project.`);
            const firstProject = projects[0];
            // Set selected project and navigate to a valid route to correct URL
            this.selectedProject.set({ name: firstProject.name, code: firstProject.id! });
            if (routeId !== firstProject.id!) { // Avoid navigation loop if already corrected by another instance
                this.router.navigate([`console/${firstProject.id!}/dashboard/${firstProject.id!}`], { replaceUrl: true });
            }
          } else {
            // No projects available, and route ID is invalid
            this.selectedProject.set(undefined);
          }
        }
      } else {
        // No project ID in route
        if (projects.length > 0) {
          // Select the first project by default if no specific project in URL
          const firstProject = projects[0];
          this.selectedProject.set({ name: firstProject.name, code: firstProject.id! });
          // Do not navigate here; ngOnInit handles initial navigation if no routeId
        } else {
          // No projects and no route ID
          this.selectedProject.set(undefined);
        }
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.isLoading.set(true);
    this.auth.user$.pipe(
      first(),
      switchMap(user => {
        if (!user) {
          console.log('User not authenticated.');
          this._userProjects.set([]);
          this.isLoading.set(false);
          return EMPTY;
        }
        return this.projectService.getProjects(); // Fetches projects
      })
    ).subscribe({
      next: (projects) => {
        this._userProjects.set(projects);
        const initialRouteId = this.route.snapshot.paramMap.get('id'); // Get ID at the time of init

        if (projects.length > 0) {
          if (!initialRouteId) {
            // No project ID in URL on initial load, navigate to the first project
            console.log('No initial project ID in route, navigating to first project.');
            const firstProject = projects[0];
            this.router.navigate([`console/${firstProject.id!}/dashboard/${firstProject.id!}`], { replaceUrl: true });
          } else {
            const projectExists = projects.find(p => p.id === initialRouteId);
            if (!projectExists) {
              // Initial project ID from URL is invalid (not in user's list)
              console.warn(`Initial project ID '${initialRouteId}' not found. Navigating to first project.`);
              const firstProject = projects[0];
              this.router.navigate([`console/${firstProject.id!}/dashboard/${firstProject.id!}`], { replaceUrl: true });
            }
            // If initialRouteId is valid, the effect will handle setting selectedProject.
          }
        } else {
          // No projects for the user
          console.log('User has no projects.');
          // If there was an initialRouteId, it's effectively invalid now.
          // The effect will set selectedProject to undefined.
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching projects in ngOnInit:', err);
        this._userProjects.set([]);
        this.isLoading.set(false);
        // The effect will set selectedProject to undefined due to empty _userProjects
      }
    });
  }

  onProjectChange(event: SelectChangeEvent) {
    const selected = event.value as SelectElement;
    this.selectedProject.set(selected);
    this.router.navigate([`console/${selected.code}/dashboard/${selected.code}`]);
  }

  updateSidebarRoutes() {
    const currentSelectedProject = this.selectedProject();
    if (!currentSelectedProject?.code) {
      this.items.set([]);
      return;
    }
    const code = currentSelectedProject.code;
    this.items.set([
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: [`dashboard/${code}`] },
      { label: 'Businessplan', icon: 'pi pi-calendar', routerLink: [`planing/${code}`] },
      { label: 'Branding', icon: 'pi pi-star', routerLink: [`branding/${code}`] },
      { label: 'Diagrams', icon: 'pi pi-palette', routerLink: [`diagrams/${code}`] },
      { label: 'Development', icon: 'pi pi-code', routerLink: [`developement/${code}`] },
      { label: 'Landing Page', icon: 'pi pi-globe', routerLink: [`landing/${code}`] },
      { label: 'Tests', icon: 'pi pi-check-square', routerLink: [`tests/${code}`] },
    ]);
  }

  toggleMenu() {
    this.isMenuOpen.update(open => !open);
  }

  toggleDropdown() {
    this.isDropdownOpen.update(open => !open);
  }

  navigateTo(path: string) {
    this.isDropdownOpen.set(false);
    this.router.navigate([`/${path}`]);
  }

  logout() {
    this.isDropdownOpen.set(false);
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.isMenuOpen() && this.menuRef && !this.menuRef.nativeElement.contains(event.target)) {
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
