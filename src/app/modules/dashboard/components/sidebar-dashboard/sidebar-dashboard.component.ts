import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
  OnInit,
} from '@angular/core';
import { Router } from 'express';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';
import { AuthService } from '../../../auth/services/auth.service';
import { AsyncPipe } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-sidebar-dashboard',
  templateUrl: './sidebar-dashboard.component.html',
  styleUrls: ['./sidebar-dashboard.component.css'],
  imports: [PanelMenu, AsyncPipe],
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

  ngOnInit() {
    this.items = [
      {
        label: 'Planning',
        icon: 'pi pi-calendar',
        items: [
          {
            label: 'Roadmap',
            icon: 'pi pi-map',
            routerLink: ['/planning/roadmap'],
          },
          {
            label: 'Meetings',
            icon: 'pi pi-users',
            routerLink: ['/planning/meetings'],
          },
        ],
      },
      {
        label: 'Branding',
        icon: 'pi pi-star',
        items: [
          {
            label: 'Logo',
            icon: 'pi pi-image',
            routerLink: ['/branding/logo'],
          },
          {
            label: 'Guidelines',
            icon: 'pi pi-book',
            routerLink: ['/branding/guidelines'],
          },
        ],
      },
      {
        label: 'Design',
        icon: 'pi pi-palette',
        items: [
          {
            label: 'Mockups',
            icon: 'pi pi-desktop',
            routerLink: ['/design/mockups'],
          },
          {
            label: 'Components',
            icon: 'pi pi-cog',
            routerLink: ['/design/components'],
          },
        ],
      },
      {
        label: 'Development',
        icon: 'pi pi-code',
        items: [
          { label: 'API', icon: 'pi pi-server', routerLink: ['/dev/api'] },
          {
            label: 'Frontend',
            icon: 'pi pi-desktop',
            routerLink: ['/dev/frontend'],
          },
        ],
      },
      {
        label: 'Landing Page',
        icon: 'pi pi-globe',
        items: [
          {
            label: 'Hero Section',
            icon: 'pi pi-bolt',
            routerLink: ['/landing/hero'],
          },
          {
            label: 'Contact',
            icon: 'pi pi-envelope',
            routerLink: ['/landing/contact'],
          },
        ],
      },
      {
        label: 'Tests',
        icon: 'pi pi-check-square',
        items: [
          {
            label: 'Unit Tests',
            icon: 'pi pi-list',
            routerLink: ['/tests/unit'],
          },
          { label: 'E2E', icon: 'pi pi-sitemap', routerLink: ['/tests/e2e'] },
        ],
      },
    ];
  }

  auth = inject(AuthService);
  isMenuOpen = false;
  user$ = this.auth.user$;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  @ViewChild('menu') menuRef!: ElementRef;
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
  isDropdownOpen = false;
  // router = inject(Router);

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateTo(path: string) {
    this.isDropdownOpen = false;
    // this.router.navigate([`/${path}`]);
  }

  logout() {
    this.isDropdownOpen = false;
    this.auth.logout();
    // this.router.navigate(['/login']);
  }

  // Ferme le dropdown quand on clique en dehors
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!(event.target as HTMLElement).closest('.relative')) {
      this.isDropdownOpen = false;
    }
  }
}
