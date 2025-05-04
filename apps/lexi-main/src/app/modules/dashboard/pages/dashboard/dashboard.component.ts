import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ShowBrandingComponent } from '../show-branding/show-branding.component';

@Component({
  selector: 'lm-dashboard',
  imports: [ShowBrandingComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {}
