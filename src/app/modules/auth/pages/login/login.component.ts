import { Component, inject } from '@angular/core';
import {
  Auth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  async loginWithGithub() {
    const provider = new GithubAuthProvider();
    await signInWithPopup(this.auth, provider);
  }

  auth = inject(Auth);
  router = inject(Router);

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider).then((result) => {
      console.log(result);
      if (result.user) {
        console.log('success');
      } else {
        console.log('errorr');
      }
    });
  }
}
