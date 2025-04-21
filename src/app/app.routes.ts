import { Routes } from '@angular/router';
import { ProjectsListComponent } from './modules/dashboard/pages/projects-list/projects-list.component';

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
    path: 'console',
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    children: [
      {
        path: 'dashboard/:id',
        loadComponent: () =>
          import(
            './modules/dashboard/pages/dashboard/dashboard.component'
          ).then((m) => m.DashboardComponent),
      },
      {
        path: 'branding/:id',
        loadComponent: () =>
          import(
            './modules/dashboard/pages/show-branding/show-branding.component'
          ).then((m) => m.ShowBrandingComponent),
      },
      {
        path: 'planing/:id',
        loadComponent: () =>
          import(
            './modules/dashboard/pages/show-planing/show-planing.component'
          ).then((m) => m.ShowPlaningComponent),
      },
      {
        path: 'diagrams/:id',
        loadComponent: () =>
          import(
            './modules/dashboard/pages/show-diagrams/show-diagrams.component'
          ).then((m) => m.ShowDiagramsComponent),
      },
      {
        path: 'landing/:id',
        loadComponent: () =>
          import(
            './modules/dashboard/pages/show-landing/show-landing.component'
          ).then((m) => m.ShowLandingComponent),
      },
      {
        path: 'tests/:id',
        loadComponent: () =>
          import(
            './modules/dashboard/pages/show-tests/show-tests.component'
          ).then((m) => m.ShowTestsComponent),
      },
      {
        path: 'developement/:id',
        loadComponent: () =>
          import(
            './modules/dashboard/pages/show-development/show-development.component'
          ).then((m) => m.ShowDevelopmentComponent),
      },

      { path: '**', redirectTo: '/projects' },
    ],
  },

  // Redirection par défaut
  { path: 'projects', component: ProjectsListComponent },
  {
    path: 'project/create',
    loadComponent: () =>
      import(
        './modules/dashboard/pages/create-project/create-project.component'
      ).then((m) => m.CreateProjectComponent),
  },

  { path: '**', redirectTo: 'home' },
];
