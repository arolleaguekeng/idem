import { ArchitectureModel } from './architecture.model';
import { BrandIdentityModel } from './brand-identity.model';
import { DiagramModel } from './diagram.model';
import { LandingModel } from './landing.model';
import { PlanningModel } from './planning.model';

export interface AnalysisResultModel {
  id?: string;
  architectures: ArchitectureModel[];
  planning: PlanningModel[];
  design: DiagramModel[];
  development: string;
  branding: BrandIdentityModel;
  landing: LandingModel;
  testing: string;
  createdAt: Date;
}
