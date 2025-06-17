import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CloudComponentDetailed,
  ArchitectureComponent,
} from '../../../../../models/deployment.model';

@Component({
  selector: 'app-expert-deployment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './expert-deployment.component.html',
  styleUrl: './expert-deployment.component.css',
})
export class ExpertDeploymentComponent {
  readonly deploymentForm = input.required<FormGroup>();
  readonly expertForm = input.required<FormGroup>();
  readonly expertSelectedProvider = input<'aws' | 'gcp' | 'azure'>('aws');
  readonly expertSearchTerm = input<string>('');
  readonly expertArchitecture = input<ArchitectureComponent[]>([]);
  readonly activeExpertComponent = input<ArchitectureComponent | null>(null);
  readonly filteredCatalogue = input<{
    [cat: string]: CloudComponentDetailed[];
  }>({});
  readonly isFormValid = input<boolean>(false);

  readonly onProviderChange = output<'aws' | 'gcp' | 'azure'>();
  readonly onSearchTermChange = output<string>();
  readonly onAddComponent = output<string>();
  readonly onRemoveComponent = output<string>();
  readonly onSelectComponent = output<ArchitectureComponent>();
  readonly onCreateDeployment = output<void>();
  readonly onResetView = output<void>();

  // Utility method for template
  objectKeys = Object.keys;

  protected changeProvider(provider: 'aws' | 'gcp' | 'azure'): void {
    this.onProviderChange.emit(provider);
  }

  protected updateSearchTerm(term: string): void {
    this.onSearchTermChange.emit(term);
  }

  protected addComponentToArchitecture(componentId: string): void {
    this.onAddComponent.emit(componentId);
  }

  protected removeComponentFromArchitecture(instanceId: string): void {
    this.onRemoveComponent.emit(instanceId);
  }

  protected selectComponentForConfiguration(
    component: ArchitectureComponent
  ): void {
    this.onSelectComponent.emit(component);
  }

  protected createDeployment(): void {
    this.onCreateDeployment.emit();
  }

  protected resetView(): void {
    this.onResetView.emit();
  }
}
