import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { ProjectModel } from '../../models/project.model';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { FirstPhaseMainService } from '../../services/ai-agents/Phase-1-Planning/first-phase-main.service';
import { AnalysisResultModel } from '../../models/analysisResult.model';
import { LoaderComponent } from '../../../../components/loader/loader.component';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-project-editor',
  imports: [TabsModule, FormsModule, LoaderComponent, MarkdownComponent],
  templateUrl: './project-editor.component.html',
  styleUrl: './project-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectEditorComponent {
  id = '';
  project!: ProjectModel;
  route = inject(ActivatedRoute);
  firstPhaseService = inject(FirstPhaseMainService);
  isLoaded = true;
  projectService = inject(ProjectService);
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.projectService.getUserProjectById(this.id).then((currentProject) => {
      console.log('project', currentProject);
      if (currentProject) {
        console.log('project', currentProject);
        this.project = currentProject;
      }
      if (
        currentProject?.analysisResultModel.planning == '' ||
        currentProject?.analysisResultModel.planning == undefined
      ) {
        this.firstPhaseService
          .executeFirstPhase(this.project)
          .then((analysis) => {
            this.isLoaded = false;
            this.project.analysisResultModel = analysis as AnalysisResultModel;
            this.projectService.editUserProject(this.id, this.project);
          });
      }
    });
  }

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';

    const newHeight = Math.min(textarea.scrollHeight, 400);
    textarea.style.height = newHeight + 'px';
  }
}
