import { Component, inject, input } from '@angular/core';
import { ProjectModel } from '../../models/project.model';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-card',
  imports: [DatePipe],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {
  project = input<ProjectModel>();
  router = inject(Router);

  cardClick(id: string) {
    this.router.navigate([`console/dashboard/${id}`]);
  }
}
