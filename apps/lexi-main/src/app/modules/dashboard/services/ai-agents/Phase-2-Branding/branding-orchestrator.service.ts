import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { BrandIdentitySectionService } from './brand-identity-section.service';
import { ColorPaletteSectionService } from './color-palette-section.service';
import { LogoGenerationService } from './logo-generation.service';
import { TypographySectionService } from './typography-section.service';
import { VisualExamplesSectionService } from './visual-examples-section.service';
import { VisualIdentitySynthesizerService } from './visual-identity-synthesizer.service';
import { GlobalCssService } from './golabl-css.service';
import { ProjectModel } from '../../../models/project.model';
import { BrandIdentityModel } from '../../../models/brand-identity.model';
import { ProjectService } from '../../project.service';

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
    private visualExamplesSectionService: VisualExamplesSectionService,
    private visualIdentitySynthesizerService: VisualIdentitySynthesizerService,
    private globalCssService: GlobalCssService,
    private projectService: ProjectService
  ) {
    super();
  }

  async generateFullBranding(
    project: ProjectModel
  ): Promise<BrandIdentityModel | { error: string; step: string; partial: BrandIdentityModel }> {
    const result: BrandIdentityModel = {
      brandDefinition: { content: '', summary: '' },
      toneOfVoice: { content: '', summary: '' },
      visualIdentityGuidelines: { content: '', summary: '' },
      typographySystem: { content: '', summary: '' },
      colorSystem: { content: '', summary: '' },
      iconographyAndImagery: { content: '', summary: '' },
      layoutAndComposition: { content: '', summary: '' },
      summary: { content: '', summary: '' },
      globalCss: { content: '', summary: '' },
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
    const literralProject = this.projectService.getProjectDescriptionForPrompt(project);
  
    try {
      result.brandDefinition = await this.generateStep(
        project.analysisResultModel.branding.brandDefinition,
        (history) => this.brandIdentitySectionService.generateDatas(history, literralProject),
        'Brand Identity',
      );
      history += result.brandDefinition.summary + '\n';
  
      result.colorSystem = await this.generateStep(
        project.analysisResultModel.branding.colorSystem,
        (history) => this.colorPaletteSectionService.generateDatas(history, literralProject),
        'Color Palette',
      );
      history += result.colorSystem.summary + '\n';
  
      // Traitement spécial pour le logo
      if (!project.analysisResultModel.branding.logo?.content?.svg) {
        const logo = await this.logoGenerationService.generateDatas(history, literralProject);
        result.logo.content = logo.content;
        result.logo.summary = logo.summary || '';
        history += result.logo.summary + '\n';
      } else {
        result.logo = project.analysisResultModel.branding.logo;
      }
  
      result.typographySystem = await this.generateStep(
        project.analysisResultModel.branding.typographySystem,
        (history) => this.typographySectionService.generateDatas(history, literralProject),
        'Typography',
      );
      history += result.typographySystem.summary + '\n';
  
      result.visualIdentityGuidelines = await this.generateStep(
        project.analysisResultModel.branding.visualIdentityGuidelines,
        (history) => this.usageGuidelinesSectionService.generateDatas(history, literralProject),
        'Usage Guidelines',
      );
      history += result.visualIdentityGuidelines.summary + '\n';
  
      result.layoutAndComposition = await this.generateStep(
        project.analysisResultModel.branding.layoutAndComposition,
        (history) => this.visualExamplesSectionService.generateDatas(history, literralProject),
        'Visual Examples',
      );
      history += result.layoutAndComposition.summary + '\n';
  
      result.globalCss = await this.generateStep(
        project.analysisResultModel.branding.globalCss,
        (history) => this.globalCssService.generateDatas(history, literralProject),
        'Global CSS',
      );
      history += result.globalCss.summary + '\n';
  
      result.summary = await this.generateStep(
        project.analysisResultModel.branding.summary,
        (history) => this.visualIdentitySynthesizerService.generateDatas(history, literralProject),
        'Final Synthesis',
      );
  
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

  private extractStepFromError(error: any): string {
    if (error?.step) {
      return error.step;
    }
    if (typeof error?.message === 'string') {
      // Essayons de deviner à partir du message d'erreur
      const match = error.message.match(/Generating (.*?) failed/);
      if (match && match[1]) {
        return match[1];
      }
    }
    return 'Unknown step';
  }
  
  

  private async generateStep(
    existingData: { content: string; summary: string } | undefined,
    generationFn: (history: string) => Promise<{ content: string; summary: string }>,
    stepName: string
  ): Promise<{ content: string; summary: string }> {
    if (!existingData) {
      console.log(`Generating ${stepName}...`);
    } else {
      console.log(`${stepName} already exists, checking for updates...`);
    }
    const isEmpty =
      existingData == null ||
      existingData == undefined ||
      existingData.content === '' ||
      existingData.summary === '';
    if (!isEmpty) return existingData;
  
    try {
      const result = await generationFn('');
      console.log(`${stepName} completed`, result);
      return result;
    } catch (error) {
      console.error(`${stepName} failed`, error);
      return { content: '', summary: '' };
    }
  }

}
