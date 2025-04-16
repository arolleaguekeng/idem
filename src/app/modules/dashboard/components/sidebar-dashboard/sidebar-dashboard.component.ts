import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-sidebar-dashboard',
  templateUrl: './sidebar-dashboard.component.html',
  styleUrls: ['./sidebar-dashboard.component.css'],
  imports: [PanelMenu],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarDashboardComponent {
  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Planning',
        icon: 'pi pi-calendar',
        items: [
          { label: 'Roadmap', icon: 'pi pi-map', routerLink: ['/planning/roadmap'] },
          { label: 'Meetings', icon: 'pi pi-users', routerLink: ['/planning/meetings'] }
        ]
      },
      {
        label: 'Branding',
        icon: 'pi pi-star',
        items: [
          { label: 'Logo', icon: 'pi pi-image', routerLink: ['/branding/logo'] },
          { label: 'Guidelines', icon: 'pi pi-book', routerLink: ['/branding/guidelines'] }
        ]
      },
      {
        label: 'Design',
        icon: 'pi pi-palette',
        items: [
          { label: 'Mockups', icon: 'pi pi-desktop', routerLink: ['/design/mockups'] },
          { label: 'Components', icon: 'pi pi-cog', routerLink: ['/design/components'] }
        ]
      },
      {
        label: 'Development',
        icon: 'pi pi-code',
        items: [
          { label: 'API', icon: 'pi pi-server', routerLink: ['/dev/api'] },
          { label: 'Frontend', icon: 'pi pi-desktop', routerLink: ['/dev/frontend'] }
        ]
      },
      {
        label: 'Landing Page',
        icon: 'pi pi-globe',
        items: [
          { label: 'Hero Section', icon: 'pi pi-bolt', routerLink: ['/landing/hero'] },
          { label: 'Contact', icon: 'pi pi-envelope', routerLink: ['/landing/contact'] }
        ]
      },
      {
        label: 'Tests',
        icon: 'pi pi-check-square',
        items: [
          { label: 'Unit Tests', icon: 'pi pi-list', routerLink: ['/tests/unit'] },
          { label: 'E2E', icon: 'pi pi-sitemap', routerLink: ['/tests/e2e'] }
        ]
      }
    ];
  }
}
