import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ShowBrandingComponent } from "../show-branding/show-branding.component";
import { ShowPlaningComponent } from "../show-planing/show-planing.component";

@Component({
  selector: 'app-dashboard',
  imports: [ShowPlaningComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent { }
