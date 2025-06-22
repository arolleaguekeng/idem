import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeploymentFormData } from '../../create-deployment';

@Component({
  selector: 'app-mode-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mode-selector.html',
  styleUrl: './mode-selector.css',
})
export class ModeSelector {
  readonly onModeSelect = output<DeploymentFormData['mode']>();

  protected selectMode(mode: DeploymentFormData['mode']): void {
    this.onModeSelect.emit(mode);
  }
}
