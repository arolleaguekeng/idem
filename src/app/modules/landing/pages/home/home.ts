import { Component } from '@angular/core';
// No longer need RouterLink as we're using child components

// Import standalone components
import { Hero } from '../../components/hero/hero';
import { Features } from '../../components/features/features';
import { Cta } from '../../components/cta/cta';
import { Pricing } from '../../components/pricing/pricing';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, Features, Cta, Pricing],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
