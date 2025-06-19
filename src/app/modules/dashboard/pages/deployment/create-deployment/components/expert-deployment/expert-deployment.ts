import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CloudComponentDetailed,
  ArchitectureComponent,
} from '../../../../../models/deployment.model';

const ALL_COMPONENTS_LIST: CloudComponentDetailed[] = [
  {
    id: 'ec2',
    name: 'EC2 Instance',
    description: 'Virtual compute capacity in the cloud',
    category: 'Compute',
    provider: 'aws',

    icon: 'pi pi-server',
    pricing: '$0.0116/hour',
    options: [
      {
        name: 'instanceType',
        label: 'Instance Type',
        type: 'select',
        required: true,
        options: [
          { label: 't2.micro', value: 't2.micro' },
          { label: 't2.small', value: 't2.small' },
          { label: 't2.medium', value: 't2.medium' },
        ],
      },
      {
        name: 'storage',
        label: 'Storage (GB)',
        type: 'number',
        required: true,
        defaultValue: 20,
      },
    ],
  },
  {
    id: 'rds',
    name: 'RDS Database',
    description: 'Managed relational database service',
    category: 'Database',
    provider: 'aws',
    icon: 'pi pi-database',
    pricing: '$0.017/hour',
    options: [
      {
        name: 'engine',
        label: 'Database Engine',
        type: 'select',
        required: true,
        options: [
          { label: 'MySQL', value: 'mysql' },
          { label: 'PostgreSQL', value: 'postgres' },
          { label: 'MariaDB', value: 'mariadb' },
        ],
      },
      {
        name: 'multiAZ',
        label: 'Multi-AZ Deployment',
        type: 'toggle',
        required: false,
        defaultValue: false,
      },
    ],
  },
  {
    id: 'compute-engine',
    name: 'Compute Engine',
    description: 'Virtual machines running in Google Cloud',
    category: 'Compute',
    provider: 'gcp',
    icon: 'pi pi-server',
    pricing: '$0.0104/hour',
    options: [
      {
        name: 'machineType',
        label: 'Machine Type',
        type: 'select',
        required: true,
        options: [
          { label: 'e2-micro', value: 'e2-micro' },
          { label: 'e2-small', value: 'e2-small' },
          { label: 'e2-medium', value: 'e2-medium' },
        ],
      },
      {
        name: 'bootDiskSize',
        label: 'Boot Disk Size (GB)',
        type: 'number',
        required: true,
        defaultValue: 10,
      },
    ],
  },
  {
    id: 'virtual-machine',
    name: 'Virtual Machine',
    description: 'Virtual machines in Azure',
    category: 'Compute',
    provider: 'azure',
    icon: 'pi pi-server',
    pricing: '$0.0124/hour',
    options: [
      {
        name: 'vmSize',
        label: 'VM Size',
        type: 'select',
        required: true,
        options: [
          { label: 'Standard_B1s', value: 'Standard_B1s' },
          { label: 'Standard_B1ms', value: 'Standard_B1ms' },
          { label: 'Standard_B2s', value: 'Standard_B2s' },
        ],
      },
      {
        name: 'osDiskSize',
        label: 'OS Disk Size (GB)',
        type: 'number',
        required: true,
        defaultValue: 30,
      },
    ],
  },
];
@Component({
  selector: 'app-expert-deployment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './expert-deployment.html',
  styleUrl: './expert-deployment.css',
})
export class ExpertDeployment {
  // Expert mode state
  protected readonly expertSelectedProvider = signal<'aws' | 'gcp' | 'azure'>(
    'aws'
  );
  protected readonly expertSearchTerm = signal<string>('');
  protected readonly expertArchitecture = signal<ArchitectureComponent[]>([]);
  protected readonly activeExpertComponent =
    signal<ArchitectureComponent | null>(null);
  private readonly formBuilder = inject(FormBuilder);
  // Forms
  protected deploymentConfigForm: FormGroup;
  protected expertForm: FormGroup;
  protected readonly loadingDeployment = signal<boolean>(false);

  // Git repository state
  protected readonly gitBranches = signal<string[]>([]);
  protected readonly loadingGitInfo = signal<boolean>(false);

  // Computed properties
  protected readonly filteredCatalogue = computed(() =>
    this.getComponentCatalogue()
  );
  // Utility method for template
  objectKeys = Object.keys;

  protected createDeployment(): void {}

  constructor() {
    this.deploymentConfigForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      environment: ['development', Validators.required],
      repoUrl: [''],
      branch: ['main'],
    });

    this.expertForm = this.formBuilder.group({});
  }

  // --- EXPERT MODE ---
  protected addComponentToArchitecture(componentId: string): void {
    const component = this.getComponentById(componentId);
    if (!component) return;

    const architectureComponent: ArchitectureComponent = {
      ...component,
      instanceId: `${component.id}_${Date.now()}`,
      configuration: {},
      dependencies: [],
      type: '',
    };

    this.expertArchitecture.update((arch) => [...arch, architectureComponent]);

    // Create form group for this component
    if (component.options) {
      const formGroup = this.formBuilder.group({});
      component.options.forEach((option) => {
        const validators = option.required ? [Validators.required] : [];
        formGroup.addControl(
          option.name,
          this.formBuilder.control(option.defaultValue || '', validators)
        );
      });
      this.expertForm.addControl(architectureComponent.instanceId, formGroup);
    }
  }

  protected removeComponentFromArchitecture(instanceId: string): void {
    this.expertArchitecture.update((arch) =>
      arch.filter((comp) => comp.instanceId !== instanceId)
    );
    this.expertForm.removeControl(instanceId);

    // Clear active component if it was the one being removed
    if (this.activeExpertComponent()?.instanceId === instanceId) {
      this.activeExpertComponent.set(null);
    }
  }
  protected getActiveComponentForm(): FormGroup | null {
    const activeComponent = this.activeExpertComponent();
    return activeComponent
      ? (this.expertForm.get(activeComponent.instanceId) as FormGroup)
      : null;
  }

  protected getActiveComponentModel(): CloudComponentDetailed | null {
    const activeComponent = this.activeExpertComponent();
    return activeComponent
      ? this.getComponentById(activeComponent.id) || null
      : null;
  }

  protected selectComponentForConfiguration(
    component: ArchitectureComponent
  ): void {
    this.activeExpertComponent.set(component);
  }

  private getComponentById(id: string): CloudComponentDetailed | undefined {
    const catalogue = this.getComponentCatalogue();
    for (const category of Object.values(catalogue)) {
      const component = category.find((comp) => comp.id === id);
      if (component) return component;
    }
    return undefined;
  }

  private getComponentCatalogue(): { [cat: string]: CloudComponentDetailed[] } {
    const provider = this.expertSelectedProvider();
    const term = this.expertSearchTerm().toLowerCase();

    const filteredComponents = ALL_COMPONENTS_LIST.filter(
      (c) =>
        c.provider === provider &&
        (c.name.toLowerCase().includes(term) ||
          c.description.toLowerCase().includes(term) ||
          c.category.toLowerCase().includes(term))
    );

    return filteredComponents.reduce((acc, comp) => {
      (acc[comp.category] = acc[comp.category] || []).push(comp);
      return acc;
    }, {} as { [cat: string]: CloudComponentDetailed[] });
  }
}
