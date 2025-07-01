import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  AiAssistantDeploymentModel,
  ChatMessage,
} from '../../../../../models/deployment.model';
import {
  DeploymentFormData,
  DeploymentValidators,
} from '../../../../../models/api/deployments/deployments.api.model';
import { CookieService } from '../../../../../../../shared/services/cookie.service';
import { DeploymentService } from '../../../../../services/deployment.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ai-assistant.html',
  styleUrl: './ai-assistant.css',
})
export class AiAssistant implements OnInit {
  // Angular properties (inputs, outputs, queries)

  // AI Assistant state signals
  protected readonly chatMessages = signal<ChatMessage[]>([]);
  protected readonly aiPrompt = signal<string>('');
  protected readonly aiIsThinking = signal<boolean>(false);
  protected readonly loadingDeployment = signal<boolean>(false);
  protected readonly projectId = signal<string | null>(null);
  protected readonly errorMessages = signal<string[]>([]);
  protected readonly validationErrors = signal<string[]>([]);
  protected readonly generatedArchitecture = signal<boolean>(false);

  // Form controls
  protected deploymentConfigForm: FormGroup;

  // Services
  private readonly formBuilder = inject(FormBuilder);
  private readonly cookieService = inject(CookieService);
  private readonly deploymentService = inject(DeploymentService);
  private readonly router = inject(Router);

  constructor() {
    this.deploymentConfigForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      environment: ['development', Validators.required],
      repoUrl: [''],
      branch: ['main'],
    });
  }

  ngOnInit(): void {
    // Initialize project ID from cookie
    const projectId = this.cookieService.get('projectId');
    if (!projectId) {
      console.error('No project ID found in cookies');
      this.errorMessages.set([
        'No project selected. Please select a project first.',
      ]);
    } else {
      this.projectId.set(projectId);
      console.log('AI Assistant initialized with project ID:', projectId);
    }

    // Initialize chat with welcome message
    this.chatMessages.set([
      {
        sender: 'ai',
        text: "Hello! I'm your AI assistant. Describe the infrastructure you'd like to deploy.",
        timestamp: new Date(),
      },
    ]);

    // Set up form validation
    this.setupFormValidation();
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

  protected updatePrompt(prompt: string): void {
    this.aiPrompt.set(prompt);
  }

  protected sendAiPrompt(): void {
    const prompt = this.aiPrompt().trim();
    if (!prompt || this.aiIsThinking()) return;

    // Clear the input field
    this.aiPrompt.set('');
    
    // Add user message to chat
    this.chatMessages.update((messages) => [
      ...messages,
      { sender: 'user', text: prompt, timestamp: new Date() },
    ]);

    // Set thinking state
    this.aiIsThinking.set(true);

    // Simulate AI response (in a real implementation, this would call an API)
    setTimeout(() => {
      // Generate a mock response based on the prompt
      let response = this.generateMockAiResponse(prompt);
      
      // Add AI response to chat
      this.chatMessages.update((messages) => [
        ...messages,
        { sender: 'ai', text: response, timestamp: new Date() },
      ]);
      
      // Set architecture as generated if this is the first user message
      if (!this.generatedArchitecture()) {
        this.generatedArchitecture.set(true);
      }
      
      // Stop thinking state
      this.aiIsThinking.set(false);
      
      // Validate form after AI response
      this.validateCurrentForm();
    }, 2000);
  }

  private generateMockAiResponse(prompt: string): string {
    // This is a mock implementation - in a real app, this would call an AI service
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('aws') || promptLower.includes('amazon')) {
      return "Based on your requirements, I recommend an AWS architecture with EC2 instances for compute, RDS for database, and S3 for storage. This setup provides good scalability and reliability. Would you like me to add any specific components like load balancing or CDN?";
    } else if (promptLower.includes('gcp') || promptLower.includes('google')) {
      return "I've designed a Google Cloud Platform architecture with Cloud Run for serverless containers, Cloud SQL for database, and Cloud Storage for files. This is cost-effective and highly scalable. Do you need any specific regional deployment?";
    } else if (promptLower.includes('azure') || promptLower.includes('microsoft')) {
      return "For your Azure deployment, I recommend App Service for hosting, Azure SQL for database, and Azure Blob Storage. This provides a managed environment with good integration options. Would you like to add Azure Functions for serverless capabilities?";
    } else if (promptLower.includes('database') || promptLower.includes('sql')) {
      return "I've added a managed database service to your architecture. Would you prefer a SQL or NoSQL solution? For high availability, I've configured it with automated backups and failover capability.";
    } else {
      return "I've analyzed your requirements and designed a cloud architecture that includes compute resources, storage, and networking components. The architecture follows best practices for security and scalability. Would you like me to explain any specific part in more detail?";
    }
  }

  private getFormData(): DeploymentFormData {
    const formValue = this.deploymentConfigForm.value;
    
    return {
      mode: 'ai-assistant',
      name: formValue.name,
      environment: formValue.environment,
      repoUrl: formValue.repoUrl,
      branch: formValue.branch,
      aiPrompt: this.chatMessages().map(msg => msg.text).join('\n'),
      chatMessages: this.chatMessages(),
      aiGeneratedArchitecture: this.generatedArchitecture(),
    };
  }

  private validateCurrentForm(): void {
    const formData = this.getFormData();
    const errors: string[] = [];

    // Complete form validation
    errors.push(...DeploymentValidators.validateFormData(formData));

    // Git repository validation (if provided)
    if (formData.repoUrl) {
      const gitRepo = {
        url: formData.repoUrl,
        branch: formData.branch || 'main',
        provider: 'github' as 'github' | 'gitlab' | 'bitbucket' | 'azure-repos',
      };
      errors.push(...DeploymentValidators.validateGitRepository(gitRepo));
    }

    // AI-specific validation
    if (this.chatMessages().length <= 1) { // Only the welcome message
      errors.push('Please interact with the AI assistant before creating a deployment');
    }

    this.validationErrors.set(errors);
  }

  protected createDeployment(): void {
    // Validate project ID
    if (!this.projectId()) {
      this.errorMessages.set([
        'No project selected. Please select a project first.',
      ]);
      return;
    }

    // Validate form
    if (!this.deploymentConfigForm.valid) {
      this.errorMessages.set(['Please fill in all required fields.']);
      return;
    }

    // Validate AI interaction
    if (this.chatMessages().length <= 1) { // Only the welcome message
      this.errorMessages.set(['Please interact with the AI assistant before creating a deployment']);
      return;
    }

    this.loadingDeployment.set(true);
    this.clearErrors();

    // Get form data
    const formData = this.getFormData();

    // Use DeploymentMapper to create the deployment object
    const deploymentData: AiAssistantDeploymentModel = {
      mode: 'ai-assistant',
      chatMessages: this.chatMessages(),
      aiGeneratedArchitecture: this.generatedArchitecture(),
      name: formData.name,
      environment: formData.environment,
      id: '',
      projectId: this.projectId()!,
      status: 'configuring',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Log the payload for debugging
    console.log('Creating AI assistant deployment with payload:', deploymentData);

    // Submit to service
    this.deploymentService.createAiAssistantDeployment(deploymentData).subscribe({
      next: (deployment) => {
        console.log('AI assistant deployment created successfully:', deployment);
        this.loadingDeployment.set(false);
        this.router.navigate(['/console/dashboard/deployments']);
      },
      error: (error) => {
        console.error('Error creating AI assistant deployment:', error);
        this.loadingDeployment.set(false);
        this.errorMessages.set([
          error.message || 'Failed to create AI assistant deployment',
        ]);
      },
    });
  }
}
