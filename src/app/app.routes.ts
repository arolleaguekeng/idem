import { Routes } from '@angular/router';

export const routes: Routes = [
  // Public layout routes
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./modules/landing/pages/home/home').then((m) => m.Home),
    data: { layout: 'public' },
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/pages/login/login').then((m) => m.Login),
    data: { layout: 'public' },
  },

  // Dashboard layout routes
  {
    path: 'console/dashboard/:id',
    loadComponent: () =>
      import('./modules/dashboard/pages/dashboard/dashboard').then(
        (m) => m.DashboardComponent
      ),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/branding/:id',
    loadComponent: () =>
      import('./modules/dashboard/pages/show-branding/show-branding').then(
        (m) => m.ShowBrandingComponent
      ),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/planing/:id',
    loadComponent: () =>
      import('./modules/dashboard/pages/show-planing/show-planing').then(
        (m) => m.ShowPlaning
      ),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/diagrams/:id',
    loadComponent: () =>
      import('./modules/dashboard/pages/show-diagrams/show-diagrams').then(
        (m) => m.ShowDiagramsComponent
      ),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/landing/:id',
    loadComponent: () =>
      import('./modules/dashboard/pages/show-landing/show-landing').then(
        (m) => m.ShowLandingComponent
      ),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/tests/:id',
    loadComponent: () =>
      import('./modules/dashboard/pages/show-tests/show-tests').then(
        (m) => m.ShowTestsComponent
      ),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/developement/:id',
    loadComponent: () =>
      import(
        './modules/dashboard/pages/show-development/show-development'
      ).then((m) => m.ShowDevelopmentComponent),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console',
    loadComponent: () =>
      import('./modules/dashboard/pages/projects-list/projects-list').then(
        (m) => m.ProjectsList
      ),
    data: { layout: 'empty' },
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./modules/dashboard/pages/projects-list/projects-list').then(
        (m) => m.ProjectsList
      ),
    data: { layout: 'empty' },
  },

  // Redirection par défaut

  {
    path: 'project/create',
    loadComponent: () =>
      import('./modules/dashboard/pages/create-project/create-project').then(
        (m) => m.CreateProjectComponent
      ),
    data: { layout: 'empty' },
  },

  { path: '**', redirectTo: 'home' },
];
