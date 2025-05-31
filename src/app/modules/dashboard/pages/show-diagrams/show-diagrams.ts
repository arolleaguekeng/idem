import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { ProjectModel } from '../../models/project.model';
import { User } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { initEmptyObject } from '../../../../utils/init-empty-object';
import { AuthService } from '../../../auth/services/auth.service';
import { AnalysisResultModel } from '../../models/analysisResult.model';
import { DiagramModel } from '../../models/diagram.model';
import { ProjectService } from '../../services/project.service';
import { first } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { DiagramsService } from '../../services/ai-agents/diagrams.service';

@Component({
  selector: 'app-show-diagrams',
  imports: [MarkdownComponent],
  templateUrl: './show-diagrams.html',
  styleUrl: './show-diagrams.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowDiagramsComponent {
  id = '';
  project: ProjectModel = initEmptyObject<ProjectModel>();
  analis: AnalysisResultModel = initEmptyObject<AnalysisResultModel>();
  formatedDiagrams: DiagramModel[] = [];
  route = inject(ActivatedRoute);
  diagramsService = inject(DiagramsService);
  isDesignLoaded = signal(true);
  currentUser?: User | null;
  auth = inject(AuthService);
  user$ = this.auth.user$;
  projectService = inject(ProjectService);
  diagenUrl = environment.services.diagen.url;

  async ngOnInit() {
    try {
      this.isDesignLoaded.set(true);
      const user = await this.auth.user$.pipe(first()).toPromise();
      this.currentUser = user;

      if (!this.currentUser) {
        return;
      }

      this.id = this.route.snapshot.paramMap.get('id')!;
      if (!this.id) {
        return;
      }

      this.projectService.getProjectById(this.id).subscribe({
        next: (project) => {
          if (!project) {
            console.log('Projet non trouvé');
            this.isDesignLoaded.set(false);
            return;
          }

          if (!project.analysisResultModel) {
            project.analysisResultModel = this.analis as AnalysisResultModel;
          }
          this.project = project;
          console.log('project', this.project);

          if (project.selectedPhases.includes('design')) {
            if (!this.project.analysisResultModel.design) {
              console.log('Trying to generate diagrams...');
              this.diagramsService.getDiagrams(this.id).subscribe({
                next: (diagrams) => {
                  this.formatedDiagrams = diagrams;
                  this.isDesignLoaded.set(false);
                },
                error: (err) => {
                  console.error(
                    'Erreur lors de la récupération des diagrammes:',
                    err
                  );
                  this.isDesignLoaded.set(false);
                },
              });
            } else {
              // Design exists, no need to fetch diagrams
              this.isDesignLoaded.set(false);
            }
          } else {
            // Design phase not selected, no need to fetch diagrams
            this.isDesignLoaded.set(false);
          }
        },
        error: (err) => {
          console.error('Erreur lors de la récupération du projet:', err);
          this.isDesignLoaded.set(false);
        },
      });
    } catch (error) {
      console.error(
        'Erreur lors du chargement du projet ou de l’utilisateur',
        error
      );
    }
  }
}
