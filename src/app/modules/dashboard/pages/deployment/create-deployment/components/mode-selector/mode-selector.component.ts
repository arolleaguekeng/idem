import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeploymentFormData } from '../../../../../models/deployment.model';

@Component({
  selector: 'app-mode-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mode-selector.component.html',
  styleUrl: './mode-selector.component.css'
})
export class ModeSelectorComponent {
  readonly onModeSelect = output<DeploymentFormData['mode']>();

  protected selectMode(mode: DeploymentFormData['mode']): void {
    this.onModeSelect.emit(mode);
  }
}
