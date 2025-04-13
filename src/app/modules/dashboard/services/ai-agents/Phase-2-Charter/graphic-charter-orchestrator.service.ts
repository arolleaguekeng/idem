import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { BrandIdentitySectionService } from './brand-identity-section.service';
import { ColorPaletteSectionService } from './color-palette-section.service';
import { LogoGenerationService } from './logo-generation.service';
import { TypographySectionService } from './typography-section.service';
import { VisualExamplesSectionService } from './visual-examples-section.service';
import { VisualIdentitySynthesizerService } from './visual-identity-synthesizer.service';

@Injectable({
  providedIn: 'root',
})
export class GraphicCharterOrchestratorService extends AiGenericPromptService {
  constructor(
    private brandIdentitySectionService: BrandIdentitySectionService,
    private colorPaletteSectionService: ColorPaletteSectionService,
    private logoGenerationService: LogoGenerationService,
    private typographySectionService: TypographySectionService,
    private usageGuidelinesSectionService: TypographySectionService,
    private visualExemplesSectionService: VisualExamplesSectionService,
    private visualIdentitySynthesizerService: VisualIdentitySynthesizerService
  ) {
    super();
  }
}
