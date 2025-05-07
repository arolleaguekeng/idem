import { Injectable } from '@angular/core';
import { BrandIdentityModel } from '../../../models/brand-identity.model';
import { ProjectModel } from '../../../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class WebGenService {
  constructor() {}

  /**
   * Generates an optimized AI prompt for website generation
   * @param project - The project configuration
   * @param brand - Complete brand identity guidelines
   * @param selectedOptions - Technical stack and feature selections
   * @returns Formatted prompt string for AI consumption
   */
  generateWebsitePrompt(
    project: ProjectModel,
    selectedOptions: {
      stack: string;
      seoEnabled: boolean;
      contactFormEnabled: boolean;
      analyticsEnabled: boolean;
      i18nEnabled: boolean;
      performanceOptimized: boolean;
    }
  ): string {
    // Validate required inputs
    if (!project?.description) {
      throw new Error('Project description is required');
    }

    // Build prompt sections
    const sections = [
      this._buildProjectOverview(project),
      this._buildTechnicalSpecs(project, selectedOptions),
      this._buildBrandGuidelines(project.analysisResultModel.branding),
      this._buildOutputRequirements(),
      this._buildQualityStandards(),
    ];

    return sections.join('\n\n');
  }

  private _buildProjectOverview(project: ProjectModel): string {
    return `# PROJECT OVERVIEW
            **Name:** ${project.name}
            **Type:** ${project.type.toUpperCase()}
            **Description:** ${project.description}
            **Target Audience:** ${project.targets}
            **Key Constraints:**
            ${project.constraints.map((c) => `- ${c}`).join('\n')}
            **Team Size:** ${project.teamSize}
            ${
              project.budgetIntervals
                ? `**Budget:** ${project.budgetIntervals}`
                : ''
            }`;
  }

  private _buildTechnicalSpecs(project: ProjectModel, options: any): string {
    return `# TECHNICAL SPECIFICATIONS
            **Framework:** ${options.stack.toUpperCase()}
            **Core Features:**
            - SEO: ${options.seoEnabled ? 'Advanced optimization' : 'Basic'}
            - Contact Form: ${
              options.contactFormEnabled ? 'Included' : 'Excluded'
            }
            - Analytics: ${
              options.analyticsEnabled ? 'Configured' : 'Not included'
            }
            - i18n: ${
              options.i18nEnabled ? 'Multi-language support' : 'Single language'
            }
            - Performance: ${
              options.performanceOptimized ? 'Optimized' : 'Standard'
            }

            **Architecture Requirements:**
            - ${
              project.type === 'web'
                ? 'Responsive design'
                : 'Platform-specific patterns'
            }
            - ${
              project.teamSize.includes('1')
                ? 'Simple structure'
                : 'Modular architecture'
            }
            ${
              project.constraints.includes('Low bandwidth')
                ? '- Data efficiency prioritized'
                : ''
            }`;
  }

  private _buildBrandGuidelines(brand: BrandIdentityModel): string {
    return `# BRAND GUIDELINES
            **Visual Identity:**
            - Colors: ${brand.colorSystem.summary}
            - Typography: ${brand.typographySystem.summary}
            - Logo Usage: ${brand.logo.content}...

            **Tone & Voice:**
            ${brand.toneOfVoice.content.substring(0, 200)}...

            **Layout Principles:**
            ${brand.layoutAndComposition.summary}`;
  }

  private _buildOutputRequirements(): string {
    return `# OUTPUT REQUIREMENTS
            1. **Complete Source Code**:
            - Component-based architecture
            - Proper TypeScript typing
            - Environment configuration

            2. **Documentation**:
            - Setup instructions
            - Style guide
            - Component API references

            3. **Design Tokens**:
            - Color palette in JSON
            - Typography scale
            - Spacing system`;
  }

  private _buildQualityStandards(): string {
    return `# QUALITY STANDARDS
        - WCAG AA accessibility compliance
        - Mobile-first responsive design
        - Cross-browser compatibility
        - Clean, linted code
        - Comprehensive documentation
        - Performance optimized assets`;
  }
}
