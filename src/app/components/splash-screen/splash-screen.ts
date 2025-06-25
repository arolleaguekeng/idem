import {
  Component,
  OnInit,
  inject,
  signal,
  ElementRef,
  AfterViewInit,
  Renderer2,
  ApplicationRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splash-screen.html',
  styleUrl: './splash-screen.css',
})
export class SplashScreenComponent implements OnInit, AfterViewInit {
  protected readonly router = inject(Router);
  protected readonly elementRef = inject(ElementRef);
  protected readonly renderer = inject(Renderer2);
  protected readonly appRef = inject(ApplicationRef);
  protected readonly loading = signal(true);

  // Track loading progress
  protected readonly progress = signal(0);
  protected readonly animationComplete = signal(false);

  ngOnInit(): void {
    // Set initial loading state
    this.progress.set(0);

    // Listen for resource load events
    window.addEventListener('load', () => {
      this.progress.set(100);
      setTimeout(() => {
        this.animationComplete.set(true);
        setTimeout(() => {
          this.loading.set(false);
        }, 300);
      }, 500);
    });
  }

  ngAfterViewInit(): void {
    // Use Angular's ApplicationRef to detect when the app is stable
    // This is more Angular-idiomatic than using direct DOM queries

    // Track resources loading
    const totalResources = 20; // Estimate of total resources to load
    let resourcesLoaded = 0;

    // Update progress function using Angular change detection
    const updateProgress = () => {
      resourcesLoaded++;
      const percentage = Math.min(
        Math.floor((resourcesLoaded / totalResources) * 100),
        95
      );
      this.progress.set(percentage);
      this.appRef.tick(); // Trigger change detection
    };

    // Use renderer to listen to page load events
    const window = this.elementRef.nativeElement.ownerDocument.defaultView;
    this.renderer.listen('window', 'DOMContentLoaded', () => {
      updateProgress();
    });

    // Register for style loading completion
    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        // Application is stable, meaning most resources are loaded
        setTimeout(() => {
          this.progress.set(100);
          this.appRef.tick();

          setTimeout(() => {
            this.animationComplete.set(true);
            this.appRef.tick();

            setTimeout(() => {
              this.loading.set(false);
              this.appRef.tick();
            }, 300);
          }, 500);
        }, 300);
      } else {
        // Each time stability changes, update progress
        updateProgress();
      }
    });

    // Simulate gradual progress while waiting for full stability
    const progressInterval = setInterval(() => {
      if (this.progress() < 90) {
        this.progress.update((value) => Math.min(value + 5, 90));
      } else {
        clearInterval(progressInterval);
      }
    }, 300);

    // Complete loading when navigation finishes (fallback)
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.progress() < 100) {
          setTimeout(() => {
            this.progress.set(100);
            setTimeout(() => {
              this.animationComplete.set(true);
              setTimeout(() => {
                this.loading.set(false);
              }, 300);
            }, 500);
          }, 800);
        }
      });
  }
}
