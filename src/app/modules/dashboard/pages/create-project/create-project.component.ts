import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectModel } from '../../models/project.model';
import { inject } from '@angular/core';
import { Checkbox } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import CreateProjectDatas, { DevelopmentPhase, SelectElement } from './datas';
import { ProjectService } from '../../services/project.service';
import { LoaderComponent } from '../../../../components/loader/loader.component';
import { Router } from '@angular/router';
import { initEmptyObject } from '../../../../utils/init-empty-object';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'app-create-project',
  imports: [
    FormsModule,
    Checkbox,
    CommonModule,
    MultiSelectModule,
    Select,
    FormsModule,
    InputTextModule,
    FloatLabel,

    LoaderComponent,
  ],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css',
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
  isLoaded = signal(false);
  showResults = false;
  selectedConstraints: SelectElement[] = [];

  isFirstStep = signal(true);
  isSecondStep = signal(false);
  isThirdStep = signal(false);

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
  @ViewChild('projectDescription') projectDescription!: ElementRef;
  @ViewChild('projectDetails') projectDetails!: ElementRef;
  @ViewChild('selectFeatures') selectFeatures!: ElementRef;

  scrollToSection(section: ElementRef) {
    if (section && section.nativeElement) {
      section.nativeElement.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        this.isLoaded.set(false);
      }, 800);
    }
  }

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
      this.projectService.createUserProject(this.project).then((projectId) => {
        this.router.navigate([`/project/editor/${projectId}`]);
      });
    } catch (e) {
      console.error('error', e);
      this.isLoaded.set(false);
    } finally {
      this.isLoaded.set(false);
    }
  }
  visible: boolean = false;
  analizeProject() {
    console.log('Project: ', this.project);
    this.visible = true;
    this.isLoaded.set(false);
    this.isThirdStep.set(true);

    this.scrollToSection(this.selectFeatures);
  }

  selectedPhases: string[] = [];

  togglePhase(phaseId: string, isChecked: boolean): void {
    this.selectedPhases = isChecked
      ? [...this.selectedPhases, phaseId]
      : this.selectedPhases.filter((id) => id !== phaseId);
  }

  gotToNextStep() {
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
