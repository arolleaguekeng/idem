import { LogoModel } from './logo.model';

export interface BrandIdentityModel {
  logo: { content: LogoModel; summary: string };
  brandIdentity: {
    id: string;
    name: string;
    data: any;
    summary: string;
  }[];
}
