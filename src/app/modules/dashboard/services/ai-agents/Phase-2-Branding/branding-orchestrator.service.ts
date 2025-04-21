import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { BrandIdentitySectionService } from './brand-identity-section.service';
import { ColorPaletteSectionService } from './color-palette-section.service';
import { LogoGenerationService } from './logo-generation.service';
import { TypographySectionService } from './typography-section.service';
import { VisualExamplesSectionService } from './visual-examples-section.service';
import { VisualIdentitySynthesizerService } from './visual-identity-synthesizer.service';
import { BrandIdentityModel } from '../../../models/brand-identity.model';
import { ProjectModel } from '../../../models/project.model';
import { ProjectService } from '../../project.service';
import { GlobalCssService } from './golabl-css.service';

@Injectable({
  providedIn: 'root',
})
export class BrandingOrchestratorService extends AiGenericPromptService {
  constructor(
    private brandIdentitySectionService: BrandIdentitySectionService,
    private colorPaletteSectionService: ColorPaletteSectionService,
    private logoGenerationService: LogoGenerationService,
    private typographySectionService: TypographySectionService,
    private usageGuidelinesSectionService: TypographySectionService,
    private visualExemplesSectionService: VisualExamplesSectionService,
    private visualIdentitySynthesizerService: VisualIdentitySynthesizerService,
    private globalCssService: GlobalCssService,
    private projectService: ProjectService
  ) {
    super();
  }

  /**
   * Launches the full graphic branding generation pipeline
   * Each step depends on the previous step's summary to maintain coherence.
   */
  async generateFullBranding(
    project: ProjectModel
  ): Promise<
    | BrandIdentityModel
    | { error: string; step: string; partial: BrandIdentityModel }
  > {
    const result: BrandIdentityModel = {
      brandDefinition: project.analysisResultModel.branding.brandDefinition,
      toneOfVoice: project.analysisResultModel.branding.toneOfVoice,
      visualIdentityGuidelines:
        project.analysisResultModel.branding.visualIdentityGuidelines,
      typographySystem: project.analysisResultModel.branding.typographySystem,
      colorSystem: project.analysisResultModel.branding.colorSystem,
      iconographyAndImagery:
        project.analysisResultModel.branding.iconographyAndImagery,
      layoutAndComposition:
        project.analysisResultModel.branding.layoutAndComposition,
      summary: project.analysisResultModel.branding.summary,
      globalCss: project.analysisResultModel.branding.globalCss,
      logo: {
        content: {
          svg: '',
          concept: '',
          colors: [],
          fonts: [],
        },
        summary: '',
      },
    };

    let history = '';
    const literralProject =
      this.projectService.getProjectDescriptionForPrompt(project);

    try {
      // 1. Brand Identity
      if (this.shouldGenerate(result.brandDefinition)) {
        const brand = await this.brandIdentitySectionService.generateDatas(
          history,
          literralProject
        );
        result.brandDefinition = brand;
        history += brand.summary + '\n';
      }

      // 2. Color Palette
      if (this.shouldGenerate(result.colorSystem)) {
        const palette = await this.colorPaletteSectionService.generateDatas(
          history,
          literralProject
        );
        result.colorSystem = palette;
        history += palette.summary + '\n';
      }

      // 3. Logo Generation
      if (!result.logo.content?.svg) {
        const logo = await this.logoGenerationService.generateDatas(
          history,
          literralProject
        );
        result.logo.content = logo['content'];
        result.logo.summary = logo['summary'] || '';
        history += result.logo.summary + '\n';
      }

      // 4. Typography
      if (this.shouldGenerate(result.typographySystem)) {
        const typography = await this.typographySectionService.generateDatas(
          history,
          literralProject
        );
        result.typographySystem = typography;
        history += typography.summary + '\n';
      }

      // 5. Usage Guidelines
      if (this.shouldGenerate(result.visualIdentityGuidelines)) {
        const guidelines =
          await this.usageGuidelinesSectionService.generateDatas(
            history,
            literralProject
          );
        result.visualIdentityGuidelines = guidelines;
        history += guidelines.summary + '\n';
      }

      // 6. Visual Examples
      if (this.shouldGenerate(result.layoutAndComposition)) {
        const visuals = await this.visualExemplesSectionService.generateDatas(
          history,
          literralProject
        );
        result.layoutAndComposition = visuals;
        history += visuals.summary + '\n';
      }

      // 7. Global CSS
      if (this.shouldGenerate(result.globalCss)) {
        const globalCss = await this.globalCssService.generateDatas(
          history,
          literralProject
        );
        result.globalCss = globalCss;
        history += globalCss.summary + '\n';
      }

      // 8. Final Synthesis
      if (this.shouldGenerate(result.summary)) {
        const synthesis =
          await this.visualIdentitySynthesizerService.generateDatas(
            history,
            literralProject
          );
        result.summary = synthesis;
      }

      return result;
    } catch (error: any) {
      console.error('Branding generation failed at some step:', error);
      return {
        error: error?.message || 'Unknown error',
        step: this.extractStepFromError(error),
        partial: result,
      };
    }
  }

  // Vérifie si une section doit être générée
  private shouldGenerate(section: {
    content: string;
    summary: string;
  }): boolean {
    return section && section.content === '' && section.summary === '';
  }

  // Optionnel : pour indiquer l’étape ayant échoué (à adapter si tu veux plus précis)
  private extractStepFromError(error: any): string {
    return error?.step || 'unknown';
  }
}
