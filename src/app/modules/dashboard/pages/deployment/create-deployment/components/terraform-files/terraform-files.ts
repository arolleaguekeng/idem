import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeploymentModel } from '../../../../../models/deployment.model';
import { TerraformViewer } from '../../../../../../../shared/components/terraform-viewer/terraform-viewer';

@Component({
  selector: 'app-terraform-files',
  standalone: true,
  imports: [CommonModule, TerraformViewer],
  templateUrl: './terraform-files.html',
})
export class TerraformFiles implements OnInit {
  // Angular-specific properties
  @Input({ required: true }) deployment: DeploymentModel | null = null;

  // Component state using signals
  protected readonly hasFiles = signal<boolean>(false);
  protected readonly mainFile = signal<string>('');
  protected readonly variablesFile = signal<string>('');
  protected readonly variablesMapFile = signal<string>('');

  // Computed property for visibility
  protected readonly showComponent = computed(() => this.hasFiles());

  ngOnInit(): void {
    this.checkForTerraformFiles();
  }

  /**
   * Check if the deployment has Terraform files and populate signals
   */
  protected checkForTerraformFiles(): void {
    if (!this.deployment || !this.deployment.generatedTerraformFiles) {
      this.hasFiles.set(false);
      return;
    }

    const { main, variables, variablesMap } =
      this.deployment.generatedTerraformFiles;

    // Check if at least one file exists
    if (main || variables || variablesMap) {
      this.hasFiles.set(true);
      this.mainFile.set(main || '');
      this.variablesFile.set(variables || '');
      this.variablesMapFile.set(variablesMap || '');
    }
  }
}
