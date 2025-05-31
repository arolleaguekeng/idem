import { Routes } from '@angular/router';
import { ProjectsListComponent } from './modules/dashboard/pages/projects-list/projects-list.component';

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
      import('./modules/landing/pages/home/home.component').then(
        (m) => m.HomeComponent
      ),
    data: { layout: 'public' },
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
    data: { layout: 'public' },
  },

  // Dashboard layout routes
  {
    path: 'console/:id/dashboard/:id',
    loadComponent: () =>
      import('./modules/dashboard/pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/:id/branding/:id',
    loadComponent: () =>
      import(
        './modules/dashboard/pages/show-branding/show-branding.component'
      ).then((m) => m.ShowBrandingComponent),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/:id/planing/:id',
    loadComponent: () =>
      import(
        './modules/dashboard/pages/show-planing/show-planing.component'
      ).then((m) => m.ShowPlaningComponent),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/:id/diagrams/:id',
    loadComponent: () =>
      import(
        './modules/dashboard/pages/show-diagrams/show-diagrams.component'
      ).then((m) => m.ShowDiagramsComponent),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/:id/landing/:id',
    loadComponent: () =>
      import(
        './modules/dashboard/pages/show-landing/show-landing.component'
      ).then((m) => m.ShowLandingComponent),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/:id/tests/:id',
    loadComponent: () =>
      import('./modules/dashboard/pages/show-tests/show-tests.component').then(
        (m) => m.ShowTestsComponent
      ),
    data: { layout: 'dashboard' },
  },
  {
    path: 'console/:id/developement/:id',
    loadComponent: () =>
      import(
        './modules/dashboard/pages/show-development/show-development.component'
      ).then((m) => m.ShowDevelopmentComponent),
    data: { layout: 'dashboard' },
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
