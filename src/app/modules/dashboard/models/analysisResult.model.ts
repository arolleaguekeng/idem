import { ArchitectureModel } from './architecture.model';

export interface AnalysisResultModel {
  id?: string;
  architectures: ArchitectureModel[];
  planning: string;
  design: string;
  development: string;
  charte: string;
  landing: string;
  testing: string;
  createdAt: Date;
}
