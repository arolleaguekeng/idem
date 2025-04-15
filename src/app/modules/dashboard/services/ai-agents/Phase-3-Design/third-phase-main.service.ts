import { Injectable } from '@angular/core';
import { DiagramModel } from '../../../models/diagram.model';
import { ProjectModel } from '../../../models/project.model';
import { ProjectService } from '../../project.service';
import { UMLModelingService } from './umlmodeling.service';

@Injectable({
  providedIn: 'root',
})
export class ThirdPhaseMainService {
  constructor(
    private projectService: ProjectService,
    private umlModelingService: UMLModelingService
  ) {}

  async executeThirdPhaseDiagrams(
    project: ProjectModel
  ): Promise<DiagramModel[] | { error: string; step: string }> {
    try {
      const diagramms: DiagramModel[] = [];
      const literralProject =
        this.projectService.getProjectDescriptionForPrompt(project);

      let classDiagramm;
      try {
        classDiagramm = await this.umlModelingService.generateClassDiagramm(
          '',
          literralProject
        );
        diagramms.push({
          name: 'class',
          description: classDiagramm.summary,
          code: classDiagramm.content,
        });

        console.log('Diagramm generation completed...');
      } catch (error) {
        console.error('Diagramm generation failed:', error);
        return { error: 'Diagramm generation failed', step: 'feasibility' };
      }
      console.table(diagramms);
      return diagramms;
    } catch (error) {
      console.error('Error during Phase 1 execution:', error);
      throw error;
    }
  }
}
