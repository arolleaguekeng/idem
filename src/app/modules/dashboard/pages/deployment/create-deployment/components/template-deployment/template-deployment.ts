import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ArchitectureTemplate,
  DeploymentFormData,
  DeploymentValidators,
} from '../../../../../models/deployment.model';
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

    // Basic validation
    errors.push(...DeploymentValidators.validateBasicInfo(formData));

    // Git repository validation (if provided)
    if (formData.repoUrl) {
      const gitRepo = { url: formData.repoUrl, branch: formData.branch };
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
    const formData = this.getFormData();
    console.log('Creating deployment:', formData);
    this.deploymentService.createDeployment(formData).subscribe({
      next: (response) => {
        console.log('Deployment created successfully:', response);
        this.loadingDeployment.set(false);
      },
      error: (error) => {
        console.error('Error creating deployment:', error);
        this.loadingDeployment.set(false);
      },
    });
  }
}
