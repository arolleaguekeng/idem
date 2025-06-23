import { Component, HostBinding, HostListener, ElementRef, inject, signal, AfterViewInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export class Pricing implements AfterViewInit, OnDestroy {
  // Angular-initialized properties
  protected readonly isBrowser = signal(isPlatformBrowser(inject(PLATFORM_ID)));
  private readonly elementRef = inject(ElementRef);
  
  // Apply host class for animation timing
  @HostBinding('class.animate-in')
  protected readonly animateIn = signal(false);
  
  // State properties
  protected mouseX = signal(0);
  protected mouseY = signal(0);
  protected observer: IntersectionObserver | null = null;
  
  ngAfterViewInit(): void {
    if (this.isBrowser()) {
      this.initAnimations();
      this.setupSpotlightEffect();
      this.setupIntersectionObserver();
    }
  }
  
  ngOnDestroy(): void {
    this.destroyIntersectionObserver();
  }
  
  @HostListener('mousemove', ['$event'])
  protected handleMouseMove(event: MouseEvent): void {
    if (this.isBrowser()) {
      this.mouseX.set(event.clientX);
      this.mouseY.set(event.clientY);
      this.updateSpotlightEffect(event);
    }
  }
  
  private initAnimations(): void {
    // Delay animation entrance effect
    setTimeout(() => {
      this.animateIn.set(true);
    }, 300);
  }
  
  private setupSpotlightEffect(): void {
    // Add spotlight elements to each pricing card
    const pricingCards = this.elementRef.nativeElement.querySelectorAll('.pricing-card');
    
    pricingCards.forEach((card: Element) => {
      if (!card.querySelector('.pricing-spotlight')) {
        const spotlight = document.createElement('div');
        spotlight.classList.add('pricing-spotlight');
        card.insertBefore(spotlight, card.firstChild);
      }
    });
  }
  
  private updateSpotlightEffect(event: MouseEvent): void {
    // Update spotlight position based on mouse movement
    const spotlights = document.querySelectorAll('.pricing-spotlight');
    
    spotlights.forEach(spotlightEl => {
      const el = spotlightEl as HTMLElement;
      const parent = el.parentElement;
      
      if (!parent) return;
      
      const rect = parent.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Only update if mouse is over the card
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        el.style.setProperty('--x', `${x}`);
        el.style.setProperty('--y', `${y}`);
      }
    });
  }
  
  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Add animation class when section becomes visible
            this.animateIn.set(true);
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    const pricingSection = this.elementRef.nativeElement.querySelector('.pricing-section');
    if (pricingSection) {
      this.observer.observe(pricingSection);
    }
  }
  
  private destroyIntersectionObserver(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}
