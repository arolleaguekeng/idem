import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../modules/auth/services/auth.service';
import { CommonModule, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-empty-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, AsyncPipe, RouterLink],
  templateUrl: './empty-layout.html',
  styleUrl: './empty-layout.scss'
})
export class EmptyLayout {
  // Services
  protected readonly auth = inject(AuthService);
  protected readonly router = inject(Router);
  
  // UI State
  protected readonly isDropdownOpen = signal(false);
  
  // User data
  protected readonly user$ = this.auth.user$;
  
  /**
   * Toggle dropdown menu
   */
  protected toggleDropdown() {
    this.isDropdownOpen.update(open => !open);
  }
  
  /**
   * Logout user and navigate to login page
   */
  protected logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
