import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-show-development',
  imports: [],
  templateUrl: './show-development.component.html',
  styleUrl: './show-development.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowDevelopmentComponent { }
