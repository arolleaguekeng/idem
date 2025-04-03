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
import { Auth, User } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../../auth/services/auth.service';
import { Subscription } from 'rxjs';

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
  isLoaded = false;
  currentUser?: User | null;
  auth = inject(AuthService);
  user$ = this.auth.user$;
  userSubscription: Subscription;
  projectService = inject(ProjectService);
  constructor() {
    this.userSubscription = this.user$.subscribe((user: User | null) => {
      this.currentUser = user;
      this.isLoaded = true; // Activation du loader
      this.id = this.route.snapshot.paramMap.get('id')!;
      console.log('suUserrr', this.currentUser);
      try {
        const currentProject = this.projectService
          .getUserProjectById(this.id)
          .then((project) => {
            if (project) {
              this.project = project;
              // Vérifier si l'analyse doit être exécutée
              if (!this.project.analysisResultModel?.planning) {
                const analysis = this.firstPhaseService
                  .executeFirstPhase(this.project)
                  .then((analysis) => {
                    this.project.analysisResultModel =
                      analysis as AnalysisResultModel;
                    this.projectService
                      .editUserProject(this.id, this.project)
                      .then(() => {
                        this.isLoaded = false;
                      });
                  });
              }
            }
          });
        console.log('project', currentProject);
      } catch (error) {
        console.error('Erreur lors du chargement du projet', error);
      } finally {
        this.isLoaded = false; // Désactivation du loader après toutes les opérations
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
