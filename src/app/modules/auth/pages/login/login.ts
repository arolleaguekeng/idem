import { Component, inject } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
  loginWithGithub() {
    this.authService.loginWithGithub();
  }
}
