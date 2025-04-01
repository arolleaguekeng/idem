import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { ProjectModel } from '../../models/project.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-editor',
  imports: [TabsModule, FormsModule],
  templateUrl: './project-editor.component.html',
  styleUrl: './project-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectEditorComponent {
  id = '';
  project!: ProjectModel;
  route = inject(ActivatedRoute);
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
  }

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Réinitialise la hauteur

    // Vérifie si la hauteur dépasse 400px
    const newHeight = Math.min(textarea.scrollHeight, 400);
    textarea.style.height = newHeight + 'px';
  }
}
