import {
  DeploymentModel,
  ArchitectureComponent,
  GitRepository,
  EnvironmentVariable,
  ArchitectureTemplate,
} from '../../deployment.model';

/**
 * Interface représentant les données du formulaire de déploiement
 */
export interface DeploymentFormData {
  mode: 'beginner' | 'assistant' | 'template' | 'expert';
  name: string;
  environment: 'development' | 'staging' | 'production';
  repoUrl?: string;
  branch?: string;
  templateId?: string;
  aiPrompt?: string;
  customComponents?: ArchitectureComponent[];
  gitRepository?: GitRepository;
  customArchitecture?: {
    components: Array<{
      instanceId: string;
      type: string;
      config: Record<string, any>;
    }>;
  };
  environmentVariables?: EnvironmentVariable[];
}

/**
 * Interface pour la requête de validation de dépôt Git
 */
export interface GitRepositoryValidationRequest {
  repoUrl: string;
  accessToken?: string;
}

/**
 * Interface pour la réponse de validation de dépôt Git
 */
export interface GitRepositoryValidationResponse {
  valid: boolean;
  branches: string[];
  error?: string;
}

/**
 * Classe utilitaire pour la validation des données de déploiement
 */
export class DeploymentValidators {
  /**
   * Valide les données du formulaire de déploiement
   * @param formData Les données du formulaire à valider
   * @returns Tableau des messages d'erreur (vide si aucune erreur)
   */
  static validateFormData(formData: DeploymentFormData): string[] {
    const errors: string[] = [];

    if (!formData.name) errors.push('Name is required');
    if (!formData.environment) errors.push('Environment is required');

    // Mode-specific validation
    switch (formData.mode) {
      case 'beginner':
      case 'expert':
        if (formData.repoUrl && !formData.branch) {
          errors.push('Branch is required when repository URL is provided');
        }
        break;
      case 'template':
        if (!formData.templateId) errors.push('Template selection is required');
        break;
      case 'assistant':
        if (!formData.aiPrompt) errors.push('AI prompt is required');
        break;
    }

    return errors;
  }

  /**
   * Valide un dépôt Git
   * @param repo Le dépôt Git à valider
   * @returns Tableau des messages d'erreur (vide si aucune erreur)
   */
  static validateGitRepository(repo?: GitRepository): string[] {
    const errors: string[] = [];
    if (!repo) return errors;

    if (!repo.url) errors.push('Repository URL is required');
    if (!repo.branch) errors.push('Branch name is required');
    if (!repo.provider) errors.push('Git provider is required');

    return errors;
  }

  /**
   * Valide les composants d'architecture
   * @param components Les composants d'architecture à valider
   * @returns Tableau des messages d'erreur (vide si aucune erreur)
   */
  static validateArchitectureComponents(
    components?: ArchitectureComponent[]
  ): string[] {
    const errors: string[] = [];
    if (!components || components.length === 0) return errors;

    components.forEach((comp, index) => {
      if (!comp.instanceId)
        errors.push(`Component ${index + 1} is missing an instance ID`);
      if (!comp.type) errors.push(`Component ${index + 1} is missing a type`);
    });

    return errors;
  }
}

/**
 * Classe utilitaire pour mapper les données entre le formulaire et le modèle de déploiement
 */
export class DeploymentMapper {
  /**
   * Convertit les données du formulaire en modèle de déploiement
   * @param formData Les données du formulaire
   * @param projectId L'identifiant du projet
   * @returns Un objet de déploiement partiel
   */
  static formDataToDeploymentModel(
    formData: DeploymentFormData,
    projectId: string
  ): Partial<DeploymentModel> {
    const deployment: Partial<DeploymentModel> = {
      projectId,
      name: formData.name,
      environment: formData.environment,
      status: 'configuring',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add Git repository if present
    if (formData.repoUrl) {
      deployment.gitRepository = {
        provider: 'github',
        url: formData.repoUrl,
        branch: formData.branch || 'main',
      };
    } else if (formData.gitRepository) {
      deployment.gitRepository = formData.gitRepository;
    }

    // Add environment variables if present
    if (formData.environmentVariables?.length) {
      deployment.environmentVariables = formData.environmentVariables;
    }

    // Add architecture components for expert mode
    if (formData.customComponents?.length) {
      deployment.architectureComponents = formData.customComponents;
    }

    // Add template details for template mode
    if (formData.templateId) {
      deployment.architectureTemplates = [
        {
          id: formData.templateId,
          provider: 'aws',
          category: 'general',
          name: 'Selected Template',
          description: 'Template selected for deployment',
          tags: [],
          icon: '🏗️',
        },
      ];
    }

    return deployment;
  }
}
