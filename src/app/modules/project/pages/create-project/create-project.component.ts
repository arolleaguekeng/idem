import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectModel } from '../../models/project.model';
import { Dialog } from 'primeng/dialog';
import { inject } from '@angular/core';
import { FirstPhaseMainService } from '../../services/ai-agents/Phase-1-Planning/first-phase-main.service';
import { LoaderComponent } from '../../../../components/loader/loader.component';
import { Checkbox, CheckboxChangeEvent } from 'primeng/checkbox';
interface DevelopmentPhase {
  id: string;
  label: string;
  subItems: string[];
}
@Component({
  selector: 'app-create-project',
  imports: [FormsModule, Dialog, LoaderComponent, Checkbox],
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
    this.isLoaded = false;
    this.analyzeProject();
    // this.firstPhaseMainService
    //   .executeFirstPhase(this.project)

    //   .then((results) => {
    //     console.log('Results:', results);
    //     this.analyzeProject();
    //     this.visible = true;
    //   })
    //   .catch((error) =>
    //     console.error('Error while executing first phase:', error)
    //   )
    //   .finally(() => (this.isLoaded = false));
  }

  generateScripts(architecture: string) {
    alert(`Scripts générés pour l'architecture ${architecture}`);
  }

  selectedPhases: string[] = [];

  phases: DevelopmentPhase[] = [
    {
      id: 'planning',
      label: 'Phase 1 - Planning',
      subItems: [
        'Étude de faisabilité',
        'Analyse des risques',
        'Objectifs SMART',
      ],
    },
    {
      id: 'design',
      label: 'Phase 2 - Design',
      subItems: [
        "Choix d'architecture",
        'Modélisation UML',
        'Sélection technologique',
      ],
    },
    {
      id: 'development',
      label: 'Phase 3 - Development',
      subItems: [
        'Setup projet',
        'Développement backend/frontend',
        'Base de données',
      ],
    },
    {
      id: 'testing',
      label: 'Phase 4 - Testing',
      subItems: [
        'Tests unitaires',
        "Tests d'intégration",
        'Tests de performance',
      ],
    },
  ];

  togglePhase(phaseId: string, isChecked: boolean): void {
    this.selectedPhases = isChecked
      ? [...this.selectedPhases, phaseId]
      : this.selectedPhases.filter((id) => id !== phaseId);
  }

  generateSelectedPhases(): void {
    this.selectedPhases.forEach((phaseId) => {
      const phase = this.phases.find((p) => p.id === phaseId);
      console.log(`Génération de la phase: ${phase?.label}`);
      // Implémentez votre logique de génération ici
    });
  }

  // Nouvelle méthode optimisée
  onCheckboxChange(phaseId: string, event: CheckboxChangeEvent): void {
    this.generateSelectedPhases();
    if (event.checked) {
      if (!this.selectedPhases.includes(phaseId)) {
        this.selectedPhases = [...this.selectedPhases, phaseId];
      }
    } else {
      this.selectedPhases = this.selectedPhases.filter((id) => id !== phaseId);
    }
  }
}
