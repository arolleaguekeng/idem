import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-editor',
  imports: [],
  templateUrl: './project-editor.component.html',
  styleUrl: './project-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectEditorComponent {
  id = '';
  route = inject(ActivatedRoute);
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
  }
}
