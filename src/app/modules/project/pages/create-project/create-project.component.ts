import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectModel } from '../../models/project.model';
import { Dialog } from 'primeng/dialog';
import { inject } from '@angular/core';
import { FirstPhaseMainService } from '../../services/ai-agents/Phase-1-Planning/first-phase-main.service';
import { LoaderComponent } from '../../../../components/loader/loader.component';

@Component({
  selector: 'app-create-project',
  imports: [FormsModule, Dialog, LoaderComponent],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss',
})
export class CreateProjectComponent {
  project: ProjectModel = {
    name: 'Boty',
    description: 'Application de vente de chaussures en ligne',
    type: 'web',
    constraints: [],
    teamSize: '1 - 5',
    budgetIntervals: '0 - 1000 $',
    targets: 'Locale',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user123',
    scope: 'Grand public',
  };
  private firstPhaseMainService = inject(FirstPhaseMainService);
  isLoaded = false;
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
    console.log('Project: ', this.project);
    this.visible = true;
    this.isLoaded = true;
    this.firstPhaseMainService
      .executeFirstPhase(this.project)

      .then((results) => {
        console.log('Results:', results);
        this.analyzeProject();
        this.visible = true;
      })
      .catch((error) =>
        console.error('Error while executing first phase:', error)
      )
      .finally(() => (this.isLoaded = false));
  }

  generateScripts(architecture: string) {
    alert(`Scripts générés pour l'architecture ${architecture}`);
  }
}
