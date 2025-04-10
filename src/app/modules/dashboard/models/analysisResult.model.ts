import { ArchitectureModel } from './architecture.model';
import { DiagramModel } from './diagram.model';
import { PlanningModel } from './planning.model';

export interface AnalysisResultModel {
  id?: string;
  architectures: ArchitectureModel[];
  planning: PlanningModel;
  design: DiagramModel[];
  development: string;
  charte: string;
  landing: string;
  testing: string;
  createdAt: Date;
}
