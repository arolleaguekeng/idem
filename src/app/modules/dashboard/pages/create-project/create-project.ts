import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectModel } from '../../models/project.model';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Loader } from '../../../../components/loader/loader';
import { initEmptyObject } from '../../../../utils/init-empty-object';
import CreateProjectDatas, { DevelopmentPhase, SelectElement } from './datas';
import {
  LogoOption,
  ColorPalette,
  TypographyOption,
  VisualIdentityData,
} from './data';

// Import new components
import { ProjectDescriptionComponent } from './components/project-description/project-description';
import { ProjectDetailsComponent } from './components/project-details/project-details';
import { LogoSelectionComponent } from './components/logo-selection/logo-selection';
import { ColorSelectionComponent } from './components/color-selection/color-selection';
import { TypographySelectionComponent } from './components/typography-selection/typography-selection';
import { ProjectSummaryComponent } from './components/project-summary/project-summary';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    CommonModule,
    Loader,
    ProjectDescriptionComponent,
    ProjectDetailsComponent,
    LogoSelectionComponent,
    ColorSelectionComponent,
    TypographySelectionComponent,
    ProjectSummaryComponent,
  ],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css',
})
export class CreateProjectComponent implements OnInit {
  // Angular injected services
  protected readonly projectService = inject(ProjectService);
  protected readonly router = inject(Router);

  // Angular template signal states
  protected readonly isLoaded = signal(false);
  protected readonly isFirstStep = signal(true);
  protected readonly isSecondStep = signal(false);
  protected readonly isLogoStep = signal(false);
  protected readonly isColorStep = signal(false);
  protected readonly isTypographyStep = signal(false);
  protected readonly isSummaryStep = signal(false);

  // ViewChild references
  @ViewChild('projectDescription') readonly projectDescription!: ElementRef;
  @ViewChild('projectDetails') readonly projectDetails!: ElementRef;
  @ViewChild('logoSelection') readonly logoSelection!: ElementRef;
  @ViewChild('colorSelection') readonly colorSelection!: ElementRef;
  @ViewChild('typographySelection') readonly typographySelection!: ElementRef;
  @ViewChild('summarySelection') readonly summarySelection!: ElementRef;

  // Project model
  protected project: ProjectModel = initEmptyObject<ProjectModel>();

  // Store selected visual identity items separately
  protected selectedLogoId = '';
  protected selectedColorId = '';
  protected selectedTypographyId = '';
  protected selectedTeamSize: SelectElement | undefined;
  protected selectedTarget: SelectElement | undefined;
  protected selectedScope: SelectElement | undefined;
  protected selectedBudget: SelectElement | undefined;
  protected selectedConstraints = signal<SelectElement[]>([]);
  protected visible = signal<boolean>(false);
  protected privacyPolicyAccepted = signal<boolean>(false);
  protected marketingConsentAccepted = signal<boolean>(false);

  // Visual identity selections
  logos: LogoOption[] = VisualIdentityData.logos;
  protected colorPalettes: ColorPalette[] = VisualIdentityData.colorPalettes;
  protected typographyOptions: TypographyOption[] =
    VisualIdentityData.typographyOptions;
  protected selectedLogo = '';
  protected selectedColor = '';
  protected selectedTypography = '';

  // Form options
  protected groupedTeamSizes: SelectElement[] =
    CreateProjectDatas.groupedTeamSizes;
  protected groupedProjectTypes: SelectElement[] =
    CreateProjectDatas.groupedProjectTypes;
  protected groupedTargets: SelectElement[] = CreateProjectDatas.groupedTargets;
  protected groupedScopes: SelectElement[] = CreateProjectDatas.groupedScopes;
  protected groupedBudgets: SelectElement[] = CreateProjectDatas.groupedBudgets;
  protected groupedConstraints = CreateProjectDatas.groupedConstraints;
  protected phases: DevelopmentPhase[] = CreateProjectDatas.phases;
  protected markdown = '';

  constructor() {}

  /**
   * Scrolls to the specified section element with a smooth animation
   * @param section ElementRef to scroll to
   */
  protected scrollToSection(section: ElementRef): void {
    if (section && section.nativeElement) {
      section.nativeElement.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        this.isLoaded.set(false);
      }, 800);
    }
  }

  protected allowScroll(): void {
    document.body.style.overflow = '';
  }
  ngOnInit(): void {
    console.log('project', this.project);
    document.body.style.overflow = 'hidden';
  }
  protected autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';

    const newHeight = Math.min(textarea.scrollHeight, 400);
    textarea.style.height = newHeight + 'px';
  }

  /**
   * Handles navigation to the next step in the project creation flow
   * Updates relevant signals and scrolls to the appropriate section
   */
  protected goToNextStep(): void {
    if (this.isFirstStep()) {
      this.isFirstStep.set(false);
      this.isSecondStep.set(true);
      this.scrollToSection(this.projectDetails.nativeElement);
    } else if (this.isSecondStep()) {
      this.isSecondStep.set(false);
      this.isLogoStep.set(true);
      this.scrollToSection(this.logoSelection.nativeElement);
    } else if (this.isLogoStep()) {
      this.isLogoStep.set(false);
      this.isColorStep.set(true);
      this.scrollToSection(this.colorSelection.nativeElement);
    } else if (this.isColorStep()) {
      this.isColorStep.set(false);
      this.isTypographyStep.set(true);
      this.scrollToSection(this.typographySelection.nativeElement);
    } else if (this.isTypographyStep()) {
      this.isTypographyStep.set(false);
      this.isSummaryStep.set(true);
      this.scrollToSection(this.summarySelection.nativeElement);
    }
  }

  /**
   * Handles navigation to the previous step in the project creation flow
   * Updates relevant signals and scrolls to the appropriate section
   */
  protected goToPreviousStep(): void {
    if (this.isSecondStep()) {
      this.isSecondStep.set(false);
      this.isFirstStep.set(true);
      this.scrollToSection(this.projectDescription.nativeElement);
    } else if (this.isLogoStep()) {
      this.isLogoStep.set(false);
      this.isSecondStep.set(true);
      this.scrollToSection(this.projectDetails.nativeElement);
    } else if (this.isColorStep()) {
      this.isColorStep.set(false);
      this.isLogoStep.set(true);
      this.scrollToSection(this.logoSelection.nativeElement);
    } else if (this.isTypographyStep()) {
      this.isTypographyStep.set(false);
      this.isColorStep.set(true);
      this.scrollToSection(this.colorSelection.nativeElement);
    } else if (this.isSummaryStep()) {
      this.isSummaryStep.set(false);
      this.isTypographyStep.set(true);
      this.scrollToSection(this.typographySelection.nativeElement);
    }
  }

  /**
   * Handles privacy policy acceptance changes from the summary component
   */
  protected handlePrivacyPolicyChange(accepted: boolean): void {
    this.privacyPolicyAccepted.set(accepted);
  }

  /**
   * Handles marketing consent changes from the summary component
   */
  protected handleMarketingConsentChange(accepted: boolean): void {
    this.marketingConsentAccepted.set(accepted);
  }

  // Method to create project with selected visual identity
  protected finalizeProjectCreation() {
    try {
      this.isLoaded.set(true);

      // Find the selected logo
      const selectedLogoObj = this.logos.find(
        (logo: LogoOption) => logo.id === this.selectedLogo
      );

      if (selectedLogoObj) {
        // Set logo data in the project model
        this.project.analysisResultModel.branding.logo = {
          content: {
            svg: selectedLogoObj.svg,
            concept: 'Auto-generated logo for ' + this.project.name,
            colors: [],
            fonts: [],
          },
          summary: 'Modern logo design for ' + this.project.name,
        };

        // Set colors in the project model if selected
        if (this.selectedColor) {
          const selectedColorObj = this.colorPalettes.find(
            (color: ColorPalette) => color.id === this.selectedColor
          );
          if (selectedColorObj) {
            this.project.analysisResultModel.branding.colors = [
              {
                id: selectedColorObj.id,
                name: selectedColorObj.name,
                exaDecimal: selectedColorObj.colors.primary,
              },
            ];
          }
        }

        // Set typography in the project model if selected
        if (this.selectedTypography) {
          const selectedTypoObj = this.typographyOptions.find(
            (typo: TypographyOption) => typo.id === this.selectedTypography
          );
          if (selectedTypoObj) {
            this.project.analysisResultModel.branding.typography = [
              {
                fonts: [
                  { id: selectedTypoObj.id, name: selectedTypoObj.primaryFont },
                ],
              },
            ];
          }
        }
      }

      // Create the project with all selected data
      this.projectService.createProject(this.project).subscribe({
        next: (createdProject: ProjectModel) => {
          if (createdProject && createdProject.id) {
            // Navigate to the planning page with the new project id
            this.router.navigate([`/console/planing/${createdProject.id}`]);
          } else {
            console.error(
              'Project creation successful but ID is missing in the response.'
            );
          }
        },
        error: (err) => {
          console.error('Error creating project:', err);
          this.isLoaded.set(false);
        },
      });
    } catch (e) {
      console.error('Error finalizing project:', e);
      this.isLoaded.set(false);
    }
  }

  protected goToThirdStep() {
    console.log('Project: ', this.project);
    this.visible.set(true);
    this.isLoaded.set(false);
  }

  /**
   * Handles constraint selection changes from the project details component
   * Updates the project model with selected constraints
   */
  protected onConstraintsChange(): void {
    const constraints = this.selectedConstraints();
    if (constraints && constraints.length > 0) {
      // Make sure to convert SelectElement[] to string[] if needed
      this.project.constraints = constraints.map(
        (item: SelectElement | string) =>
          typeof item === 'string' ? item : String(item)
      );
    } else {
      this.project.constraints = [];
    }
    // Log for debugging purposes
    console.log('Constraints updated:', this.selectedConstraints());
  }

  // Helper methods for template
  protected getSelectedLogo(): LogoOption | undefined {
    return this.logos.find((logo: LogoOption) => logo.id === this.selectedLogo);
  }

  protected getSelectedColor(): ColorPalette | undefined {
    return this.colorPalettes.find(
      (color: ColorPalette) => color.id === this.selectedColor
    );
  }

  protected getSelectedTypography(): TypographyOption | undefined {
    return this.typographyOptions.find(
      (typo: TypographyOption) => typo.id === this.selectedTypography
    );
  }

  // Logo selection methods
  protected selectLogo(logoId: string) {
    this.selectedLogo = logoId;
    setTimeout(() => {
      this.showColorSelectionStep();
    }, 500);
  }

  // Color selection methods
  protected selectColor(colorId: string) {
    this.selectedColor = colorId;
    setTimeout(() => {
      this.showTypographySelectionStep();
    }, 500);
  }

  // Typography selection methods
  protected selectTypography(typographyId: string) {
    this.selectedTypography = typographyId;
    this.showSummaryStep();
  }

  // Visual identity step navigation
  protected showLogoSelectionStep() {
    this.isLogoStep.set(true);
    this.isColorStep.set(false);
    this.isTypographyStep.set(false);

    setTimeout(() => {
      this.scrollToSection(this.logoSelection);
      this.isLoaded.set(false);
    }, 500);
  }

  protected showColorSelectionStep() {
    this.isLogoStep.set(false);
    this.isColorStep.set(true);
    this.isTypographyStep.set(false);

    setTimeout(() => {
      this.scrollToSection(this.colorSelection);
      this.isLoaded.set(false);
    }, 500);
  }

  protected showTypographySelectionStep() {
    this.isLogoStep.set(false);
    this.isColorStep.set(false);
    this.isTypographyStep.set(true);

    setTimeout(() => {
      this.scrollToSection(this.typographySelection);
      this.isLoaded.set(false);
    }, 500);
  }

  protected showSummaryStep() {
    this.isLogoStep.set(false);
    this.isColorStep.set(false);
    this.isFirstStep.set(false);
    this.isSecondStep.set(false);
    this.isTypographyStep.set(false);
    this.isSummaryStep.set(true);
    this.isLoaded.set(true);

    setTimeout(() => {
      this.scrollToSection(this.summarySelection);
      this.isLoaded.set(false);
      document.body.style.overflow = '';
    }, 500);
  }

  protected goToSecondStep() {
    this.isFirstStep.set(false);
    this.isSecondStep.set(true);
    this.isLoaded.set(true);

    setTimeout(() => {
      this.isLoaded.set(false);
    }, 500);

    setTimeout(() => {
      this.scrollToSection(this.projectDetails);
    }, 500);

    this.isFirstStep.set(true);
  }

  protected goToFirstStep() {
    this.isFirstStep.set(true);
    this.isSecondStep.set(false);
    this.isLoaded.set(true);

    setTimeout(() => {
      this.isLoaded.set(false);
    }, 500);

    setTimeout(() => {
      this.scrollToSection(this.projectDescription);
    }, 500);
  }
}
