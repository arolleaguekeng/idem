import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';
import { ProjectModel } from '../../models/project.model';

@Component({
  selector: 'app-show-diagrams',
  imports: [
    TabsModule,
    FormsModule,
    MarkdownComponent,
    AccordionModule,
    AvatarModule,
    BadgeModule,
  ],
  templateUrl: './show-diagrams.component.html',
  styleUrl: './show-diagrams.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowDiagramsComponent {
  project = input<ProjectModel>();
}
