import { Component, HostBinding, HostListener, ElementRef, inject, signal, AfterViewInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.html',
  styleUrl: './features.css',
})
export class Features implements AfterViewInit, OnDestroy {
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
      this.setupParallaxEffect();
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
      this.updateParallaxElements(event);
    }
  }
  
  private initAnimations(): void {
    // Add animate-in class to host with slight delay for entrance animation
    setTimeout(() => {
      this.animateIn.set(true);
    }, 300);
  }
  
  private setupParallaxEffect(): void {
    // Handle initial setup for parallax elements
    const featureItems = this.elementRef.nativeElement.querySelectorAll('.parallax-feature');
    
    featureItems.forEach((item: Element) => {
      // Add data-depth attribute if not present
      if (!item.getAttribute('data-depth')) {
        const depth = (Math.random() * 0.2 + 0.05).toFixed(2); // Random depth between 0.05 and 0.25
        item.setAttribute('data-depth', depth);
      }
    });
  }
  
  private updateParallaxElements(event: MouseEvent): void {
    const featureContainer = this.elementRef.nativeElement.querySelector('.features-section');
    if (!featureContainer) return;
    
    const rect = featureContainer.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate mouse position relative to center
    const relX = (this.mouseX() - rect.left) - centerX;
    const relY = (this.mouseY() - rect.top) - centerY;
    
    // Update parallax elements
    const parallaxItems = this.elementRef.nativeElement.querySelectorAll('.parallax-feature');
    
    parallaxItems.forEach((element: Element) => {
      const el = element as HTMLElement;
      const depth = parseFloat(el.getAttribute('data-depth') || '0.1');
      const translateX = relX * depth * 0.03;
      const translateY = relY * depth * 0.03;
      
      el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;  
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
    
    const featuresSection = this.elementRef.nativeElement.querySelector('.features-section');
    if (featuresSection) {
      this.observer.observe(featuresSection);
    }
  }
  
  private destroyIntersectionObserver(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}
