import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./modules/landing/pages/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: 'project/create',
    loadComponent: () =>
      import(
        './modules/project/pages/create-project/create-project.component'
      ).then((m) => m.CreateProjectComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
];
