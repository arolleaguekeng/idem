import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-show-development',
  imports: [],
  templateUrl: './show-development.html',
  styleUrl: './show-development.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowDevelopmentComponent { }
