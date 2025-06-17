import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArchitectureTemplate } from '../../../../../models/deployment.model';

@Component({
  selector: 'app-template-deployment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './template-deployment.component.html',
  styleUrl: './template-deployment.component.css',
})
export class TemplateDeploymentComponent {
  readonly deploymentForm = input.required<FormGroup>();
  readonly availableTemplates = input<ArchitectureTemplate[]>([]);
  readonly selectedTemplate = input<ArchitectureTemplate | null>(null);
  readonly isFormValid = input<boolean>(false);

  readonly onSelectTemplate = output<ArchitectureTemplate>();
  readonly onCreateDeployment = output<void>();
  readonly onResetView = output<void>();
  readonly onBackToTemplates = output<void>();

  protected selectTemplate(template: ArchitectureTemplate): void {
    this.onSelectTemplate.emit(template);
  }

  protected createDeployment(): void {
    this.onCreateDeployment.emit();
  }

  protected resetView(): void {
    this.onResetView.emit();
  }

  protected backToTemplates(): void {
    this.onBackToTemplates.emit();
  }
}
