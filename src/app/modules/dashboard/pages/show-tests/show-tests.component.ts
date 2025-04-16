import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-show-tests',
  imports: [],
  templateUrl: './show-tests.component.html',
  styleUrl: './show-tests.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowTestsComponent { }
