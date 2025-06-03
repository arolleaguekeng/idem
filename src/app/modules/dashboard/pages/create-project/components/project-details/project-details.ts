import {
  Component,
  EventEmitter,
  input,
  Input,
  output,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProjectModel } from '../../../../models/project.model';
import { SelectElement } from '../../datas';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    InputTextModule,
    FloatLabel,
    Select,
    MultiSelectModule,
  ],
  templateUrl: './project-details.html',
  styleUrl: './project-details.css',
})
export class ProjectDetailsComponent {
  // Angular inputs/outputs
  readonly project = input<ProjectModel>();
  readonly groupedProjectTypes = input.required<SelectElement[]>();
  readonly groupedTeamSizes = input.required<SelectElement[]>();
  readonly groupedScopes = input.required<SelectElement[]>();
  readonly groupedBudgets = input.required<SelectElement[]>();
  readonly groupedTargets = input.required<SelectElement[]>();
  readonly groupedConstraints = input.required<any[]>();
  readonly selectedConstraints = input.required<SelectElement[]>();

  readonly nextStep = output<void>();
  readonly previousStep = output<void>();
  readonly constraintsChange = output<void>();

  protected goToNextStep(): void {
    this.nextStep.emit();
  }

  protected goToPreviousStep(): void {
    this.previousStep.emit();
  }

  protected onConstraintsChange(): void {
    this.constraintsChange.emit();
  }
}
