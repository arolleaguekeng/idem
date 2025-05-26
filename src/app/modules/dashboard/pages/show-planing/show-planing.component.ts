import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ProjectModel } from '../../models/project.model';
import { MarkdownComponent } from 'ngx-markdown';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';
import { User } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { initEmptyObject } from '../../../../utils/init-empty-object';
import { AuthService } from '../../../auth/services/auth.service';
import { AnalysisResultModel } from '../../models/analysisResult.model';
import { ProjectService } from '../../services/project.service';
import { first } from 'rxjs';
import { generatePdf } from '../../../../utils/pdf-generator';
import { PlanningService } from '../../services/ai-agents/planning.service';

@Component({
  selector: 'app-show-planing',
  imports: [TabsModule, MarkdownComponent, BadgeModule],
  templateUrl: './show-planing.component.html',
  styleUrls: ['./show-planing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowPlaningComponent {
  id = '';
  project: ProjectModel = initEmptyObject<ProjectModel>();
  analis: AnalysisResultModel = initEmptyObject<AnalysisResultModel>();
  route = inject(ActivatedRoute);
  planningService = inject(PlanningService);
  isPlanningLoaded = signal(true);
  currentUser?: User | null;
  auth = inject(AuthService);
  user$ = this.auth.user$;
  projectService = inject(ProjectService);

  async ngOnInit() {
    try {
      this.isPlanningLoaded.set(true);
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
      if (this.project.selectedPhases.includes('planning')) {
        console.log('Executing first phase...');

        const analysis = await this.planningService.getPlanningItems(
          this.project.id!
        );
        if (!analysis) {
          console.log('error on anallysis');
          return;
        }

        await this.projectService.editUserProject(this.id, this.project);

        this.isPlanningLoaded.set(false);
      }
    } catch (error) {
      console.error(
        'Erreur lors du chargement du projet ou de l’utilisateur',
        error
      );
    }
  }

  makePdf() {
    const allPlaningStapesContent = this.project.analysisResultModel.planning
      .map((item) => item.data)
      .join('\n');
    generatePdf(allPlaningStapesContent, true);
  }
}
