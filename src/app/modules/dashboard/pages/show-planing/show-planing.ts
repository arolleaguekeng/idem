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
import { initEmptyObject } from '../../../../utils/init-empty-object';
import { AuthService } from '../../../auth/services/auth.service';
import { AnalysisResultModel } from '../../models/analysisResult.model';
import { ProjectService } from '../../services/project.service';
import { first } from 'rxjs';
import { generatePdf } from '../../../../utils/pdf-generator';
import { BusinessPlanService } from '../../services/ai-agents/business-plan.service';
import { CookieService } from '../../../../shared/services/cookie.service';

@Component({
  selector: 'app-show-planing',
  imports: [TabsModule, MarkdownComponent, BadgeModule],
  templateUrl: './show-planing.html',
  styleUrls: ['./show-planing.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowPlaning {
  project: ProjectModel = initEmptyObject<ProjectModel>();
  analis: AnalysisResultModel = initEmptyObject<AnalysisResultModel>();
  businessPlanService = inject(BusinessPlanService);
  isBusinessplanLoaded = signal(true);
  currentUser?: User | null;
  auth = inject(AuthService);
  user$ = this.auth.user$;
  projectService = inject(ProjectService);
  datas: string[] = [];
  cookiesService = inject(CookieService);
  protected readonly projectIdFromCookie = signal<string | null>(null);
  isBusinessplanExists = signal(false);

  constructor() {
    this.projectIdFromCookie.set(this.cookiesService.get('projectId'));
  }
  async ngOnInit() {
    // isBusinessplanLoaded is initialized to true by default
    try {
      const user = await this.auth.user$.pipe(first()).toPromise();
      this.currentUser = user;

      if (!this.currentUser) {
        console.log('Utilisateur non connecté');
        this.isBusinessplanLoaded.set(false);
        return;
      }

      if (this.projectIdFromCookie() == null) {
        console.log('ID du projet introuvable');
        this.isBusinessplanLoaded.set(false);
        return;
      } else {
        this.projectService
          .getProjectById(this.projectIdFromCookie()!)
          .subscribe({
            next: (project) => {
              if (!project) {
                console.log('Projet non trouvé');
                this.isBusinessplanLoaded.set(false);
                return;
              }

              if (!project.analysisResultModel) {
                project.analysisResultModel = this
                  .analis as AnalysisResultModel;
              }
              this.project = project;
              console.log('project', this.project);

              // Ensure businessPlan and sections exist before mapping
              if (this.project.analysisResultModel?.businessPlan?.sections) {
                this.datas =
                  this.project.analysisResultModel.businessPlan.sections.map(
                    (item) => item.data
                  );
                console.log('datas', this.datas);
              } else {
                console.log(
                  'Business plan sections not available for mapping.'
                );
                this.isBusinessplanExists.set(false);
                this.datas = []; // Initialize to empty array if not available
              }
              this.isBusinessplanLoaded.set(false);
            },
            error: (err) => {
              console.error('Erreur lors de la récupération du projet:', err);
              this.isBusinessplanLoaded.set(false);
              this.isBusinessplanExists.set(false);
              // Optionally, set a user-facing error message or navigate away
            },
          });
      }

      // The following lines were moved inside the 'next' callback or are handled by the loader logic:
      // console.log('project', this.project); // Moved
      // this.datas = this.project.analysisResultModel.businessPlan!.sections!.map(...); // Moved
      // console.log('datas', this.datas); // Moved
      // this.isBusinessplanLoaded.set(false); // Moved into next/error

      // Commented out business plan execution logic remains for now
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
      this.isBusinessplanLoaded.set(false);
    }
  }

  makePdf() {
    const allPlaningStapesContent = this.datas.join('\n');
    generatePdf(allPlaningStapesContent, true);
  }

  generateBusinessPlan() {
    this.isBusinessplanLoaded.set(true);
    this.businessPlanService
      .createBusinessplanItem(this.projectIdFromCookie()!)
      .subscribe({
        next: (businessPlanData) => {
          this.project.analysisResultModel!.businessPlan = businessPlanData;
          this.isBusinessplanExists.set(true);
          this.isBusinessplanLoaded.set(false);
        },
        error: (err) => {
          console.error(
            `Error generating business plan for project ID: ${this.projectIdFromCookie()}:`,
            err
          );
          this.isBusinessplanExists.set(false);
          this.isBusinessplanLoaded.set(false);
        },
      });
  }
}
