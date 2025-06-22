import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ArchitectureTemplate } from '../../../../../models/deployment.model';
import {
  DeploymentFormData,
  DeploymentValidators,
  DeploymentMapper,
} from '../../../../../models/api/deployments/deployments.api.model';
import { CookieService } from '../../../../../../../shared/services/cookie.service';
import { DeploymentService } from '../../../../../services/deployment.service';

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
@Component({
  selector: 'app-template-deployment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './template-deployment.html',
  styleUrl: './template-deployment.css',
})
export class TemplateDeployment {
  // Template mode state
  protected readonly availableTemplates = signal<ArchitectureTemplate[]>([]);
  protected readonly selectedTemplate = signal<ArchitectureTemplate | null>(
    null
  );
  protected readonly loadingDeployment = signal<boolean>(false);
  protected readonly projectId = signal<string | null>(null);
  protected readonly errorMessages = signal<string[]>([]);
  protected readonly validationErrors = signal<string[]>([]);
  protected deploymentConfigForm: FormGroup;
  private readonly formBuilder = inject(FormBuilder);
  private readonly cookieService = inject(CookieService);
  private readonly deploymentService = inject(DeploymentService);
  private readonly router = inject(Router); // Injection de Router

  constructor() {
    this.deploymentConfigForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      environment: ['development', Validators.required],
      repoUrl: [''],
      branch: ['main'],
    });
    this.loadAvailableTemplates();

    // Set up form validation
    this.setupFormValidation();
  }

  private loadAvailableTemplates(): void {
    this.availableTemplates.set(MOCK_TEMPLATES);
  }

  private clearErrors(): void {
    this.errorMessages.set([]);
    this.validationErrors.set([]);
  }
  // --- SETUP METHODS ---
  private setupFormValidation(): void {
    this.deploymentConfigForm.valueChanges.subscribe(() => {
      this.validateCurrentForm();
    });
  }

  protected selectTemplate(template: ArchitectureTemplate): void {
    this.selectedTemplate.set(template);
    this.validateCurrentForm();
  }

  private getFormData(): DeploymentFormData {
    const mode = 'template';
    const formValue = this.deploymentConfigForm.value;

    return {
      mode: mode!,
      name: formValue.name,
      environment: formValue.environment,
      repoUrl: formValue.repoUrl,
      branch: formValue.branch,
      templateId: this.selectedTemplate()?.id,
    };
  }

  private validateCurrentForm(): void {
    const formData = this.getFormData();
    const errors: string[] = [];

    // Validation complète du formulaire
    errors.push(...DeploymentValidators.validateFormData(formData));

    // Validation spécifique du repository Git (si fourni)
    if (formData.repoUrl) {
      const gitRepo = {
        url: formData.repoUrl,
        branch: formData.branch || 'main',
        provider: 'github' as 'github' | 'gitlab' | 'bitbucket' | 'azure-repos', // Cast vers le type correct
      };
      errors.push(...DeploymentValidators.validateGitRepository(gitRepo));
    }

    if (!this.selectedTemplate()) {
      errors.push('Please select an architecture template');
    }

    this.validationErrors.set(errors);
  }

  protected createDeployment(): void {
    if (!this.deploymentConfigForm.valid || !this.projectId()) {
      this.errorMessages.set([
        'Please fill in all required fields and select a project.',
      ]);
      return;
    }

    this.loadingDeployment.set(true);

    // Récupérer les données du formulaire
    const formData = this.getFormData();

    // Utiliser le template sélectionné pour les composants d'architecture
    if (this.selectedTemplate()) {
      // TODO: Générer les composants d'architecture correspondant au template sélectionné
      formData.customComponents = [];
    }

    // Utiliser DeploymentMapper pour créer l'objet de déploiement
    const deploymentData = DeploymentMapper.formDataToDeploymentModel(
      formData,
      this.projectId()!
    );

    // Log du payload pour debugging
    console.log('🚀 Creating deployment with payload:', deploymentData);

    // Soumettre au service
    this.deploymentService.createDeployment(deploymentData).subscribe({
      next: (deployment) => {
        console.log('✅ Deployment created successfully:', deployment);
        this.loadingDeployment.set(false);
        this.router.navigate(['/console/dashboard/deployments']);
      },
      error: (error) => {
        console.error('❌ Error creating deployment:', error);
        this.loadingDeployment.set(false);
        this.errorMessages.set([
          error.message || 'Failed to create deployment',
        ]);
      },
    });
  }
}
