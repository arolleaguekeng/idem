import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectModel } from '../../models/project.model';
import { inject } from '@angular/core';
import { FirstPhaseMainService } from '../../services/ai-agents/Phase-1-Planning/first-phase-main.service';
import { Checkbox } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import CreateProjectDatas, { DevelopmentPhase, SelectElement } from './datas';
import { ProjectService } from '../../services/project.service';
import { LoaderComponent } from '../../../../components/loader/loader.component';
import { Router } from '@angular/router';
import { initEmptyObject } from '../../../../utils/init-empty-object';
import { AnalysisResultModel } from '../../models/analysisResult.model';

@Component({
  selector: 'app-create-project',
  imports: [
    FormsModule,
    Checkbox,
    CommonModule,
    MultiSelectModule,
    Select,
    LoaderComponent,
  ],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss',
})
export class CreateProjectComponent {
  onConstraintsChange() {
    this.project.constraints = this.selectedConstraints.map(
      (constraint: any) => constraint
    );
  }
  project: ProjectModel = initEmptyObject<ProjectModel>();

  projectService = inject(ProjectService);
  router = inject(Router);
  isLoaded = false;
  showResults = false;
  selectedConstraints: SelectElement[] = [];

  selectedTeamSize: SelectElement | undefined;
  selectedTarget: SelectElement | undefined;
  selectedScope: SelectElement | undefined;

  groupedTeamSizes: SelectElement[] = CreateProjectDatas.groupedTeamSizes;
  groupedProjectTypes: SelectElement[] = CreateProjectDatas.groupedProjectTypes;

  groupedTargets: SelectElement[] = CreateProjectDatas.groupedTargets;

  groupedScopes: SelectElement[] = CreateProjectDatas.groupedScopes;
  groupedBudgets: SelectElement[] = CreateProjectDatas.groupedBudgets;
  groupedConstraints = CreateProjectDatas.groupedConstraints;
  phases: DevelopmentPhase[] = CreateProjectDatas.phases;
  markdown = '';
  constructor() {}
  // analysisResult: AnalysisResultModel = {
  //   planning: {
  //     feasibilityStudy: { content: '', summary: '' },
  //     riskanalysis: { content: '', summary: '' },
  //     requirementsGathering: { content: '', summary: '' },
  //     smartObjectives: { content: '', summary: '' },
  //     stakeholdersMeeting: { content: '', summary: '' },
  //     useCaseModeling: { content: '', summary: '' },
  //   },
  //   architectures: [],
  //   design: [],
  //   development: '',
  //   branding: {
  //     brandDefinition: { content: '', summary: '' },
  //     toneOfVoice: { content: '', summary: '' },
  //     visualIdentityGuidelines: { content: '', summary: '' },
  //     typographySystem: { content: '', summary: '' },
  //     colorSystem: { content: '', summary: '' },
  //     iconographyAndImagery: { content: '', summary: '' },
  //     layoutAndComposition: { content: '', summary: '' },
  //     summary: { content: '', summary: '' },
  //     logo: {
  //       svg: '',
  //       summary: '',
  //       concept: '',
  //       colors: [],
  //       fonts: [],
  //     },
  //   },
  //   landing: '',
  //   testing: '',
  //   createdAt: new Date(Date.now()),
  // };
  ngOnInit(): void {
    console.log('project', this.project);
  }
  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';

    // Vérifie si la hauteur dépasse 400px
    const newHeight = Math.min(textarea.scrollHeight, 400);
    textarea.style.height = newHeight + 'px';
  }

  generateSelectedPhases() {
    try {
      this.project.selectedPhases = this.selectedPhases;
      // this.project.analysisResultModel = this.analysisResult;
      this.projectService.createUserProject(this.project).then((projectId) => {
        this.router.navigate([`/project/editor/${projectId}`]);
      });
    } catch (e) {
      console.error('error', e);
      this.isLoaded = false;
    } finally {
      this.isLoaded = false;
    }
  }
  visible: boolean = false;
  showDialog() {
    console.log('Project: ', this.project);
    this.visible = true;
    this.isLoaded = false;
    this.showResults = true;
  }

  generateScripts(architecture: string) {
    alert(`Scripts générés pour l'architecture ${architecture}`);
  }

  selectedPhases: string[] = [];

  togglePhase(phaseId: string, isChecked: boolean): void {
    this.selectedPhases = isChecked
      ? [...this.selectedPhases, phaseId]
      : this.selectedPhases.filter((id) => id !== phaseId);
  }

  onCheckboxChange(phaseId: string, event: any): void {
    if (event.checked) {
      if (!this.selectedPhases.includes(phaseId)) {
        this.selectedPhases = [...this.selectedPhases, phaseId];
      }
    } else {
      this.selectedPhases = this.selectedPhases.filter((id) => id !== phaseId);
    }
  }
}
