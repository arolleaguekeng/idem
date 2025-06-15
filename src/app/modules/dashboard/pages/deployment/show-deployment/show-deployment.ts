import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DeploymentService } from '../../../services/deployment.service';
import { CookieService } from '../../../../../shared/services/cookie.service';
import { DeploymentModel } from '../../../models/deployment.model';

// --- INTERFACES DE DONNÉES COMMUNES ---
interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}
interface ArchitectureTemplate {
  id: string;
  provider: 'aws' | 'gcp' | 'azure';
  category: string;
  name: string;
  description: string;
  tags: string[];
  icon: string;
}

// --- INTERFACES SPÉCIFIQUES ET ENRICHIES POUR LE MODE EXPERT ---
interface FormOption {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'toggle';
  required: boolean;
  defaultValue?: any;
  placeholder?: string;
  options?: { value: string; label: string }[];
  description?: string;
}

interface CloudComponentDetailed {
  id: string;
  provider: 'aws' | 'gcp' | 'azure';
  category: string;
  name: string;
  icon: string;
  description: string;
  options: FormOption[];
}

interface ArchitectureComponent {
  instanceId: string;
  componentId: string;
  name: string;
  icon: string;
}

// --- DONNÉES SIMULÉES COMPLETES POUR LA DÉMONSTRATION ---
const MOCK_TEMPLATES: ArchitectureTemplate[] = [
  {
    id: 'aws-3-tier',
    provider: 'aws',
    category: 'Web/API',
    name: '3-Tier Web Application (AWS)',
    description: 'EC2, ALB, and RDS for a standard and robust web application.',
    tags: ['High Availability', 'Scalability'],
    icon: 'pi pi-window-maximize',
  },
  {
    id: 'gcp-serverless',
    provider: 'gcp',
    category: 'Web/API',
    name: 'Serverless API (GCP)',
    description: 'Cloud Run and Firestore for a highly scalable API.',
    tags: ['Serverless', 'Cost Optimized'],
    icon: 'pi pi-bolt',
  },
  {
    id: 'azure-data-lake',
    provider: 'azure',
    category: 'Big Data',
    name: 'Data Lake (Azure)',
    description: 'Data Lake Storage and Synapse for data analysis.',
    tags: ['Big Data', 'ETL'],
    icon: 'pi pi-database',
  },
];

const MOCK_COMPONENTS_DETAILED: { [id: string]: CloudComponentDetailed } = {
  // AWS Components
  'aws-ec2': {
    id: 'aws-ec2',
    provider: 'aws',
    category: 'Compute',
    name: 'Amazon EC2',
    icon: 'pi pi-desktop',
    description: 'Secure virtual machines.',
    options: [
      {
        name: 'instance_type',
        label: 'Instance type',
        type: 'select',
        required: true,
        defaultValue: 't2.micro',
        options: [
          { value: 't2.micro', label: 't2.micro' },
          { value: 'm5.large', label: 'm5.large' },
        ],
        description: 'VM size.',
      },
      {
        name: 'ami_id',
        label: 'Image (AMI)',
        type: 'text',
        required: true,
        placeholder: 'ami-0abcdef123',
        description: 'Amazon Machine Image ID.',
      },
    ],
  },
  'aws-rds': {
    id: 'aws-rds',
    provider: 'aws',
    category: 'Databases',
    name: 'Amazon RDS',
    icon: 'pi pi-database',
    description: 'Managed relational database.',
    options: [
      {
        name: 'engine',
        label: 'Engine',
        type: 'select',
        required: true,
        defaultValue: 'postgres',
        options: [
          { value: 'postgres', label: 'PostgreSQL' },
          { value: 'mysql', label: 'MySQL' },
        ],
      },
      {
        name: 'multi_az',
        label: 'High Availability',
        type: 'toggle',
        required: false,
        defaultValue: false,
        description: 'Provision a replica in another AZ.',
      },
    ],
  },
  'aws-s3': {
    id: 'aws-s3',
    provider: 'aws',
    category: 'Storage',
    name: 'Amazon S3',
    icon: 'pi pi-inbox',
    description: 'Highly scalable object storage.',
    options: [
      {
        name: 'bucket_name',
        label: 'Bucket name',
        type: 'text',
        required: true,
        placeholder: 'my-unique-bucket',
      },
      {
        name: 'public_access',
        label: 'Public access',
        type: 'toggle',
        required: false,
        defaultValue: false,
      },
    ],
  },
  // GCP Components
  'gcp-compute': {
    id: 'gcp-compute',
    provider: 'gcp',
    category: 'Compute',
    name: 'Compute Engine',
    icon: 'pi pi-desktop',
    description: 'High-performance virtual machines.',
    options: [
      {
        name: 'machine_type',
        label: 'Machine type',
        type: 'select',
        required: true,
        defaultValue: 'e2-micro',
        options: [
          { value: 'e2-micro', label: 'e2-micro' },
          { value: 'n2-standard-2', label: 'n2-standard-2' },
        ],
      },
    ],
  },
  'gcp-sql': {
    id: 'gcp-sql',
    provider: 'gcp',
    category: 'Databases',
    name: 'Cloud SQL',
    icon: 'pi pi-database',
    description: 'Managed relational databases.',
    options: [
      {
        name: 'database_version',
        label: 'Version',
        type: 'select',
        required: true,
        defaultValue: 'POSTGRES_13',
        options: [
          { value: 'POSTGRES_13', label: 'PostgreSQL 13' },
          { value: 'MYSQL_8_0', label: 'MySQL 8.0' },
        ],
      },
    ],
  },
  // Azure Components
  'azure-vm': {
    id: 'azure-vm',
    provider: 'azure',
    category: 'Compute',
    name: 'Azure VM',
    icon: 'pi pi-desktop',
    description: 'Virtual machines with Linux and Windows.',
    options: [
      {
        name: 'vm_size',
        label: 'VM size',
        type: 'select',
        required: true,
        defaultValue: 'Standard_B1s',
        options: [
          { value: 'Standard_B1s', label: 'Standard_B1s' },
          { value: 'Standard_D2s_v3', label: 'Standard_D2s_v3' },
        ],
      },
    ],
  },
  'azure-sql': {
    id: 'azure-sql',
    provider: 'azure',
    category: 'Databases',
    name: 'Azure SQL DB',
    icon: 'pi pi-database',
    description: 'Intelligent SQL database.',
    options: [
      {
        name: 'service_tier',
        label: 'Service tier',
        type: 'select',
        required: true,
        defaultValue: 'GeneralPurpose',
        options: [
          { value: 'GeneralPurpose', label: 'General Purpose' },
          { value: 'BusinessCritical', label: 'Business Critical' },
        ],
      },
    ],
  },
};

const ALL_COMPONENTS_LIST = Object.values(MOCK_COMPONENTS_DETAILED);

@Component({
  selector: 'app-create-deployment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './show-deployment.html',
  styleUrl: './show-deployment.css',
})
export class ShowDeployment implements OnInit {
  // Helper pour utiliser Object.keys dans le template
  public objectKeys = Object.keys;

  // --- SIGNAUX D'ÉTAT PRINCIPAUX ---
  protected readonly deploymentMode = signal<
    'beginner' | 'assistant' | 'template' | 'expert' | null
  >(null);
  protected readonly loadingDeployment = signal<boolean>(false);
  protected readonly projectId = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  // --- SIGNAUX ET FORMULAIRES POUR CHAQUE MODE ---
  // Mode Assistant IA
  protected readonly aiPrompt = signal<string>('');
  protected readonly aiIsThinking = signal<boolean>(false);
  protected readonly chatMessages = signal<ChatMessage[]>([
    {
      sender: 'ai',
      text: "Bonjour ! Décrivez-moi l'infrastructure que vous souhaitez.",
    },
  ]);

  // Mode Modèles
  protected readonly availableTemplates = signal<ArchitectureTemplate[]>([]);
  protected readonly selectedTemplate = signal<ArchitectureTemplate | null>(
    null
  );
  protected deploymentConfigForm: FormGroup;

  // Mode Expert
  protected readonly expertSelectedProvider = signal<'aws' | 'gcp' | 'azure'>(
    'aws'
  );
  protected readonly expertSearchTerm = signal<string>('');
  protected readonly expertArchitecture = signal<ArchitectureComponent[]>([]);
  protected readonly activeExpertComponent =
    signal<ArchitectureComponent | null>(null);
  protected expertForm: FormGroup;
  protected readonly filteredCatalogue = computed(() => {
    const provider = this.expertSelectedProvider();
    const term = this.expertSearchTerm().toLowerCase();
    return ALL_COMPONENTS_LIST.filter(
      (c) =>
        c.provider === provider &&
        (c.name.toLowerCase().includes(term) ||
          c.description.toLowerCase().includes(term))
    ).reduce((acc, comp) => {
      (acc[comp.category] = acc[comp.category] || []).push(comp);
      return acc;
    }, {} as { [cat: string]: CloudComponentDetailed[] });
  });

  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly cookieService = inject(CookieService);

  constructor() {
    this.deploymentConfigForm = this.formBuilder.group({
      name: ['', Validators.required],
      repoUrl: ['', Validators.required],
    });
    this.expertForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.projectId.set(this.cookieService.get('activeProjectId'));
    if (!this.projectId())
      this.errorMessage.set('Aucun projet actif sélectionné.');
    this.availableTemplates.set(MOCK_TEMPLATES);
  }
  protected readonly gitBranches = signal<string[]>([]);
  protected readonly loadingGitInfo = signal<boolean>(false);

  // --- LOGIQUE DE GESTION DES MODES ---
  protected selectMode(
    mode: 'beginner' | 'assistant' | 'template' | 'expert'
  ): void {
    this.deploymentMode.set(mode);
  }
  protected selectTemplate(template: ArchitectureTemplate): void {
    this.selectedTemplate.set(template);
  }

  protected fetchGitBranches(): void {
    if (!this.deploymentConfigForm.get('repoUrl')?.valid) return;

    this.loadingGitInfo.set(true);
    this.gitBranches.set([]); // Vider les anciennes branches
    this.deploymentConfigForm.get('branch')?.reset(''); // Réinitialiser la sélection

    // Simuler un appel à un service
    console.log(
      'Récupération des branches pour :',
      this.deploymentConfigForm.get('repoUrl')?.value
    );
    setTimeout(() => {
      this.gitBranches.set(['main', 'develop', 'feature/new-design']);
      this.loadingGitInfo.set(false);
      // Sélectionner 'main' par défaut si elle existe
      if (this.gitBranches().includes('main')) {
        this.deploymentConfigForm.get('branch')?.setValue('main');
      }
    }, 1500);
  }

  protected sendAiPrompt(): void {
    const prompt = this.aiPrompt().trim();
    if (!prompt || this.aiIsThinking()) return;
    this.chatMessages.update((m) => [...m, { sender: 'user', text: prompt }]);
    this.aiPrompt.set('');
    this.aiIsThinking.set(true);
    setTimeout(() => {
      this.chatMessages.update((m) => [
        ...m,
        {
          sender: 'ai',
          text: `Analyse de: "${prompt}". Je vous propose une architecture simple.`,
        },
      ]);
      this.aiIsThinking.set(false);
    }, 1500);
  }

  // --- LOGIQUE DÉTAILLÉE DU MODE EXPERT ---
  protected addComponentToArchitecture(componentId: string): void {
    const model = MOCK_COMPONENTS_DETAILED[componentId];
    const instanceId = `${componentId}-${Date.now()}`;
    const newComponent: ArchitectureComponent = {
      instanceId,
      componentId,
      name: model.name,
      icon: model.icon,
    };
    this.expertArchitecture.update((arch) => [...arch, newComponent]);

    const formGroup = this.formBuilder.group({});
    model.options.forEach((opt) =>
      formGroup.addControl(
        opt.name,
        this.formBuilder.control(
          opt.defaultValue,
          opt.required ? [Validators.required] : []
        )
      )
    );
    this.expertForm.addControl(instanceId, formGroup);
    this.selectComponentForConfiguration(newComponent);
  }

  protected removeComponentFromArchitecture(instanceId: string): void {
    this.expertArchitecture.update((arch) =>
      arch.filter((c) => c.instanceId !== instanceId)
    );
    this.expertForm.removeControl(instanceId);
    if (this.activeExpertComponent()?.instanceId === instanceId)
      this.activeExpertComponent.set(null);
  }

  protected selectComponentForConfiguration(
    component: ArchitectureComponent
  ): void {
    this.activeExpertComponent.set(component);
  }
  protected getActiveComponentForm = (): FormGroup | null =>
    this.activeExpertComponent()
      ? (this.expertForm.get(
          this.activeExpertComponent()!.instanceId
        ) as FormGroup)
      : null;
  protected getActiveComponentModel = (): CloudComponentDetailed | null =>
    this.activeExpertComponent()
      ? MOCK_COMPONENTS_DETAILED[this.activeExpertComponent()!.componentId]
      : null;

  // --- ACTIONS FINALES ---
  protected createDeployment(): void {
    this.loadingDeployment.set(true);
    let deploymentPayload: any = {
      projectId: this.projectId(),
      mode: this.deploymentMode(),
    };

    if (this.deploymentMode() === 'expert') {
      if (!this.expertForm.valid) {
        this.errorMessage.set(
          'Certains composants ne sont pas correctement configurés.'
        );
        this.loadingDeployment.set(false);
        return;
      }
      deploymentPayload.architecture = {
        name: 'Architecture Personnalisée',
        components: this.expertArchitecture().map((c) => ({
          instanceId: c.instanceId,
          type: c.componentId,
          config: this.expertForm.value[c.instanceId],
        })),
      };
    } else {
      // Logique pour les autres modes...
      deploymentPayload.config = this.deploymentConfigForm.value;
    }

    console.log(
      'Payload de déploiement envoyé au backend:',
      JSON.stringify(deploymentPayload, null, 2)
    );

    setTimeout(() => {
      this.loadingDeployment.set(false);
      this.router.navigate(['/console/dashboard/deployments']);
    }, 2000);
  }

  protected resetView(): void {
    this.deploymentMode.set(null);
    this.selectedTemplate.set(null);
    this.activeExpertComponent.set(null);
    this.expertArchitecture.set([]);
    this.expertForm = this.formBuilder.group({});
    this.errorMessage.set(null);
  }
}
