import { Injectable } from '@angular/core';
import { AiGenericPromptService } from '../ai-generic-prompt.service';
import { ProjectModel } from '../../../models/project.model';
import { DiagramModel } from '../../../models/diagram.model';
import { ProjectService } from '../../project.service';
import { ArchitectureDiagramService } from './architecture-diagram.service';
import { ClassDiagramService } from './class-diagram.service';
import { ErDiagramService } from './er-diagram.service';
import { SequenceDiagramService } from './sequence-diagram.service';
import { UsecaseDiagramService } from './use-case-diagram.service';

@Injectable({ providedIn: 'root' })
export class ThirdPhaseMainService extends AiGenericPromptService {
  constructor(
    private useCaseDiagramService: UsecaseDiagramService,
    private classDiagramService: ClassDiagramService,
    private erDiagramService: ErDiagramService,
    private sequenceDiagramService: SequenceDiagramService,
    private architectureDiagramService: ArchitectureDiagramService,
    private projectService: ProjectService
  ) {
    super();
  }

  async generateFullDiagrams(
    project: ProjectModel
  ): Promise<
    DiagramModel | { error: string; step: string; partial: DiagramModel }
  > {
    const result: DiagramModel = this.initializeEmptyDiagramModel();
    const literralProject =
      this.projectService.getProjectDescriptionForPrompt(project);
    let history = '';

    try {
      result.useCaseDiagram = await this.generateDiagramStep(
        project.analysisResultModel.design?.useCaseDiagram,
        (history) =>
          this.useCaseDiagramService.generateDatas(history, literralProject),
        'Use Case Diagram',
        history,
        'flowchart'
      );
      history += result.useCaseDiagram.summary + '\n';

      result.classDiagram = await this.generateDiagramStep(
        project.analysisResultModel.design?.classDiagram,
        (history) =>
          this.classDiagramService.generateDatas(history, literralProject),
        'Class Diagram',
        history,
        'classDiagram'
      );
      history += result.classDiagram.summary + '\n';

      result.erDiagram = await this.generateDiagramStep(
        project.analysisResultModel.design?.erDiagram,
        (history) =>
          this.erDiagramService.generateDatas(history, literralProject),
        'ER Diagram',
        history,
        'erDiagram'
      );
      history += result.erDiagram.summary + '\n';

      result.sequenceDiagram = await this.generateDiagramStep(
        project.analysisResultModel.design?.sequenceDiagram,
        (history) =>
          this.sequenceDiagramService.generateDatas(history, literralProject),
        'Sequence Diagram',
        history,
        'sequenceDiagram'
      );
      history += result.sequenceDiagram.summary + '\n';

      result.architectureDiagram = await this.generateDiagramStep(
        project.analysisResultModel.design?.architectureDiagram,
        (history) =>
          this.architectureDiagramService.generateDatas(
            history,
            literralProject
          ),
        'Architecture Diagram',
        history,
        'architectureDiagram'
      );

      return result;
    } catch (error: any) {
      console.error('Diagram generation failed:', error);
      return {
        error: error?.message || 'Unknown error',
        step: this.extractStepFromError(error),
        partial: result,
      };
    }
  }

  private initializeEmptyDiagramModel(): DiagramModel {
    return {
      useCaseDiagram: { summary: '', content: '' },
      classDiagram: { summary: '', content: '' },
      erDiagram: { summary: '', content: '' },
      sequenceDiagram: { summary: '', content: '' },
      architectureDiagram: { summary: '', content: '' },
    };
  }

  private async generateDiagramStep(
    existingData: { summary: string; content: string } | undefined,
    generationFn: (
      history: string
    ) => Promise<{ summary: string; content: string }>,
    stepName: string,
    currentHistory: string,
    diagramType: string
  ): Promise<{ summary: string; content: string }> {
    if (!existingData) {
      console.log(`Generating ${stepName}...`);
    } else {
      console.log(`${stepName} already exists, checking for updates...`);
    }

    const isEmpty =
      !existingData || !existingData.summary || !existingData.content;
    if (!isEmpty) {
      return {
        summary: existingData.summary,
        content: this.formatAsMermaid(existingData.content, diagramType),
      };
    }

    try {
      const result = await generationFn(currentHistory);
      console.log(`${stepName} generation completed`);
      return {
        summary: result.summary,
        content: this.formatAsMermaid(result.content, diagramType),
      };
    } catch (error) {
      console.error(`${stepName} generation failed`, error);
      return { summary: '', content: '' };
    }
  }

  private formatAsMermaid(content: string, diagramType: string): string {
    if (!content) return '';
    const cleanedContent = content.replace(/```(mermaid)?/g, '').trim();
    return `\`\`\`mermaid\n\n%% ${diagramType}\n${cleanedContent}\n\n\`\`\``;
  }

  private extractStepFromError(error: any): string {
    if (error?.step) return error.step;
    if (typeof error?.message === 'string') {
      const match = error.message.match(/Generating (.*?) failed/);
      if (match?.[1]) return match[1];
    }
    return 'Unknown step';
  }
}
