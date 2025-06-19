export interface GitRepository {
  provider: 'github' | 'gitlab' | 'bitbucket' | 'azure-repos';
  url: string;
  branch: string;
  accessToken?: string; // PAT or OAuth token (stored encrypted)
  webhookId?: string; // ID of the configured webhook
}

export interface EnvironmentVariable {
  key: string;
  value: string;
  isSecret: boolean;
  // Secrets are encrypted at rest and in transit
}

export interface PipelineStep {
  name: string;
  status: 'pending' | 'in-progress' | 'succeeded' | 'failed' | 'skipped';
  startedAt?: Date;
  finishedAt?: Date;
  logs?: string; // URL of the logs or snippet
  errorMessage?: string; // Error message if failed
  aiRecommendation?: string; // AI recommendations if failed
}

export interface CostEstimation {
  monthlyCost: number;
  currency: string;
  breakdown: Record<string, number>; // Breakdown by service
  lastUpdated: Date;
}

export interface DeploymentModel {
  id: string;
  projectId: string;
  name: string; // Friendly name for the deployment
  environment: 'development' | 'staging' | 'production';
  status:
    | 'configuring'
    | 'pending'
    | 'building'
    | 'infrastructure-provisioning'
    | 'deploying'
    | 'deployed'
    | 'rollback'
    | 'failed'
    | 'cancelled';

  // Configuration
  gitRepository?: GitRepository;
  environmentVariables?: EnvironmentVariable[];

  // Monitoring of the pipeline
  pipeline?: {
    currentStage: string;
    steps: PipelineStep[];
    startedAt?: Date;
    estimatedCompletionTime?: Date;
  };

  // Security and analysis
  staticCodeAnalysis?: {
    score?: number; // Code quality score (0-100)
    issues?: { severity: string; count: number }[];
    reportUrl?: string;
  };
  costEstimation?: CostEstimation;

  // Deployment details
  url?: string; // URL where the deployment can be accessed
  version?: string; // ex: commit hash or semantic version
  logs?: string; // Link to the deployment logs
  deployedAt?: Date; // Timestamp of the end of the deployment

  // Rollback management
  rollbackVersions?: string[]; // Previous versions for rollback
  lastSuccessfulDeployment?: string; // ID of the last successful deployment

  // Standard timestamps
  createdAt: Date;
  updatedAt: Date;

  // New fields using simplified interfaces
  chatMessages?: ChatMessage[];
  architectureTemplates?: ArchitectureTemplate[];
  cloudComponents?: CloudComponentDetailed[];
  architectureComponents?: ArchitectureComponent[];
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface ArchitectureTemplate {
  id: string;
  provider: 'aws' | 'gcp' | 'azure';
  category: string;
  name: string;
  description: string;
  tags: string[];
  icon: string;
}

// Form configuration interfaces
export interface FormOption {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'toggle';
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string }[];
}

export interface CloudComponentDetailed {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: 'aws' | 'gcp' | 'azure';
  icon: string;
  pricing?: string;
  options?: FormOption[];
}

export interface ArchitectureComponent extends CloudComponentDetailed {
  instanceId: string;
  type: string; // Component type identifier (e.g., 'database', 'compute', 'storage')
  configuration?: { [key: string]: any };
  dependencies?: string[];
}

// Deployment creation payload for API calls
export interface CreateDeploymentPayload {
  name: string;
  environment: DeploymentModel['environment'];
  gitRepository?: Partial<GitRepository>;
  environmentVariables?: EnvironmentVariable[];
  architectureTemplate?: string; // Template ID
  customArchitecture?: {
    name: string;
    components: {
      instanceId: string;
      type: string;
      config: Record<string, any>;
    }[];
  };
  aiGeneratedConfig?: {
    prompt: string;
    generatedInfrastructure: Record<string, any>;
  };
}

// Form data interface for component mapping
export interface DeploymentFormData {
  mode: 'beginner' | 'assistant' | 'template' | 'expert';
  name: string;
  environment: DeploymentModel['environment'];
  repoUrl?: string;
  branch?: string;
  templateId?: string;
  aiPrompt?: string;
  customComponents?: ArchitectureComponent[];
  environmentVariables?: EnvironmentVariable[];
}

// Validation helpers
export class DeploymentValidators {
  static validateBasicInfo(data: Partial<DeploymentFormData>): string[] {
    const errors: string[] = [];

    if (!data.name?.trim()) {
      errors.push('Deployment name is required');
    }

    if (!data.environment) {
      errors.push('Environment is required');
    }

    return errors;
  }

  static validateGitRepository(repo?: Partial<GitRepository>): string[] {
    const errors: string[] = [];

    if (repo) {
      if (!repo.url?.trim()) {
        errors.push('Repository URL is required');
      }

      if (!repo.branch?.trim()) {
        errors.push('Branch is required');
      }

      if (repo.url && !this.isValidGitUrl(repo.url)) {
        errors.push('Invalid Git repository URL');
      }
    }

    return errors;
  }

  static validateArchitectureComponents(
    components?: ArchitectureComponent[]
  ): string[] {
    const errors: string[] = [];

    if (components && components.length === 0) {
      errors.push('At least one architecture component is required');
    }

    return errors;
  }

  private static isValidGitUrl(url: string): boolean {
    const gitUrlPattern =
      /^(https?:\/\/)?([\w\.-]+@)?[\w\.-]+[:\.][\w\.-]+(\/[\w\.-]*)*\/?$/;
    return gitUrlPattern.test(url);
  }
}

// Mapping utilities
export class DeploymentMapper {
  static fromFormToPayload(
    formData: DeploymentFormData,
    projectId: string
  ): CreateDeploymentPayload {
    const payload: CreateDeploymentPayload = {
      name: formData.name,
      environment: formData.environment,
    };

    // Map git repository if provided
    if (formData.repoUrl) {
      payload.gitRepository = {
        url: formData.repoUrl,
        branch: formData.branch || 'main',
        provider: this.inferGitProvider(formData.repoUrl),
      };
    }

    // Map based on deployment mode
    switch (formData.mode) {
      case 'template':
        payload.architectureTemplate = formData.templateId;
        break;

      case 'expert':
        if (formData.customComponents && formData.customComponents.length > 0) {
          payload.customArchitecture = {
            name: 'Custom Architecture',
            components: formData.customComponents.map((comp) => ({
              instanceId: comp.instanceId,
              type: comp.id,
              config: {},
            })),
          };
        }
        break;

      case 'assistant':
        if (formData.aiPrompt) {
          payload.aiGeneratedConfig = {
            prompt: formData.aiPrompt,
            generatedInfrastructure: {},
          };
        }
        break;
    }

    // Add environment variables if provided
    if (formData.environmentVariables?.length) {
      payload.environmentVariables = formData.environmentVariables;
    }

    return payload;
  }

  static toFormData(deployment: DeploymentModel): Partial<DeploymentFormData> {
    return {
      name: deployment.name,
      environment: deployment.environment,
      repoUrl: deployment.gitRepository?.url,
      branch: deployment.gitRepository?.branch,
      customComponents: deployment.architectureComponents,
      environmentVariables: deployment.environmentVariables,
    };
  }

  private static inferGitProvider(url: string): GitRepository['provider'] {
    if (url.includes('github.com')) return 'github';
    if (url.includes('gitlab.com')) return 'gitlab';
    if (url.includes('bitbucket.org')) return 'bitbucket';
    if (url.includes('azure.com') || url.includes('visualstudio.com'))
      return 'azure-repos';
    return 'github'; // default
  }
}
