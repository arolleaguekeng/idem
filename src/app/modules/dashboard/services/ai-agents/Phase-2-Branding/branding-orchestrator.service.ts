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
import { LogoModel } from '../../../models/logo.model';
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
  async generateFullBranding(project: ProjectModel): Promise<any> {
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
    const literralProject =
      this.projectService.getProjectDescriptionForPrompt(project);

    // Step 1: Brand Identity
    const brand = await this.brandIdentitySectionService.generateDatas(
      history,
      literralProject
    );
    result.brandDefinition = brand;
    history += result.brandDefinition.summary + '\n';

    // Step 2: Color Palette
    const palette = await this.colorPaletteSectionService.generateDatas(
      history,
      literralProject
    );
    result.colorSystem = palette;
    history += result.colorSystem.summary + '\n';

    // Step 3: Logo Generation
    const logo = await this.logoGenerationService.generateDatas(
      history,
      literralProject
    );
    console.log('Logo', logo['content']);
    result.logo.content = logo['content'];
    history += result.logo.summary + '\n';

    // Step 4: Typography
    const typography = await this.typographySectionService.generateDatas(
      history,
      literralProject
    );
    result.typographySystem = typography;
    history += result.typographySystem.summary + '\n';

    // Step 5: Usage Guidelines (you said it's in TypographyService too, double-check)
    const guidelines = await this.usageGuidelinesSectionService.generateDatas(
      history,
      literralProject
    );
    result.visualIdentityGuidelines = guidelines;
    history += result.visualIdentityGuidelines.summary + '\n';

    // Step 6: Visual Examples
    const visuals = await this.visualExemplesSectionService.generateDatas(
      history,
      literralProject
    );
    result.layoutAndComposition = visuals;
    history += result.layoutAndComposition.summary + '\n';

    // Step 8: Global CSS
    const globalCss = await this.globalCssService.generateDatas(
      history,
      literralProject
    );

    result.globalCss = globalCss;
    history += result.globalCss.summary + '\n';

    // Step 7: Final Synthesized Visual Identity
    const synthesis = await this.visualIdentitySynthesizerService.generateDatas(
      history,
      literralProject
    );

    result.summary = synthesis;

    return result;
  }
}
