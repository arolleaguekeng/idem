import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarDashboardComponent } from '../../modules/dashboard/components/sidebar-dashboard/sidebar-dashboard.component';

@Component({
  selector: 'lm-dashboard-layout',
  imports: [RouterOutlet, SidebarDashboardComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {}
