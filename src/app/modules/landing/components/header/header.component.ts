import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateY(0%)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
})
export class HeaderComponent {
  isMenuOpen = false;

  // Fonction pour ouvrir/fermer le menu mobile
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
