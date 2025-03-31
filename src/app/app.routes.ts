import { Routes } from '@angular/router';

export const routes: Routes = [
  // Layout public (avec header et footer)
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout.component').then(
        (m) => m.PublicLayoutComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./modules/landing/pages/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./modules/auth/pages/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
    ],
  },

  // Layout dashboard (avec navbar spécifique)
  {
    path: '',
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    children: [
      {
        path: 'project/create',
        loadComponent: () =>
          import(
            './modules/project/pages/create-project/create-project.component'
          ).then((m) => m.CreateProjectComponent),
      },
      {
        path: 'project/editor/:id',
        loadComponent: () =>
          import(
            './modules/project/pages/project-editor/project-editor.component'
          ).then((m) => m.ProjectEditorComponent),
      },
    ],
  },

  // Redirection par défaut
  { path: '**', redirectTo: 'home' },
];
