import { Component, EventEmitter, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectModel } from '../../../../models/project.model';

@Component({
  selector: 'app-project-description',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './project-description.html',
  styleUrl: './project-description.css',
})
export class ProjectDescriptionComponent {
  protected readonly project = input<ProjectModel>();
  protected readonly nextStep = output<void>();

  protected autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';

    const newHeight = Math.min(textarea.scrollHeight, 400);
    textarea.style.height = newHeight + 'px';
  }

  protected goToNextStep(): void {
    this.nextStep.emit();
  }
}
