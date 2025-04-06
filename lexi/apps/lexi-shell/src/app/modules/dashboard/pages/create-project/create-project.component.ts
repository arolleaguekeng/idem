import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectModel } from '../../models/project.model';
import { inject } from '@angular/core';
import { FirstPhaseMainService } from '../../services/ai-agents/Phase-1-Planning/first-phase-main.service';
import { Checkbox } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectItemGroup } from 'primeng/api';
import { Select } from 'primeng/select';
import CreateProjectDatas, { DevelopmentPhase, SelectElement } from './datas';
import { ProjectService } from '../../services/project.service';
import { LoaderComponent } from '../../../../components/loader/loader.component';
import { Router } from '@angular/router';
import { initEmptyObject } from '../../../../utils/init-empty-object';

@Component({
  selector: 'app-create-project',
  imports: [
    FormsModule,
    Checkbox,
    CommonModule,
    MultiSelectModule,
    Select,
    LoaderComponent,
  ],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss',
})
export class CreateProjectComponent {
  onConstraintsChange() {
    this.project.constraints = this.selectedConstraints.map(
      (constraint: any) => constraint
    );
  }
  project: ProjectModel = initEmptyObject<ProjectModel>();

  userWithDefaults: ProjectModel = initEmptyObject<ProjectModel>({
    name: 'John Doe',
  });
  private firstPhaseMainService = inject(FirstPhaseMainService);
  projectService = inject(ProjectService);
  router = inject(Router);
  isLoaded = false;
  showResults = false;
  selectedConstraints: SelectElement[] = [];

  selectedTeamSize: SelectElement | undefined;
  selectedTarget: SelectElement | undefined;
  selectedScope: SelectElement | undefined;

  groupedTeamSizes: SelectElement[] = CreateProjectDatas.groupedTeamSizes;
  groupedProjectTypes: SelectElement[] = CreateProjectDatas.groupedProjectTypes;

  groupedTargets: SelectElement[] = CreateProjectDatas.groupedTargets;

  groupedScopes: SelectElement[] = CreateProjectDatas.groupedScopes;
  groupedBudgets: SelectElement[] = CreateProjectDatas.groupedBudgets;
  groupedConstraints = [
    {
      label: 'Performance',
      value: 'performance',
      items: [
        { label: 'Temps de réponse < 2s', value: 'fast_response' },
        { label: 'Charge > 10k utilisateurs simultanés', value: 'high_load' },
        { label: 'Optimisation des requêtes DB', value: 'db_optimization' },
        { label: 'Cache stratégique', value: 'caching' },
      ],
    },
    {
      label: 'Sécurité',
      value: 'security',
      items: [
        { label: 'Authentification forte (MFA)', value: 'auth' },
        { label: 'Chiffrement des données', value: 'encryption' },
        { label: 'Protection OWASP Top 10', value: 'owasp' },
        { label: 'Certificats SSL/TLS', value: 'ssl' },
        { label: 'GDPR/Compliance', value: 'compliance' },
      ],
    },
    {
      label: 'Maintenabilité',
      value: 'maintainability',
      items: [
        { label: 'Documentation technique', value: 'documentation' },
        { label: 'Tests unitaires > 80%', value: 'unit_tests' },
        { label: 'Standards de codage', value: 'coding_standards' },
        { label: 'Intégration continue', value: 'ci' },
      ],
    },
    {
      label: 'Évolutivité',
      value: 'scalability',
      items: [
        { label: 'Architecture microservices', value: 'microservices' },
        { label: 'Auto-scaling cloud', value: 'autoscaling' },
        { label: 'Load balancing', value: 'load_balancer' },
        { label: 'Découplage des services', value: 'loose_coupling' },
      ],
    },
    {
      label: 'Disponibilité',
      value: 'availability',
      items: [
        { label: 'SLA > 99.9%', value: 'sla' },
        { label: 'Systèmes redondants', value: 'redundancy' },
        { label: 'Backups automatisés', value: 'backups' },
        { label: 'Monitoring 24/7', value: 'monitoring' },
      ],
    },
    {
      label: 'Expérience Utilisateur',
      value: 'ux',
      items: [
        { label: 'Accessibilité WCAG', value: 'accessibility' },
        { label: 'Design responsive', value: 'responsive' },
        { label: "Taux d'erreur < 1%", value: 'error_rate' },
        { label: 'Optimisation Core Web Vitals', value: 'web_vitals' },
      ],
    },
    {
      label: 'Coûts',
      value: 'cost',
      items: [
        { label: 'Optimisation cloud', value: 'cloud_optimization' },
        { label: 'Budget monitoring', value: 'budget_control' },
        { label: 'ROI mesurable', value: 'roi' },
      ],
    },
  ];
  phases: DevelopmentPhase[] = CreateProjectDatas.phases;
  markdown = '';
  constructor() {}

  ngOnInit(): void {}
  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Réinitialise la hauteur

    // Vérifie si la hauteur dépasse 400px
    const newHeight = Math.min(textarea.scrollHeight, 400);
    textarea.style.height = newHeight + 'px';
  }

  generateSelectedPhases() {
    try {
      // this.isLoaded = true;
      // for (let phase in this.selectedPhases) {
      //   console.log('Phase:', phase);
      //   switch (phase) {
      //     case '0': {
      //       this.firstPhaseMainService
      //         .executeFirstPhase(this.project)

      //         .then((results) => {
      //           console.log('Results:', results);
      //           this.markdown = results.feasibility!;
      //           this.project.analysisResultModel.planning =
      //             results.feasibility!;
      //         })
      //         .catch((error) =>
      //           console.error('Error while executing first phase:', error)
      //         );
      //       break;
      //     }
      //     case 'design': {
      //       break;
      //     }
      //     case 'development': {
      //       break;
      //     }
      //     case 'charte': {
      //       break;
      //     }
      //     case 'landing': {
      //       break;
      //     }
      //     case 'testing': {
      //       break;
      //     }
      //     default: {
      //       this.isLoaded = false;
      //     }
      //   }
      // }

      this.project.selectedPhases = this.selectedPhases;
      this.projectService.createUserProject(this.project).then((projectId) => {
        this.router.navigate([`/project/editor/${projectId}`]);
      });
    } catch (e) {
      console.error('error', e);
      this.isLoaded = false;
    } finally {
      this.isLoaded = false;
    }
  }
  visible: boolean = false;
  showDialog() {
    // this.project.constraints = this.groupedConstraints;
    console.log('Project: ', this.project.constraints);
    console.log('Project: ', this.project);
    this.visible = true;
    this.isLoaded = false;
    this.showResults = true;
  }

  generateScripts(architecture: string) {
    alert(`Scripts générés pour l'architecture ${architecture}`);
  }

  selectedPhases: string[] = [];

  togglePhase(phaseId: string, isChecked: boolean): void {
    this.selectedPhases = isChecked
      ? [...this.selectedPhases, phaseId]
      : this.selectedPhases.filter((id) => id !== phaseId);
  }

  onCheckboxChange(phaseId: string, event: any): void {
    if (event.checked) {
      if (!this.selectedPhases.includes(phaseId)) {
        this.selectedPhases = [...this.selectedPhases, phaseId];
      }
    } else {
      this.selectedPhases = this.selectedPhases.filter((id) => id !== phaseId);
    }
  }
}
