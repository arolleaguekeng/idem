import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
  OnInit,
  signal,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';
import { AuthService } from '../../../auth/services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Select, SelectChangeEvent } from 'primeng/select';
import { ProjectService } from '../../services/project.service';
import { ProjectModel } from '../../models/project.model';
import { SelectElement } from '../../pages/create-project/datas';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-dashboard',
  templateUrl: './sidebar-dashboard.component.html',
  styleUrls: ['./sidebar-dashboard.component.css'],
  standalone: true,
  imports: [PanelMenu, AsyncPipe, Select, CommonModule, FormsModule],
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
export class SidebarDashboardComponent implements OnInit {
  items: MenuItem[] = [];
  userProjects: ProjectModel[] = [];
  dropDownProjects: SelectElement[] = [];
  selectedProject: SelectElement | undefined;
  isLoading = signal(true);
  id = '';
  auth = inject(AuthService);
  user$ = this.auth.user$;
  isMenuOpen = false;
  isDropdownOpen = false;
  route = inject(ActivatedRoute);
  projectService = inject(ProjectService);
  router = inject(Router);
  @ViewChild('menu') menuRef!: ElementRef;

  async ngOnInit() {
    this.userProjects = await this.projectService.getAllUserProjects();

    this.id = this.route.snapshot.paramMap.get('id')!;
    console.log(this.id);
    if (!this.id) {
      console.log('ID du projet introuvable');
    } else {
      const project = await this.projectService.getUserProjectById(this.id);
      if (project) {
        this.selectedProject = {
          name: project.name,
          code: this.id,
        };

        console.log('prjct', this.selectedProject);
      }
    }
    this.dropDownProjects = this.userProjects.map((project) => ({
      name: project.name,
      code: project.id!,
    }));

    this.isLoading.set(false);

    if (this.dropDownProjects.length > 0) {
      this.updateSidebarRoutes();
    }
  }

  onProjectChange(event: SelectChangeEvent) {
    const selected = event.value as SelectElement;
    this.selectedProject = selected;
    this.updateSidebarRoutes();
    this.router.navigate([
      `console/${selected.code}/dashboard/${selected.code}`,
    ]);
  }

  updateSidebarRoutes() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: [`dashboard/${this.selectedProject?.code}`],
      },
      {
        label: 'Planning',
        icon: 'pi pi-calendar',
        routerLink: [`planing/${this.selectedProject?.code}`],
      },
      {
        label: 'Branding',
        icon: 'pi pi-star',
        routerLink: [`branding/${this.selectedProject?.code}`],
      },
      {
        label: 'Diagrams',
        icon: 'pi pi-palette',
        routerLink: [`diagrams/${this.selectedProject?.code}`],
      },
      {
        label: 'Development',
        icon: 'pi pi-code',
        routerLink: [`developement/${this.selectedProject?.code}`],
      },
      {
        label: 'Landing Page',
        icon: 'pi pi-globe',
        routerLink: [`landing/${this.selectedProject?.code}`],
      },
      {
        label: 'Tests',
        icon: 'pi pi-check-square',
        routerLink: [`tests/${this.selectedProject?.code}`],
      },
    ];
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateTo(path: string) {
    this.isDropdownOpen = false;
    this.router.navigate([`/${path}`]);
  }

  logout() {
    this.isDropdownOpen = false;
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (
      this.isMenuOpen &&
      this.menuRef &&
      !this.menuRef.nativeElement.contains(event.target)
    ) {
      this.isMenuOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!(event.target as HTMLElement).closest('.relative')) {
      this.isDropdownOpen = false;
    }
  }
}
