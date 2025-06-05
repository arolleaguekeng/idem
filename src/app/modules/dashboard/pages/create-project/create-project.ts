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
import { VisualIdentityData } from './data';

// Import new components
import { ProjectDescriptionComponent } from './components/project-description/project-description';
import { ProjectDetailsComponent } from './components/project-details/project-details';
import { LogoSelectionComponent } from './components/logo-selection/logo-selection';
import { ColorSelectionComponent } from './components/color-selection/color-selection';
import { TypographySelectionComponent } from './components/typography-selection/typography-selection';
import { ProjectSummaryComponent } from './components/project-summary/project-summary';
import { LogoModel } from '../../models/logo.model';
import { ColorModel, TypographyModel } from '../../models/brand-identity.model';

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

  // Step management
  protected readonly isLoaded = signal(false);
  protected readonly currentStepIndex = signal<number>(0);
  protected readonly selectedTabIndex = signal<number>(0);

  // Simplified step structure with all necessary information
  protected readonly steps = [
    { id: 'description', title: 'Project Description', active: signal(true) },
    { id: 'details', title: 'Project Details', active: signal(false) },
    { id: 'colors', title: 'Color Selection', active: signal(false) },
    { id: 'logo', title: 'Logo Selection', active: signal(false) },
    { id: 'typography', title: 'Typography', active: signal(false) },
    { id: 'summary', title: 'Summary', active: signal(false) },
  ];

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
  logos: LogoModel[] = VisualIdentityData.logos;
  protected colorModels: ColorModel[] = VisualIdentityData.colorPalettes;
  protected typographyModels: TypographyModel[] =
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
  private scrollToSection(section: ElementRef): void {
    // No longer blocking scroll
    setTimeout(() => {
      if (section) {
        section.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  }

  /**
   * Adds a transition direction class based on navigation direction
   * @param fromIndex Previous step index
   * @param toIndex New step index
   * @returns CSS class for the appropriate animation direction
   */
  protected getTransitionClass(fromIndex: number, toIndex: number): string {
    if (fromIndex < toIndex) {
      return 'animate-slideInRight';
    } else if (fromIndex > toIndex) {
      return 'animate-slideInLeft';
    }
    return 'animate-fadeIn';
  }

  ngOnInit(): void {
    console.log('project', this.project);
  }

  /**
   * Auto-resize textarea based on content
   * @param event Input event from textarea
   */
  protected autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';

    const newHeight = Math.min(textarea.scrollHeight, 400);
    textarea.style.height = newHeight + 'px';
  }

  /**
   * Gets the element reference for a step by index
   */
  protected getElementForStep(stepIndex: number): ElementRef {
    const step = this.steps[stepIndex];
    if (!step) return this.projectDescription;

    switch (step.id) {
      case 'description':
        return this.projectDescription;
      case 'details':
        return this.projectDetails;
      case 'colors':
        return this.colorSelection;
      case 'logo':
        return this.logoSelection;
      case 'typography':
        return this.typographySelection;
      case 'summary':
        return this.summarySelection;
      default:
        return this.projectDescription;
    }
  }

  /**
   * Navigates to a specific step with animation
   * @param index The index of the step to navigate to
   */
  protected navigateToStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      const previousIndex = this.currentStepIndex();

      // Skip if already at this step
      if (previousIndex === index) return;

      // Deactivate all steps
      this.steps.forEach((step) => step.active.set(false));

      // Activate the target step
      this.steps[index].active.set(true);
      this.currentStepIndex.set(index);

      // Scroll to the section with a slight delay for better animation
      setTimeout(() => {
        this.scrollToSection(this.getElementForStep(index).nativeElement);
      }, 50);

      // Track this navigation for analytics (optional)
      console.log(
        `Navigation from ${this.steps[previousIndex]?.id} to ${this.steps[index]?.id}`
      );
    }
  }

  /**
   * Handles navigation to the next step in the project creation flow
   */
  protected goToNextStep(): void {
    const nextIndex = this.currentStepIndex() + 1;
    if (nextIndex < this.steps.length) {
      this.navigateToStep(nextIndex);
    }
  }

  /**
   * Handles navigation to the previous step in the project creation flow
   */
  protected goToPreviousStep(): void {
    const prevIndex = this.currentStepIndex() - 1;
    if (prevIndex >= 0) {
      this.navigateToStep(prevIndex);
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
        (logo: LogoModel) => logo.id === this.selectedLogo
      );

      if (selectedLogoObj) {
        // Set logo data in the project model
        this.project.analysisResultModel.branding.logo = {
          content: {
            id: selectedLogoObj.id,
            name: selectedLogoObj.name,
            svg: selectedLogoObj.svg,
            concept: 'Auto-generated logo for ' + this.project.name,
            colors: [],
            fonts: [],
          },
          summary: 'Modern logo design for ' + this.project.name,
        };

        // Set colors in the project model if selected
        if (this.selectedColor) {
          const selectedColorObj = this.colorModels.find(
            (color: ColorModel) => color.id === this.selectedColor
          );
          if (selectedColorObj) {
            this.project.analysisResultModel.branding.colors = [
              {
                id: selectedColorObj.id,
                name: selectedColorObj.name,
                url: selectedColorObj.url,
                colors: selectedColorObj.colors,
              },
            ];
          }
        }

        // Set typography in the project model if selected
        if (this.selectedTypography) {
          const selectedTypoObj = this.typographyModels.find(
            (typo: TypographyModel) => typo.id === this.selectedTypography
          );
          if (selectedTypoObj) {
            this.project.analysisResultModel.branding.typography = [
              {
                id: selectedTypoObj.id,
                name: selectedTypoObj.name,
                url: selectedTypoObj.url,
                primaryFont: selectedTypoObj.primaryFont,
                secondaryFont: selectedTypoObj.secondaryFont,
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
  protected getSelectedLogo(): LogoModel | undefined {
    return this.logos.find((logo: LogoModel) => logo.id === this.selectedLogo);
  }

  protected getSelectedColor(): ColorModel | undefined {
    return this.colorModels.find(
      (color: ColorModel) => color.id === this.selectedColor
    );
  }

  protected getSelectedTypography(): TypographyModel | undefined {
    return this.typographyModels.find(
      (typo: TypographyModel) => typo.id === this.selectedTypography
    );
  }

  // Logo selection methods
  protected selectLogo(logoId: string) {
    this.selectedLogo = logoId;
    setTimeout(() => this.goToNextStep(), 300);
  }

  protected selectColor(colorId: string) {
    this.selectedColor = colorId;
    setTimeout(() => this.goToNextStep(), 300);
  }

  protected selectTypography(typographyId: string) {
    this.selectedTypography = typographyId;
    this.goToNextStep();
  }

  /**
   * Simplified helper for checking if a step is active by index
   */
  protected isStepActive(index: number): boolean {
    return this.steps[index]?.active() || false;
  }

  /**
   * Navigate to a specific step with loading animation
   * @param stepIndex The index of the step to navigate to
   * @param duration Optional transition duration (default: 400ms)
   */
  protected navigateWithLoading(stepIndex: number, duration = 400): void {
    // Show loading state
    this.isLoaded.set(true);

    // Apply a subtle transition effect
    const animationTiming = duration * 0.8;

    setTimeout(() => {
      this.navigateToStep(stepIndex);
      // Hide loading after animation completes
      setTimeout(() => {
        this.isLoaded.set(false);
      }, animationTiming);
    }, duration * 0.2);
  }
}
