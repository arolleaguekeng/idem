export interface LogoModel {
  svg: string; // Main SVG logo (default full version)
  summary: string; // Short description of the visual style and structure
  concept: string; // Branding story or meaning behind the logo
  colors: string[]; // Array of HEX color codes used in the logo
  fonts: string[]; // Fonts used in the logo (if any)

  variations?: {
    iconOnly?: string; // SVG of the icon without text
    textOnly?: string; // SVG containing only the brand name with styling
    horizontal?: string; // Logo and text side by side (horizontal layout)
    vertical?: string; // Logo above the text (vertical layout)
    lightBackground?: string; // Version optimized for light backgrounds
    darkBackground?: string; // Version optimized for dark backgrounds
    monochrome?: string; // Simplified version in black or white
  };
}
