import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { ProjectModel } from '../../models/project.model';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { FirstPhaseMainService } from '../../services/ai-agents/Phase-1-Planning/first-phase-main.service';
import { AnalysisResultModel } from '../../models/analysisResult.model';
import { LoaderComponent } from '../../../../components/loader/loader.component';
import { MarkdownComponent } from 'ngx-markdown';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../../auth/services/auth.service';
import { first } from 'rxjs';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { AccordionModule } from 'primeng/accordion';
import { SecondPhaseMainService } from '../../services/ai-agents/Phase-2-Design/second-phase-main.service';
import { DiagramModel } from '../../models/diagram.model';

@Component({
  selector: 'app-project-editor',
  imports: [
    TabsModule,
    FormsModule,
    LoaderComponent,
    MarkdownComponent,
    AccordionModule,
    AvatarModule,
    BadgeModule,
  ],
  templateUrl: './project-editor.component.html',
  styleUrl: './project-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectEditorComponent implements OnInit {
  id = '';
  project!: ProjectModel;
  route = inject(ActivatedRoute);
  firstPhaseService = inject(FirstPhaseMainService);
  secondPhaseService = inject(SecondPhaseMainService);
  isLoaded = signal(true);
  currentUser?: User | null;
  auth = inject(AuthService);
  user$ = this.auth.user$;
  // userSubscription: Subscription;
  projectService = inject(ProjectService);
  ngOnInit() {
    this.auth.user$.pipe(first()).subscribe({
      next: (user) => {
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

        this.projectService
          .getUserProjectById(this.id)
          .then((project) => {
            if (!project) {
              console.log('Projet non trouvé');
              return;
            }
            this.project = project;

            if (!this.project.analysisResultModel?.planning) {
              console.log('Exécution de la première phase...');
              this.firstPhaseService
                .executeFirstPhase(this.project)
                .then((analysis) => {
                  this.project.analysisResultModel =
                    analysis as AnalysisResultModel;

                  this.projectService
                    .editUserProject(this.id, this.project)
                    .then(() => {
                      this.isLoaded.set(false);
                    });
                });
            } else {
              console.log('Analyse déjà existante.');
            }

            if (
              this.project.analysisResultModel.design &&
              this.project.analysisResultModel.design.length <= 0
            ) {
              console.log('Tray to generate diagramms...');
              this.secondPhaseService
                .executeSecondPhaseDiagrams(this.project)
                .then((diagrams) => {
                  this.project.analysisResultModel.design =
                    diagrams as DiagramModel[];

                  this.projectService
                    .editUserProject(this.id, this.project)
                    .then(() => {
                      this.isLoaded.set(false);
                    });
                });
            }
            this.isLoaded.set(false);
          })
          .catch((error) => {
            console.error('Erreur lors du chargement du projet', error);
          });
      },
      error: (error) => {
        console.error(
          'Erreur lors de la récupération de l’utilisateur:',
          error
        );
      },
    });
  }

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 400);
    textarea.style.height = newHeight + 'px';
  }
}
