import { Component, signal, HostListener, afterNextRender, inject, PLATFORM_ID, ElementRef, ViewChild, OnDestroy, HostBinding } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnDestroy {
  // Angular-initialized properties
  protected readonly isBrowser = signal(isPlatformBrowser(inject(PLATFORM_ID)));
  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);
  
  // Apply host class for animation timing
  @HostBinding('class.animate-in')
  protected readonly animateIn = true;

  // State properties
  protected mouseX = signal(0);
  protected mouseY = signal(0);
  protected scrollY = signal(0);
  protected isInViewport = signal(true);
  protected spotlightX = signal(0);
  protected spotlightY = signal(0);
  
  // View references
  @ViewChild('spotlightElement') spotlightElement?: ElementRef<HTMLElement>;
  
  constructor() {
    afterNextRender(() => {
      if (this.isBrowser()) {
        this.initAnimations();
        this.animateStaggerItems();
      }
    });
  }
  
  // Handle mouse movement for parallax and spotlight effects
  @HostListener('mousemove', ['$event'])
  protected handleMouseMove(event: MouseEvent): void {
    this.mouseX.set(event.clientX);
    this.mouseY.set(event.clientY);
    
    if (this.isBrowser()) {
      this.updateParallaxElements();
      this.updateSpotlightEffect(event);
    }
  }
  
  // Handle scroll events
  @HostListener('window:scroll')
  protected handleScroll(): void {
    if (this.isBrowser()) {
      this.scrollY.set(window.scrollY);
      this.checkIfInViewport();
      this.updateParallaxElements();
    }
  }
  
  // Lifecycle hook
  ngOnDestroy(): void {
    // Clean up any resources or subscriptions
  }
  
  // Initialize animations
  private initAnimations(): void {
    // Initial check for visibility
    this.checkIfInViewport();
    
    // Add animate-in class to host with slight delay for entrance animation
    setTimeout(() => {
      this.elementRef.nativeElement.classList.add('animate-in');
    }, 100);
  }
  
  // Update spotlight effect for Apple-style mouse tracking
  private updateSpotlightEffect(event: MouseEvent): void {
    // Find spotlight elements
    const spotlights = document.querySelectorAll('.spotlight');
    
    spotlights.forEach(spotlightEl => {
      const el = spotlightEl as HTMLElement;
      const parent = el.parentElement;
      
      if (!parent) return;
      
      const rect = parent.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      el.style.setProperty('--x', `${x}`);
      el.style.setProperty('--y', `${y}`);
    });
  }
  
  // Animate stagger items with Apple-style sequential reveals
  private animateStaggerItems(): void {
    const staggerItems = document.querySelectorAll('.stagger-item');
    
    staggerItems.forEach((item, index) => {
      // Add stagger delay class based on index
      item.classList.add(`stagger-delay-${index + 1}`);
      
      // Add active class after a small initial delay
      setTimeout(() => {
        item.classList.add('active');
      }, 100);
    });
  }
  
  // Check if hero section is in viewport
  private checkIfInViewport(): void {
    const heroElement = document.querySelector('.hero-section');
    if (!heroElement) return;
    
    const rect = heroElement.getBoundingClientRect();
    const isVisible = 
      rect.top < window.innerHeight && 
      rect.bottom >= 0;
    
    this.isInViewport.set(isVisible);
  }
  
  // Update parallax elements based on mouse position and scroll
  private updateParallaxElements(): void {
    if (!this.isInViewport()) return;
    
    const heroElement = document.querySelector('.hero-section');
    if (!heroElement) return;
    
    const rect = heroElement.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate mouse position relative to center of hero
    const relX = (this.mouseX() - rect.left) - centerX;
    const relY = (this.mouseY() - rect.top) - centerY;
    
    // Update parallax elements
    const parallaxElements = document.querySelectorAll('.parallax-layer');
    parallaxElements.forEach((element) => {
      // Cast Element to HTMLElement
      const el = element as HTMLElement;
      const depth = parseFloat(el.getAttribute('data-depth') || '0.1');
      const translateX = relX * depth * -0.05;
      const translateY = relY * depth * -0.05;
      const translateZ = this.scrollY() * depth * 0.1;
      
      el.style.transform = `translate3d(${translateX}px, ${translateY}px, ${translateZ}px)`;
    });
  }
}
