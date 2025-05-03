import { jsPDF } from 'jspdf';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
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
import { FirstPhaseMainService } from '../../services/ai-agents/Phase-1-Planning/first-phase-main.service';
import { ProjectService } from '../../services/project.service';
import { first } from 'rxjs';
import { PlanningModel } from '../../models/planning.model';
import { LoaderComponent } from '../../../../components/loader/loader.component';
import { generatePdf } from '../../../../utils/pdf-generator';

@Component({
  selector: 'app-show-planing',
  imports: [TabsModule, MarkdownComponent, BadgeModule],
  templateUrl: './show-planing.component.html',
  styleUrl: './show-planing.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowPlaningComponent {
  id = '';
  project: ProjectModel = initEmptyObject<ProjectModel>();
  analis: AnalysisResultModel = initEmptyObject<AnalysisResultModel>();
  route = inject(ActivatedRoute);
  firstPhaseService = inject(FirstPhaseMainService);
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

        const analysis = await this.firstPhaseService.executeFirstPhase(
          this.project
        );
        if (!analysis) {
          console.log('error on anallysis');
          return;
        }
        this.project.analysisResultModel.planning = analysis as PlanningModel;

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
    const allPlaningStapesContent =
      this.project.analysisResultModel.planning.feasibilityStudy.content +
      this.project.analysisResultModel.planning.requirementsGathering.content +
      this.project.analysisResultModel.planning.riskanalysis +
      this.project.analysisResultModel.planning.smartObjectives +
      this.project.analysisResultModel.planning.stakeholdersMeeting +
      this.project.analysisResultModel.planning.useCaseModeling;
    generatePdf(allPlaningStapesContent,true);
  }
}
