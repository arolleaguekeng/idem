import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';
import { ProjectModel } from '../../models/project.model';
import { User } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { initEmptyObject } from '../../../../utils/init-empty-object';
import { AuthService } from '../../../auth/services/auth.service';
import { AnalysisResultModel } from '../../models/analysisResult.model';
import { DiagramModel } from '../../models/diagram.model';
import { ThirdPhaseMainService } from '../../services/ai-agents/Phase-3-Design/third-phase-main.service';
import { ProjectService } from '../../services/project.service';
import { first } from 'rxjs';
import { LoaderComponent } from "../../../../components/loader/loader.component";

@Component({
  selector: 'app-show-diagrams',
  imports: [
    TabsModule,
    FormsModule,
    MarkdownComponent,
    AccordionModule,
    AvatarModule,
    BadgeModule,
    LoaderComponent
],
  templateUrl: './show-diagrams.component.html',
  styleUrl: './show-diagrams.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowDiagramsComponent {
  id = '';
  project: ProjectModel = initEmptyObject<ProjectModel>();
  analis: AnalysisResultModel = initEmptyObject<AnalysisResultModel>();
  formatedDiagrams: DiagramModel[] = [];
  route = inject(ActivatedRoute);
  thirdPhaseService = inject(ThirdPhaseMainService);
  isDesignLoaded = signal(true);
  currentUser?: User | null;
  auth = inject(AuthService);
  user$ = this.auth.user$;
  projectService = inject(ProjectService);

  async ngOnInit() {
    try {
      this.isDesignLoaded.set(true);
      const user = await this.auth.user$.pipe(first()).toPromise();
      this.currentUser = user;

      if (!this.currentUser) {
        console.log('Utilisateur non connecté');
        return;
      }

      this.id = this.route.snapshot.paramMap.get('id')!;
      if (!this.id) {
        console.log('ID du projet introuvable');
        return;
      }

      const project = await this.projectService.getUserProjectById(this.id);
      if (!project) {
        console.log('Projet non trouvé');
        return;
      }

      if (!project.analysisResultModel) {
        project.analysisResultModel = this.analis as AnalysisResultModel;
      }
      this.project = project;
      console.log('project', this.project);
      if (project.selectedPhases.includes('design')) {
        if (!this.project.analysisResultModel.design) {
          console.log('Tray to generate diagrams...');
          const diagrams =
            await this.thirdPhaseService.executeThirdPhaseDiagrams(
              this.project
            );
          this.project.analysisResultModel.design = diagrams as DiagramModel[];

          await this.projectService.editUserProject(this.id, this.project);
        }
        for (let diagram of this.project.analysisResultModel.design) {
          diagram.code = '```mermaid \n\n' + diagram.code + ' \n\n ```';
          console.log(diagram);
          this.formatedDiagrams.push(diagram);
        }
        project.analysisResultModel.design = this.formatedDiagrams;
        this.isDesignLoaded.set(false);
      }
    } catch (error) {
      console.error(
        'Erreur lors du chargement du projet ou de l’utilisateur',
        error
      );
    }
  }
}
