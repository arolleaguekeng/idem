import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  Router,
  ActivatedRoute,
  NavigationEnd,
} from '@angular/router';
import { SplashScreenComponent } from './components/splash-screen/splash-screen';
import { filter, map, startWith, distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout';
import { EmptyLayout } from "./layouts/empty-layout/empty-layout";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PublicLayoutComponent,
    DashboardLayoutComponent,
    CommonModule,
    EmptyLayout,
    SplashScreenComponent
],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly router = inject(Router);
  protected readonly activatedRoute = inject(ActivatedRoute);

  /** Layout courant selon la route active */
  protected readonly currentLayout$: Observable<
    'public' | 'dashboard' | 'empty'
  > = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() => {
      let route = this.activatedRoute.firstChild;
      while (route?.firstChild) {
        route = route.firstChild;
      }
      return (
        (route?.snapshot.data?.['layout'] as
          | 'public'
          | 'dashboard'
          | 'empty') || 'public'
      );
    }),
    distinctUntilChanged()
  );

  protected resetPosition() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected readonly title = 'idem';
}
