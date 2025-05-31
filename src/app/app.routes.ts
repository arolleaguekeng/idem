import { Routes } from '@angular/router';
import { ProjectsList } from './modules/dashboard/pages/projects-list/projects-list';

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
      import('./modules/landing/pages/home/home').then(
        (m) => m.Home
      ),
    data: { layout: 'public' },
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/pages/login/login').then(
        (m) => m.Login
      ),
    data: { layout: 'public' },
  },

  // Dashboard layout routes
  {
    path: 'console/:id/dashboard/:id',
    loadComponent: () =>
      import('./modules/dashboard/pages/dashboard/dashboard').then(
        (m) => m.Dashboard
      ),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/:id/branding/:id',
    loadComponent: () =>
      import(
        './modules/dashboard/pages/show-branding/show-branding'
      ).then((m) => m.ShowBrandingComponent),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/:id/planing/:id',
    loadComponent: () =>
      import(
        './modules/dashboard/pages/show-planing/show-planing'
      ).then((m) => m.ShowPlaning),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/:id/diagrams/:id',
    loadComponent: () =>
      import(
        './modules/dashboard/pages/show-diagrams/show-diagrams'
      ).then((m) => m.ShowDiagramsComponent),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/:id/landing/:id',
    loadComponent: () =>
      import(
        './modules/dashboard/pages/show-landing/show-landing'
      ).then((m) => m.ShowLandingComponent),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/:id/tests/:id',
    loadComponent: () =>
      import('./modules/dashboard/pages/show-tests/show-tests').then(
        (m) => m.ShowTestsComponent
      ),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/:id/developement/:id',
    loadComponent: () =>
      import(
        './modules/dashboard/pages/show-development/show-development'
      ).then((m) => m.ShowDevelopmentComponent),
    data: { layout: 'dashboard' },
  },

  // Redirection par défaut
  { path: 'projects', component: ProjectsList },
  {
    path: 'project/create',
    loadComponent: () =>
      import(
        './modules/dashboard/pages/create-project/create-project'
      ).then((m) => m.CreateProjectComponent),
  },

  { path: '**', redirectTo: 'home' },
];
