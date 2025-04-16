import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProjectModel } from '../../models/project.model';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';

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
  project = input<ProjectModel>();
}
