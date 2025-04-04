import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  resetPosition() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  title = 'lexi';
}
