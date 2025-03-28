import { Routes } from '@angular/router';
import { HomeComponent } from './modules/landing/pages/home/home.component';
import { CreateProjectComponent } from './modules/project/pages/create-project/create-project.component';
import { LoginComponent } from './modules/auth/pages/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'project/create',
    component: CreateProjectComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
