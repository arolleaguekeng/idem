import { Component, OnInit } from '@angular/core';
import { FormsModule, NgSelectOption } from '@angular/forms';
import { ProjectModel } from '../../models/project.model';
import { Dialog } from 'primeng/dialog';
import { inject } from '@angular/core';
import { FirstPhaseMainService } from '../../services/ai-agents/Phase-1-Planning/first-phase-main.service';
import { LoaderComponent } from '../../../../components/loader/loader.component';
import { Checkbox } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectItemGroup } from 'primeng/api';
import { Select } from 'primeng/select';
interface PhaseItem {
  label: string;
  tier: 'free' | 'standard' | 'premium'; // f, s, p
}



interface DevelopmentPhase {
  id: string;
  label: string;
  tier: 'free' | 'standard' | 'premium'; // Niveau global de la phase
  subItems: PhaseItem[];
}
interface SelectElement {
  name: string;
  code: string;
}
@Component({
  selector: 'app-create-project',
  imports: [
    FormsModule,
    Dialog,
    LoaderComponent,
    Checkbox,
    CommonModule,
    MultiSelectModule,
    Select
  ],
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
  selectedConstraints: SelectElement[] = [];

  selectedTeamSize: SelectElement | undefined;
  selectedTarget: SelectElement | undefined;
  selectedScope: SelectElement | undefined;

  teamSizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  targets = ['Entreprises', 'Étudiants', 'Grand public'];
  scopes = ['Locale', 'Departementale', 'Regionale'];
  groupedTeamSizes: SelectElement[] = [
    { name: '1 personne', code: '1' },
    { name: '2-3 personnes', code: '2-3' },
    { name: '4-5 personnes', code: '4-5' },
    { name: '6-10 personnes', code: '6-10' },
    { name: '10+ personnes', code: '10+' },
  ];
  groupedProjectTypes: SelectElement[] = [
    { name: 'Application Web', code: 'web' },
    { name: 'Application Mobile', code: 'mobile' },
    { name: 'IoT', code: 'iot' },
    { name: 'Application Desktop', code: 'desktop' },
    { name: 'API/Backend', code: 'api' },
    { name: 'IA/ML', code: 'ai' },
    { name: 'Blockchain', code: 'blockchain' }
  ];

  groupedTargets: SelectElement[] = [
    { name: 'Entreprises', code: 'business' },
    { name: 'Étudiants', code: 'students' },
    { name: 'Grand public', code: 'general-public' },
    { name: 'Administrations', code: 'government' },
    { name: 'Professionnels de santé', code: 'healthcare' },
  ];

  groupedScopes: SelectElement[] = [
    { name: 'Locale', code: 'local' },
    { name: 'Départementale', code: 'departmental' },
    { name: 'Régionale', code: 'regional' },
    { name: 'Nationale', code: 'national' },
    { name: 'Internationale', code: 'international' },
  ];
  groupedBudgets: SelectElement[] = [
    { name: '< $5K', code: '0-5000' },
    { name: '$5K-$10K', code: '5000-10000' }, 
    { name: '$10K-$20K', code: '10000-20000' },
    { name: '$20K-$50K', code: '20000-50000' },
    { name: '$50K-$100K', code: '50000-100000' },
    { name: '> $100K', code: '100000+' }
  ];
  groupedConstraints!: SelectItemGroup[];

  constructor() {
    this.groupedConstraints = [
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
  }

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
      tier: 'free', // "s"
      subItems: [
        { label: 'Étude de faisabilité', tier: 'free' },
        { label: 'Analyse des risques', tier: 'standard' },
        { label: 'Objectifs SMART', tier: 'premium' },
      ],
    },
    {
      id: 'design',
      label: 'Phase 2 - Design',
      tier: 'standard', // "s"
      subItems: [
        { label: "Choix d'architecture", tier: 'free' },
        { label: 'Modélisation UML', tier: 'standard' },
        { label: 'Sélection technologique', tier: 'premium' },
      ],
    },
    {
      id: 'development',
      label: 'Phase 3 - Development',
      tier: 'premium', // "p"
      subItems: [
        { label: 'Setup projet', tier: 'standard' },
        { label: 'Développement backend/frontend', tier: 'premium' },
        { label: 'Base de données', tier: 'premium' },
      ],
    },
    {
      id: 'charte',
      label: 'Identité visuelle',
      tier: 'premium',
      subItems: [
        {
          label: 'Palette de couleurs',
          tier: 'free',
        },
        {
          label: 'Pack typographie',
          tier: 'standard',
        },
        {
          label: 'Kit UI complet (logos, icônes, thème front)',
          tier: 'premium',
        },
      ],
    },
    {
      id: 'landing',
      label: 'Landing Page',
      tier: 'standard',
      subItems: [
        {
          label: 'Template statique',
          tier: 'free',
        },
        {
          label: 'LP dynamique (React/Angular)',
          tier: 'standard',
        },
        {
          label: 'LP animée + analytics',
          tier: 'premium',
        },
      ],
    },
    {
      id: 'testing',
      label: 'Tests',
      tier: 'premium',
      subItems: [
        {
          label: 'Tests unitaires',
          tier: 'free',
        },
        {
          label: 'Tests d‘intégration',
          tier: 'standard',
        },
        {
          label: 'Benchmark performance',
          tier: 'premium',
        },
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
  onCheckboxChange(phaseId: string, event: any): void {
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
