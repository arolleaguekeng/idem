import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../../auth/services/auth.service';
import { DiagramModel } from '../../models/diagram.model';
import { first } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { DiagramsService } from '../../services/ai-agents/diagrams.service';
import { CookieService } from '../../../../shared/services/cookie.service';
import { generatePdf } from '../../../../utils/pdf-generator';

@Component({
  selector: 'app-show-diagrams',
  imports: [MarkdownComponent],
  templateUrl: './show-diagrams.html',
  styleUrl: './show-diagrams.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowDiagramsComponent {
  diagramsService = inject(DiagramsService);
  isDiagramsLoaded = signal(true);
  currentUser?: User | null;
  auth = inject(AuthService);
  user$ = this.auth.user$;
  diagram: DiagramModel | null = null;
  isDiagramExists = signal(false);
  cookiesService = inject(CookieService);
  diagenUrl = environment.services.diagen.url;

  constructor() {
    this.projectIdFromCookie.set(this.cookiesService.get('projectId'));
  }

  protected readonly projectIdFromCookie = signal<string | null>(null);

  ngOnInit() {
    try {
      this.isDiagramsLoaded.set(true);

      this.auth.user$.pipe(first()).subscribe((user) => {
        if (user) {
          this.currentUser = user;
        } else {
          console.log('User not logged in');
          return;
        }
      });

      if (this.projectIdFromCookie() == null) {
        console.log('Project ID not found');
        return;
      } else {
        this.diagramsService
          .getDiagramModelById(this.projectIdFromCookie()!)
          .subscribe({
            next: (diagramData) => {
              this.diagram = diagramData;
              console.log('this.diagram', this.diagram.sections);
              if (this.diagram) {
                this.isDiagramExists.set(true);
                this.diagram.sections.forEach((section) => {
                  section.data = `\`\`\`${section.data}\n\`\`\``;
                });
              }
              this.isDiagramsLoaded.set(false);
            },
            error: (err) => {
              console.error(
                `Error fetching diagrams for project ID: ${this.projectIdFromCookie()}:`,
                err
              );
              this.diagram = null;
              this.isDiagramsLoaded.set(false);
              this.isDiagramExists.set(false);
            },
          });
      }
    } catch (error) {
      console.error('Error while loading project or user', error);
    }
  }

  makePdf() {
    if (this.diagram && this.diagram.sections) {
      const diagramContent = this.diagram.sections
        .map((section) => section.data || '')
        .join('\n');
      generatePdf(diagramContent);
    }
  }

  generateDiagrams() {
    this.isDiagramsLoaded.set(true);
    console.log('generateDiagrams...');
    this.diagramsService
      .createDiagramModel(this.projectIdFromCookie()!)
      .subscribe({
        next: (diagramData) => {
          this.diagram = diagramData;
          if (this.diagram) {
            this.isDiagramExists.set(true);
            this.diagram.sections.forEach((section) => {
              section.data = `\`\`\`${section.data}\n\`\`\``;
            });
          }
          this.isDiagramsLoaded.set(false);
        },
        error: (err) => {
          console.error(
            `Error generating diagrams for project ID: ${this.projectIdFromCookie()}:`,
            err
          );
          this.diagram = null;
          this.isDiagramsLoaded.set(false);
          this.isDiagramExists.set(false);
        },
      });
  }
}
