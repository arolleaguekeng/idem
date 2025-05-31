import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarDashboard } from '../../modules/dashboard/components/sidebar-dashboard/sidebar-dashboard';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, SidebarDashboard],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayoutComponent {}
