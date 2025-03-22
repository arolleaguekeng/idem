import { ArchitectureModel } from './architecture.model';

export interface AnalysisResultModel {
  id?: string; // ID généré par Firestore
  projectId: string; // ID du projet associé
  architectures: ArchitectureModel[]; // Architectures recommandées
  createdAt: Date; // Date de création
}
