import { LogoModel } from './logo.model';

export interface BrandIdentityModel {
  logo: { content: LogoModel; summary: string };
  colors: {
    id: string;
    name: string;
    exaDecimal: string;
  }[];
  typography: {
    fonts: {
      id: string;
      name: string;
    }[];
  }[];
  brandIdentity: {
    id: string;
    name: string;
    data: any;
    summary: string;
  }[];
}
