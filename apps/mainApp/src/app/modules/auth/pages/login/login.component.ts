import { Component, inject } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'lm-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authService = inject(AuthService);

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
  loginWithGithub() {
    this.authService.loginWithGithub();
  }
}
