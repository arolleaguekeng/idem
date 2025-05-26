import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ProjectModel } from '../../models/project.model';
import { MarkdownComponent } from 'ngx-markdown';
import { User } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { initEmptyObject } from '../../../../utils/init-empty-object';
import { AuthService } from '../../../auth/services/auth.service';
import { AnalysisResultModel } from '../../models/analysisResult.model';
import { ProjectService } from '../../services/project.service';
import { first } from 'rxjs';
import { LoaderComponent } from '../../../../components/loader/loader.component';
import { generatePdf, htmlToMarkdown } from '../../../../utils/pdf-generator';
import { BrandingService } from '../../services/ai-agents/branding.service';
import { BrandIdentityModel } from '../../models/brand-identity.model';

@Component({
  selector: 'app-show-branding',
  imports: [MarkdownComponent, LoaderComponent],
  templateUrl: './show-branding.component.html',
  styleUrl: './show-branding.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowBrandingComponent {
  id = '';
  project: ProjectModel = initEmptyObject<ProjectModel>();
  analis: AnalysisResultModel = initEmptyObject<AnalysisResultModel>();
  route = inject(ActivatedRoute);
  brandingService = inject(BrandingService);
  isBrandingLoaded = signal(true);
  currentUser?: User | null;
  auth = inject(AuthService);
  user$ = this.auth.user$;
  projectService = inject(ProjectService);
  branding: BrandIdentityModel | null = null;
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
      this.project = project;
      if (project.selectedPhases.includes('branding')) {
        console.log(this.project);
        const brandModel = await this.brandingService.getBrandIdentityModelById(
          this.id
        );
        if (brandModel) {
          this.branding = brandModel;
        } else {
          this.branding = null;
          console.warn(
            `Branding information not found for project ID: ${this.id}`
          );
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

  makePdf() {
    if (this.branding) {
      generatePdf(
        this.branding.brandIdentity.map((item) => item.data).join('\n')
      );
    }
  }
}
