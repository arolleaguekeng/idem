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

    // Create user message
    const userMessage: ChatMessage = {
      sender: 'user',
      text: prompt,
      timestamp: new Date(),
    };

    // Add user message to chat
    this.chatMessages.update((messages) => [...messages, userMessage]);

    // Set thinking state
    this.aiIsThinking.set(true);

    // Send message to backend using DeploymentService
    this.deploymentService
      .sendChatMessage(userMessage, this.projectId()!)
      .subscribe({
        next: (response) => {
          // Add AI response to chat
          this.chatMessages.update((messages) => [...messages, response]);

          // Set architecture as generated if this is the first user message
          if (!this.generatedArchitecture()) {
            this.generatedArchitecture.set(true);
          }

          // Stop thinking state
          this.aiIsThinking.set(false);

          // Validate form after AI response
          this.validateCurrentForm();
        },
        error: (error) => {
          console.error('Error getting AI response:', error);

          // Add error message to chat
          this.chatMessages.update((messages) => [
            ...messages,
            {
              sender: 'ai',
              text: 'Sorry, I encountered an error processing your request. Please try again.',
              timestamp: new Date(),
            },
          ]);

          // Stop thinking state
          this.aiIsThinking.set(false);

          // Add to error messages
          this.errorMessages.update((msgs) => [
            ...msgs,
            error.message || 'Failed to get AI response',
          ]);
        },
      });
  }

  // No longer needed as we're using the real API

  private getFormData(): DeploymentFormData {
    const formValue = this.deploymentConfigForm.value;

    return {
      mode: 'ai-assistant',
      name: formValue.name,
      environment: formValue.environment,
      repoUrl: formValue.repoUrl,
      branch: formValue.branch,
      aiPrompt: this.chatMessages()
        .map((msg) => msg.text)
        .join('\n'),
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
    if (this.chatMessages().length <= 1) {
      // Only the welcome message
      errors.push(
        'Please interact with the AI assistant before creating a deployment'
      );
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
    if (this.chatMessages().length <= 1) {
      // Only the welcome message
      this.errorMessages.set([
        'Please interact with the AI assistant before creating a deployment',
      ]);
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
    console.log(
      'Creating AI assistant deployment with payload:',
      deploymentData
    );

    // Submit to service
    this.deploymentService
      .createAiAssistantDeployment(deploymentData)
      .subscribe({
        next: (deployment) => {
          console.log(
            'AI assistant deployment created successfully:',
            deployment
          );
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
