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
import { BusinessPlanService } from '../../services/ai-agents/business-plan.service';

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
  businessPlanService = inject(BusinessPlanService);
  isBusinessplanLoaded = signal(true);
  currentUser?: User | null;
  auth = inject(AuthService);
  user$ = this.auth.user$;
  projectService = inject(ProjectService);
  datas: string[] = [];
  async ngOnInit() {
    try {
      this.isBusinessplanLoaded.set(true);
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

      this.projectService.getProjectById(this.id).subscribe({
        next: (project) => {
          if (!project) {
            console.log('Projet non trouvé');
            return;
          }

          if (!project.analysisResultModel) {
            project.analysisResultModel = this.analis as AnalysisResultModel;
          }
          this.project = project;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération du projet:', err);
          // Optionally, set a user-facing error message or navigate away
        },
      });
      console.log('project', this.project);
      this.datas = this.project.analysisResultModel.businessPlan!.sections!.map(
        (item) => item.data
      );
      console.log('datas', this.datas);
      this.isBusinessplanLoaded.set(false);
      // if (this.project.selectedPhases.includes('businessplan')) {
      //   console.log('Executing first phase...');

      //   const analysis = await this.businessPlanService.getBusinessplanItems(
      //     this.project.id!
      //   );
      //   if (!analysis) {
      //     console.log('error on anallysis');
      //     return;
      //   }

      //   await this.projectService.editUserProject(this.id, this.project);

      //   this.isBusinessplanLoaded.set(false);
      // }
    } catch (error) {
      console.error(
        'Erreur lors du chargement du projet ou de l’utilisateur',
        error
      );
    }
  }

  makePdf() {
    const allPlaningStapesContent = this.datas.join('\n');
    generatePdf(allPlaningStapesContent, true);
  }
}
