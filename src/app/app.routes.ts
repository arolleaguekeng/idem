import { Routes } from '@angular/router';
import { CreateProjectComponent } from './modules/project/pages/create-project/create-project.component';

export const routes: Routes = [
  {
    path: 'project/create',
    component: CreateProjectComponent,
  },
  {
    path: '',
    component: CreateProjectComponent,
  },
];
