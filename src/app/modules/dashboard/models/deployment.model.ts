export interface DeploymentModel {
  id: string;
  projectId: string;
  environment: 'development' | 'staging' | 'production';
  status: 'pending' | 'in-progress' | 'succeeded' | 'failed' | 'cancelled';
  url?: string; // URL where the deployment can be accessed
  version?: string; // e.g., git commit hash or semantic version
  logs?: string; // Link to deployment logs or a snippet
  deployedAt?: Date; // Timestamp of when the deployment finished
  createdAt: Date;
  updatedAt: Date;
}
