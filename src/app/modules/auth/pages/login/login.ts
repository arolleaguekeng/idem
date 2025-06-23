import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected readonly authService = inject(AuthService);

  // Check if the app is in beta mode from environment
  protected readonly isBeta = signal(environment.isBeta);

  // Get waitlist form URL from environment
  protected readonly waitlistFormUrl = signal(environment.waitlistUrl);

  // Open waitlist form in a new tab
  protected openWaitlistForm(): void {
    window.open(this.waitlistFormUrl(), '_blank');
  }

  protected loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  protected loginWithGithub(): void {
    this.authService.loginWithGithub();
  }
}
