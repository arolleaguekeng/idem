import { Component, inject, PLATFORM_ID, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// Import standalone components
import { Hero } from '../../components/hero/hero';
import { Features } from '../../components/features/features';
import { Cta } from '../../components/cta/cta';
import { Pricing } from '../../components/pricing/pricing';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Hero, Features, Cta, Pricing],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit, OnDestroy {
  // Angular-initialized properties
  protected readonly isBrowser = signal(isPlatformBrowser(inject(PLATFORM_ID)));
  private readonly platformId = inject(PLATFORM_ID);
  
  // State properties
  protected scrollObserver: IntersectionObserver | null = null;
  
  // Lifecycle methods
  ngAfterViewInit(): void {
    this.initScrollAnimations();
  }
  
  ngOnDestroy(): void {
    this.destroyScrollAnimations();
  }
  
  // Animation methods
  private initScrollAnimations(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    // Configure the intersection observer for scroll animations
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };
    
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Add the active class when the element is in the viewport
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optionally stop observing after animation is triggered
          // this.scrollObserver?.unobserve(entry.target);
        } else {
          // Optional: remove the class when out of viewport for re-animation on scroll up
          // entry.target.classList.remove('active');
        }
      });
    }, options);
    
    // Observe all elements with the 'reveal' class
    document.querySelectorAll('.reveal').forEach(element => {
      this.scrollObserver?.observe(element);
    });
  }
  
  private destroyScrollAnimations(): void {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
      this.scrollObserver = null;
    }
  }
}
