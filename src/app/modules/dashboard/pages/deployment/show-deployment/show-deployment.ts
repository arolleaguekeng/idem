import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeploymentService } from '../../../services/deployment.service';
import { CookieService } from '../../../../../shared/services/cookie.service';
import { 
  DeploymentModel, 
  GitRepository, 
  CloudProvider, 
  InfrastructureConfig, 
  EnvironmentVariable 
} from '../../../models/deployment.model';

@Component({
  selector: 'app-create-deployment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './show-deployment.html',
  styleUrl: './show-deployment.css',
})
export class ShowDeployment implements OnInit {
  // Angular-initialized properties
  protected readonly deploymentMode = signal<'quick' | 'advanced' | null>(null);
  protected readonly loadingGitInfo = signal<boolean>(false);
  protected readonly loadingDeployment = signal<boolean>(false);
  protected readonly projectId = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  // Form groups
  protected gitRepositoryForm: FormGroup;
  protected deploymentConfigForm: FormGroup;
  protected cloudProviderForm: FormGroup;
  protected environmentVariablesForm: FormGroup;

  // Data structures
  protected readonly gitBranches = signal<string[]>([]);
  protected readonly cloudProviders = [
    { id: 'aws', name: 'AWS', icon: 'assets/icons/aws.svg' },
    { id: 'gcp', name: 'Google Cloud', icon: 'assets/icons/gcp.svg' },
    { id: 'azure', name: 'Azure', icon: 'assets/icons/azure.svg' },
    { id: 'self-hosted', name: 'Self-hosted', icon: 'assets/icons/kubernetes.svg' },
  ];
  
  protected readonly environments = [
    { id: 'development', name: 'Development' },
    { id: 'staging', name: 'Staging' },
    { id: 'production', name: 'Production' }
  ];
  
  protected readonly serviceTypes = [
    { id: 'container', name: 'Container' },
    { id: 'kubernetes', name: 'Kubernetes' },
    { id: 'serverless', name: 'Serverless' },
    { id: 'vm', name: 'Virtual Machine' }
  ];

  // Services
  private readonly formBuilder = inject(FormBuilder);
  private readonly deploymentService = inject(DeploymentService);
  private readonly cookieService = inject(CookieService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    // Initialize forms
    this.gitRepositoryForm = this.formBuilder.group({
      provider: ['github', Validators.required],
      url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.*$/)]],
      branch: ['', Validators.required],
      accessToken: ['']
    });

    this.deploymentConfigForm = this.formBuilder.group({
      name: ['', Validators.required],
      environment: ['development', Validators.required],
      serviceType: ['container', Validators.required],
      resources: this.formBuilder.group({
        cpu: ['0.5'],
        memory: ['512Mi'],
        instances: [1]
      }),
      networking: this.formBuilder.group({
        loadBalancer: [true],
        highAvailability: [false],
        publicAccess: [true]
      }),
      database: this.formBuilder.group({
        type: [''],
        version: [''],
        size: [''],
        highAvailability: [false]
      })
    });

    this.cloudProviderForm = this.formBuilder.group({
      type: ['aws', Validators.required],
      region: ['us-east-1'],
      accountId: [''],
      credentials: this.formBuilder.group({
        roleArn: [''],
        serviceAccountId: [''],
        servicePrincipalId: ['']
      })
    });

    this.environmentVariablesForm = this.formBuilder.group({
      variables: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    // Get project ID from cookie
    const projectId = this.cookieService.getCookie('activeProjectId');
    this.projectId.set(projectId);
    
    if (!projectId) {
      this.errorMessage.set('No active project selected');
    }
    
    // Add initial environment variable fields
    this.addEnvironmentVariable();
  }

  protected setDeploymentMode(mode: 'quick' | 'advanced'): void {
    this.deploymentMode.set(mode);
  }

  protected fetchGitBranches(): void {
    if (!this.gitRepositoryForm.get('url')?.valid) {
      return;
    }

    const repoUrl = this.gitRepositoryForm.get('url')?.value;
    const accessToken = this.gitRepositoryForm.get('accessToken')?.value;
    this.loadingGitInfo.set(true);

    this.deploymentService.validateRepository(repoUrl, accessToken).subscribe({
      next: (branches) => {
        this.gitBranches.set(branches);
        this.loadingGitInfo.set(false);
      },
      error: (error) => {
        console.error('Error fetching branches', error);
        this.loadingGitInfo.set(false);
        this.errorMessage.set('Failed to fetch branches. Please check repository URL and access token.');
      }
    });
  }

  protected get environmentVariables(): FormArray {
    return this.environmentVariablesForm.get('variables') as FormArray;
  }

  protected addEnvironmentVariable(): void {
    this.environmentVariables.push(this.formBuilder.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
      isSecret: [false]
    }));
  }

  protected removeEnvironmentVariable(index: number): void {
    this.environmentVariables.removeAt(index);
  }

  protected createDeployment(): void {
    if (!this.projectId()) {
      this.errorMessage.set('No active project selected');
      return;
    }

    this.loadingDeployment.set(true);
    
    const deploymentData: Partial<DeploymentModel> = {
      projectId: this.projectId()!,
      name: this.deploymentConfigForm.get('name')?.value,
      environment: this.deploymentConfigForm.get('environment')?.value,
      status: 'configuring',
      gitRepository: this.gitRepositoryForm.value as GitRepository,
      cloudProvider: this.cloudProviderForm.value as CloudProvider,
      infrastructureConfig: {
        serviceType: this.deploymentConfigForm.get('serviceType')?.value,
        resources: this.deploymentConfigForm.get('resources')?.value,
        networking: this.deploymentConfigForm.get('networking')?.value,
        database: this.deploymentConfigForm.get('database')?.value
      } as InfrastructureConfig,
      environmentVariables: this.environmentVariables.value as EnvironmentVariable[]
    };

    this.deploymentService.createDeployment(this.projectId()!, deploymentData).subscribe({
      next: (deployment) => {
        this.loadingDeployment.set(false);
        // Navigate to deployment list page
        this.router.navigate(['/console/dashboard', this.projectId(), 'deployments']);
      },
      error: (error) => {
        console.error('Error creating deployment', error);
        this.loadingDeployment.set(false);
        this.errorMessage.set('Failed to create deployment. Please try again.');
      }
    });
  }

  protected resetForms(): void {
    this.gitRepositoryForm.reset({
      provider: 'github',
    });
    this.deploymentConfigForm.reset({
      environment: 'development',
      serviceType: 'container'
    });
    this.cloudProviderForm.reset({
      type: 'aws'
    });
    
    // Reset environment variables
    while (this.environmentVariables.length !== 0) {
      this.environmentVariables.removeAt(0);
    }
    this.addEnvironmentVariable();
    
    this.deploymentMode.set(null);
    this.errorMessage.set(null);
  }

  protected navigateToDeploymentsList(): void {
    this.router.navigate(['/console/dashboard', this.projectId(), 'deployments']);
  }
}
