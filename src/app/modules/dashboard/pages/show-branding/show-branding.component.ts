import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ProjectModel } from '../../models/project.model';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';
import { User } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { initEmptyObject } from '../../../../utils/init-empty-object';
import { AuthService } from '../../../auth/services/auth.service';
import { AnalysisResultModel } from '../../models/analysisResult.model';
import { BrandingOrchestratorService } from '../../services/ai-agents/Phase-2-Branding/branding-orchestrator.service';
import { ProjectService } from '../../services/project.service';
import { BrandIdentityModel } from '../../models/brand-identity.model';
import { first } from 'rxjs';

@Component({
  selector: 'app-show-branding',
  imports: [
    TabsModule,
    FormsModule,
    MarkdownComponent,
    AccordionModule,
    AvatarModule,
    BadgeModule,
  ],
  templateUrl: './show-branding.component.html',
  styleUrl: './show-branding.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowBrandingComponent {
  id = '';
  project: ProjectModel = initEmptyObject<ProjectModel>();
  analis: AnalysisResultModel = initEmptyObject<AnalysisResultModel>();
  route = inject(ActivatedRoute);
  brandOrchestratorService = inject(BrandingOrchestratorService);
  isBrandingLoaded = signal(true);
  currentUser?: User | null;
  auth = inject(AuthService);
  user$ = this.auth.user$;
  projectService = inject(ProjectService);

  async ngOnInit() {
    try {
      this.isBrandingLoaded.set(true);

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
      if (project.selectedPhases.includes('branding')) {
        if (!this.project.analysisResultModel.branding) {
          const brand =
            await this.brandOrchestratorService.generateFullBranding(
              this.project
            );

          this.project.analysisResultModel.branding =
            brand as BrandIdentityModel;

          await this.projectService.editUserProject(this.id, this.project);
        }
        this.isBrandingLoaded.set(false);
      }
    } catch (error) {
      console.error(
        'Erreur lors du chargement du projet ou de l’utilisateur',
        error
      );
    }
  }
}
