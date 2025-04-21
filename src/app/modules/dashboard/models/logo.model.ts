export interface LogoModel {
  svg: string; // Main SVG logo (default full version)
  concept: string; // Branding story or meaning behind the logo
  colors: string[]; // Array of HEX color codes used in the logo
  fonts: string[]; // Fonts used in the logo (if any)

  variations?: {
    lightBackground?: string; // Version optimized for light backgrounds
    darkBackground?: string; // Version optimized for dark backgrounds
    monochrome?: string; // Simplified version in black or white
  };
}
