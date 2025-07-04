import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarDashboard } from '../../modules/dashboard/components/sidebar-dashboard/sidebar-dashboard';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarDashboard, CommonModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
  animations: [
    trigger('contentExpand', [
      state(
        'expanded',
        style({
          marginLeft: '260px',
        })
      ),
      state(
        'collapsed',
        style({
          marginLeft: '80px',
        })
      ),
      transition('expanded <=> collapsed', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class DashboardLayoutComponent {
  protected readonly isSidebarCollapsed = signal(false);

  constructor() {
    // Initialize with saved sidebar state from localStorage to prevent flicker
    const savedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarState) {
      this.isSidebarCollapsed.set(savedSidebarState === 'true');
    }
  }

  /**
   * Handle sidebar state changes from the sidebar component
   */
  onSidebarCollapsedChange(collapsed: boolean): void {
    this.isSidebarCollapsed.set(collapsed);
  }
}
