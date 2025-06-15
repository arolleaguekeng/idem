import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DeploymentService } from '../../../services/deployment.service';
import { CookieService } from '../../../../../shared/services/cookie.service';
import {
  DeploymentModel,
  GitRepository,
  CloudProvider,
  InfrastructureConfig,
  EnvironmentVariable,
} from '../../../models/deployment.model';

// --- NOUVELLES INTERFACES BASÉES SUR LE CAHIER DE CHARGES ---

// Interface pour un message dans le chat de l'assistant IA
interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  proposals?: ArchitectureTemplate[]; // L'IA peut proposer des architectures
}

// Interface pour les modèles d'architecture pré-définis (Mode 2)
interface ArchitectureTemplate {
  id: string;
  provider: 'aws' | 'gcp' | 'azure';
  category: 'Web/API' | 'Big Data';
  name: string;
  description: string;
  tags: string[];
  icon: string; // ex: 'pi pi-server'
}

// Interface pour les composants individuels (Mode 3)
interface CloudComponent {
  id: string;
  provider: 'aws' | 'gcp' | 'azure';
  category: 'Calcul' | 'Réseau' | 'Stockage' | 'Bases de Données';
  name: string;
  description: string;
}

// Données simulées pour la démonstration
const MOCK_TEMPLATES: ArchitectureTemplate[] = [
  {
    id: 'aws-3-tier',
    provider: 'aws',
    category: 'Web/API',
    name: 'Application Web 3-Tiers (AWS)',
    description:
      'EC2, ALB, et RDS pour une application web standard et robuste.',
    tags: ['HA', 'Scalabilité'],
    icon: 'pi pi-window-maximize',
  },
  {
    id: 'gcp-serverless',
    provider: 'gcp',
    category: 'Web/API',
    name: 'API Serverless (GCP)',
    description:
      'Cloud Run et Firestore pour une API hautement scalable et sans gestion de serveur.',
    tags: ['Serverless', 'Coût optimisé'],
    icon: 'pi pi-bolt',
  },
  {
    id: 'azure-data-lake',
    provider: 'azure',
    category: 'Big Data',
    name: 'Data Lake (Azure)',
    description:
      "Data Lake Storage et Synapse pour l'analyse de grands volumes de données.",
    tags: ['Big Data', 'ETL'],
    icon: 'pi pi-database',
  },
];

const MOCK_COMPONENTS: { [provider: string]: CloudComponent[] } = {
  aws: [
    {
      id: 'aws-ec2',
      provider: 'aws',
      category: 'Calcul',
      name: 'Amazon EC2',
      description: 'Machines virtuelles sécurisées et redimensionnables.',
    },
    {
      id: 'aws-s3',
      provider: 'aws',
      category: 'Stockage',
      name: 'Amazon S3',
      description: "Stockage d'objets hautement scalable.",
    },
    {
      id: 'aws-rds',
      provider: 'aws',
      category: 'Bases de Données',
      name: 'Amazon RDS',
      description: 'Base de données relationnelle managée.',
    },
    {
      id: 'aws-vpc',
      provider: 'aws',
      category: 'Réseau',
      name: 'Amazon VPC',
      description: 'Réseaux virtuels isolés.',
    },
  ],
  gcp: [
    {
      id: 'gcp-compute',
      provider: 'gcp',
      category: 'Calcul',
      name: 'Compute Engine',
      description: 'Machines virtuelles performantes.',
    },
    {
      id: 'gcp-storage',
      provider: 'gcp',
      category: 'Stockage',
      name: 'Cloud Storage',
      description: "Stockage d'objets unifié.",
    },
    {
      id: 'gcp-sql',
      provider: 'gcp',
      category: 'Bases de Données',
      name: 'Cloud SQL',
      description: 'Bases de données MySQL, PostgreSQL, SQL Server.',
    },
  ],
  azure: [
    {
      id: 'azure-vm',
      provider: 'azure',
      category: 'Calcul',
      name: 'Azure VMs',
      description: 'Machines virtuelles Linux et Windows.',
    },
    {
      id: 'azure-blob',
      provider: 'azure',
      category: 'Stockage',
      name: 'Blob Storage',
      description: "Stockage d'objets massivement scalable.",
    },
    {
      id: 'azure-sql',
      provider: 'azure',
      category: 'Bases de Données',
      name: 'Azure SQL DB',
      description: 'Base de données SQL intelligente dans le cloud.',
    },
  ],
};

@Component({
  selector: 'app-create-deployment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './show-deployment.html',
  styleUrl: './show-deployment.css',
})
export class ShowDeployment implements OnInit {
  // --- ÉTAT DU COMPOSANT (SIGNALS) ---
  protected readonly deploymentMode = signal<
    'assistant' | 'template' | 'expert' | null
  >(null);
  protected readonly loadingDeployment = signal<boolean>(false);
  protected readonly projectId = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  // État pour le mode Assistant IA
  protected readonly aiPrompt = signal<string>('');
  protected readonly aiIsThinking = signal<boolean>(false);
  protected readonly chatMessages = signal<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Bonjour ! Décrivez-moi en langage naturel l\'infrastructure cloud que vous souhaitez déployer. Par exemple : "Je veux une application web e-commerce sur AWS avec une base de données PostgreSQL et une haute disponibilité".',
    },
  ]);

  // État pour le mode Modèles
  protected readonly availableTemplates = signal<ArchitectureTemplate[]>([]);
  protected readonly selectedTemplate = signal<ArchitectureTemplate | null>(
    null
  );

  // État pour le mode Expert
  protected readonly expertSelectedProvider = signal<'aws' | 'gcp' | 'azure'>(
    'aws'
  );
  protected readonly availableComponents = computed(
    () => MOCK_COMPONENTS[this.expertSelectedProvider()]
  );
  protected readonly selectedComponents = signal<CloudComponent[]>([]);

  // Formulaires (réutilisés et adaptés)
  protected deploymentConfigForm: FormGroup;
  protected environmentVariablesForm: FormGroup;

  // Services
  private readonly formBuilder = inject(FormBuilder);
  private readonly deploymentService = inject(DeploymentService);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);

  constructor() {
    // Initialisation des formulaires
    this.deploymentConfigForm = this.formBuilder.group({
      name: ['', Validators.required],
      repoUrl: [
        '',
        [Validators.required, Validators.pattern(/^https?:\/\/.*$/)],
      ],
      branch: ['', Validators.required],
      environment: ['development', Validators.required],
    });

    this.environmentVariablesForm = this.formBuilder.group({
      variables: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    const projectId = this.cookieService.get('activeProjectId');
    this.projectId.set(projectId);

    if (!projectId) {
      this.errorMessage.set(
        'Aucun projet actif sélectionné. Veuillez en choisir un depuis votre tableau de bord.'
      );
    }

    // Simuler le chargement des modèles depuis un service
    this.availableTemplates.set(MOCK_TEMPLATES);
    this.addEnvironmentVariable();
  }

  // --- LOGIQUE DES MODES ---

  protected selectMode(mode: 'assistant' | 'template' | 'expert'): void {
    this.deploymentMode.set(mode);
  }

  protected sendAiPrompt(): void {
    const prompt = this.aiPrompt().trim();
    if (!prompt || this.aiIsThinking()) return;

    this.chatMessages.update((messages) => [
      ...messages,
      { sender: 'user', text: prompt },
    ]);
    this.aiPrompt.set('');
    this.aiIsThinking.set(true);

    // Simuler une réponse de l'IA après un délai
    setTimeout(() => {
      this.chatMessages.update((messages) => [
        ...messages,
        {
          sender: 'ai',
          text: `J'analyse votre demande pour "${prompt}". Je vous propose une architecture basée sur un modèle d'application web 3-tiers. Vous pouvez maintenant la personnaliser.`,
        },
      ]);
      this.aiIsThinking.set(false);
      // Ici, l'IA pourrait pré-remplir un formulaire ou proposer des actions
    }, 2000);
  }

  protected selectTemplate(template: ArchitectureTemplate): void {
    this.selectedTemplate.set(template);
    this.deploymentConfigForm.get('name')?.setValue(`Deploy-${template.name}`);
  }

  protected addComponent(component: CloudComponent): void {
    // Éviter les doublons
    if (!this.selectedComponents().find((c) => c.id === component.id)) {
      this.selectedComponents.update((components) => [
        ...components,
        component,
      ]);
    }
  }

  protected removeComponent(componentId: string): void {
    this.selectedComponents.update((components) =>
      components.filter((c) => c.id !== componentId)
    );
  }

  // --- GESTION DES FORMULAIRES ET ACTIONS ---

  protected get environmentVariables(): FormArray {
    return this.environmentVariablesForm.get('variables') as FormArray;
  }

  protected addEnvironmentVariable(): void {
    this.environmentVariables.push(
      this.formBuilder.group({
        key: ['', Validators.required],
        value: ['', Validators.required],
        isSecret: [false],
      })
    );
  }

  protected removeEnvironmentVariable(index: number): void {
    this.environmentVariables.removeAt(index);
  }

  protected createDeployment(): void {
    if (!this.projectId() || this.deploymentConfigForm.invalid) {
      this.errorMessage.set(
        'Veuillez remplir tous les champs requis avant de déployer.'
      );
      return;
    }

    this.loadingDeployment.set(true);

    // La construction de l'objet de déploiement dépendra du mode choisi
    // Pour cet exemple, nous utilisons une base simple.
    const deploymentData: Partial<DeploymentModel> = {
      projectId: this.projectId()!,
      name: this.deploymentConfigForm.get('name')?.value,
      environment: this.deploymentConfigForm.get('environment')?.value,
      // ... et ainsi de suite
    };

    console.log('Déploiement en cours avec les données :', deploymentData);

    // Simuler l'appel API
    setTimeout(() => {
      this.loadingDeployment.set(false);
      this.router.navigate(['/console/dashboard/deployments']);
    }, 2500);
  }

  protected navigateToDeploymentsList(): void {
    this.router.navigate(['/console/dashboard/deployments']);
  }

  protected resetView(): void {
    this.deploymentMode.set(null);
    this.selectedTemplate.set(null);
    this.selectedComponents.set([]);
    this.errorMessage.set(null);
    this.deploymentConfigForm.reset({
      environment: 'development',
    });
  }
}
