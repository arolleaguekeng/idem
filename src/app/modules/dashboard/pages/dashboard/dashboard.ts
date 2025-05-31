import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ShowPlaning } from '../show-planing/show-planing';

@Component({
  selector: 'app-dashboard',
  imports: [ShowPlaning],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {}
