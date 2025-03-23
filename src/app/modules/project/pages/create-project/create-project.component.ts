import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectModel } from '../../models/project.model';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-create-project',
  imports: [FormsModule, Dialog],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss',
})
export class CreateProjectComponent {
  project: ProjectModel = {
    name: '',
    description: '',
    type: 'web',
    constraints: [],
    teamSize: [],
    budgetIntervals: [{ start: 1000, end: 5000 }],
    targets: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user123',
    scope: '',
  };

  showResults = false;
  constraints = ['Scalability', 'Security', 'Performance'];
  teamSizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  targets = ['Entreprises', 'Étudiants', 'Grand public'];
  scopes = ['Locale', 'Departementale', 'Regionale'];

  ngOnInit(): void {}

  analyzeProject() {
    this.showResults = true;
  }
  visible: boolean = false;
  showDialog() {
    this.analyzeProject();
    this.visible = true;
  }

  generateScripts(architecture: string) {
    alert(`Scripts générés pour l'architecture ${architecture}`);
  }
}
