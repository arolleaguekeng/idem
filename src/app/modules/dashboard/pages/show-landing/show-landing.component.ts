import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-show-landing',
  imports: [],
  templateUrl: './show-landing.component.html',
  styleUrl: './show-landing.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowLandingComponent { 

  redirectToReactApp() {
    // URL de votre application React
    const reactAppUrl = 'https://votre-app-react.com/generate';
    
    // Option 1: Redirection simple
    window.location.href = reactAppUrl;
    
    // Option 2: Redirection avec état (si les apps partagent un domaine parent)
    // this.router.navigateByUrl('/external-redirect', { state: { url: reactAppUrl } });
  }
}
