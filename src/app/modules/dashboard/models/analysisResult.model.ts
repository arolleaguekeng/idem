import { BrandIdentityModel } from './brand-identity.model';
import { DiagramModel } from './diagram.model';
import { LandingModel } from './landing.model';
import { BusinessPlanModel } from './businessPlan.model';
import { WebContainerModel } from './webcontainer.model';

export interface AnalysisResultModel {
  id?: string;
  businessPlan?: BusinessPlanModel;
  design: DiagramModel;
  development: WebContainerModel;
  branding: BrandIdentityModel;
  landing: LandingModel;
  testing: string;
  createdAt: Date;
}
