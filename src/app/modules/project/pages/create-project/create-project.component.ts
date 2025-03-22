import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../landing/components/header/header.component";  // <<<< import it here

@Component({
  selector: 'app-create-project',
  imports: [FormsModule, HeaderComponent],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss',
})
export class CreateProjectComponent {
  projectName: string = '';
  projectDescription: string = '';
  projectType: string = 'web';
  scalability: boolean = false;
  security: boolean = false;
  budget: boolean = false;
  showResults: boolean = false;

  // Fonction pour analyser le projet
  analyzeProject() {
    // Simuler une analyse (à remplacer par une logique réelle)
    this.showResults = true;
  }

  // Fonction pour générer les scripts
  generateScripts(architecture: string) {
    alert(`Scripts générés pour l'architecture ${architecture}`);
  }
}
