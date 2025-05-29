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
   ngOnInit() {
    try {
      this.isBrandingLoaded.set(true);

      this.auth.user$.pipe(first()).subscribe((user) => {
        if (user) {
          this.currentUser = user;
        } else {
          console.log('Utilisateur non connecté');
        }
      });

      if (!this.currentUser) {
        console.log('Utilisateur non connecté');
        return;
      }

      this.id = this.route.snapshot.paramMap.get('id')!;
      if (!this.id) {
        console.log('ID du projet introuvable');
        return;
      }

      this.projectService.getProjectById(this.id).subscribe((project: ProjectModel | null) => {
        if (!project) {
          console.log('Projet non trouvé');
          return;
        }
        if (!project.analysisResultModel) {
          project.analysisResultModel = this.analis as AnalysisResultModel;
        }
        this.project = project;
      });

      
      
      if (this.project.selectedPhases.includes('branding')) {
        console.log(this.project);
        this.brandingService.getBrandIdentityModelById(this.id).subscribe({
          next: (brandModelData) => {
            this.branding = brandModelData; // Assuming API returns the model or errors out if not found
            this.isBrandingLoaded.set(false);
          },
          error: (err) => {
            console.error(`Error fetching branding information for project ID: ${this.id}:`, err);
            this.branding = null;
            this.isBrandingLoaded.set(false);
          }
        });
      } else {
        // If branding is not a selected phase, no attempt to load its specific data.
        // Ensure the general loading indicator for this section is turned off.
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
