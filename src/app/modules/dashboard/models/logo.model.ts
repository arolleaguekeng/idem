export interface LogoModel {
  svg: string; // Main SVG logo (default full version)
  summary: string; // Short description of the visual style and structure
  concept: string; // Branding story or meaning behind the logo
  colors: string[]; // Array of HEX color codes used in the logo
  fonts: string[]; // Fonts used in the logo (if any)
  variations?: {
    monochrome?: string; // Simplified version in black or white
  };
}
