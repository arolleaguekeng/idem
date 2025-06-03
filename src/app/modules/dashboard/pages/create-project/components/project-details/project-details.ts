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
  protected readonly project = input<ProjectModel>();
  protected readonly groupedProjectTypes = input<SelectElement[]>();
  protected readonly groupedTeamSizes = input<SelectElement[]>();
  protected readonly groupedScopes = input<SelectElement[]>();
  protected readonly groupedBudgets = input<SelectElement[]>();
  protected readonly groupedTargets = input<SelectElement[]>();
  protected readonly groupedConstraints = input<any[]>();
  protected readonly selectedConstraints = input<SelectElement[]>();

  protected readonly nextStep = output<void>();
  protected readonly previousStep = output<void>();
  protected readonly constraintsChange = output<void>();

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
