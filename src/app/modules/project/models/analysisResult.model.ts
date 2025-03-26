import { ArchitectureModel } from './architecture.model';

export interface AnalysisResultModel {
  id?: string; 
  projectId: string; 
  architectures: ArchitectureModel[]; 
  feasibilityStudy: string;
  createdAt: Date; 
}
