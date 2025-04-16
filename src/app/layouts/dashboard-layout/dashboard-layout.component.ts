import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderDashboardComponent } from '../../modules/dashboard/components/header-dashboard/header-dashboard.component';
import { SidebarDashboardComponent } from '../../modules/dashboard/components/sidebar-dashboard/sidebar-dashboard.component';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, HeaderDashboardComponent, SidebarDashboardComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {}
