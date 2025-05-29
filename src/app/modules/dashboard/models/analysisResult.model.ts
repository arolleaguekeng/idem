import { ArchitectureModel } from './architecture.model';
import { BrandIdentityModel } from './brand-identity.model';
import { DiagramModel } from './diagram.model';
import { LandingModel } from './landing.model';
import { BusinessPlanModel } from './businessPlan.model';

export interface AnalysisResultModel {
  id?: string;
  architectures: ArchitectureModel[];
  businessPlan?: BusinessPlanModel;
  design: DiagramModel[];
  development: string;
  branding: BrandIdentityModel;
  landing: LandingModel;
  testing: string;
  createdAt: Date;
}
