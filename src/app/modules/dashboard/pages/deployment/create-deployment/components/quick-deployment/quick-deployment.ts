import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-quick-deployment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './quick-deployment.html',
  styleUrl: './quick-deployment.css',
})
export class QuickDeployment {
  readonly deploymentForm = input.required<FormGroup>();
  readonly gitBranches = input<string[]>([]);
  readonly loadingGitInfo = input<boolean>(false);
  readonly isFormValid = input<boolean>(false);

  readonly onFetchGitBranches = output<void>();
  readonly onCreateDeployment = output<void>();
  readonly onResetView = output<void>();

  protected fetchGitBranches(): void {
    this.onFetchGitBranches.emit();
  }

  protected createDeployment(): void {
    this.onCreateDeployment.emit();
  }
}
