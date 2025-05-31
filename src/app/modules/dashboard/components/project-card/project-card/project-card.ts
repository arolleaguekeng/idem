import { Component, EventEmitter, inject, input } from '@angular/core';
import { ProjectModel } from '../../../models/project.model';
import { DatePipe } from '@angular/common';
import { Router } from 'express';
import { SafeHtmlPipe } from "../../../pages/projects-list/safehtml.pipe";

@Component({
  selector: 'app-project-card',
  imports: [DatePipe, SafeHtmlPipe],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  project = input<ProjectModel>();
  router = inject(Router);

  cardClick(id: string) {
    this.router.navigate([`console/dashboard/${id}`]);
  }
}
