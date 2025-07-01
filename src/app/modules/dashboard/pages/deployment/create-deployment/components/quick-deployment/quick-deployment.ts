import { Component, output, signal } from '@angular/core';
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
  readonly deploymentForm = signal<FormGroup>(new FormGroup({}));
  readonly gitBranches = signal<string[]>([]);
  readonly loadingGitInfo = signal<boolean>(false);
  readonly isFormValid = signal<boolean>(false);

  protected fetchGitBranches(): void {}

  protected createDeployment(): void {}
}
