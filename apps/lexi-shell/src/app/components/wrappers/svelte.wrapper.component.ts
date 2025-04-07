// apps/your-shell-app/src/app/svelte-wrapper.component.ts
import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  inject,
} from "@angular/core";
import { Router } from "@angular/router";
import { loadRemoteModule } from "@nx/angular/mf";

@Component({
  selector: "app-svelte-wrapper",
  template: "<div #svelteHost></div>",
  standalone: true,
})
export class SvelteWrapperComponent implements AfterViewInit, OnDestroy {
  @ViewChild("svelteHost", { static: true }) svelteHost!: ElementRef;
  private svelteInstance: any;
  router = inject(Router);
  async ngAfterViewInit() {
    try {
      const { default: SvelteComponent } = await loadRemoteModule(
        "mermaid", // nom du remote
        "./View" // nom du module exposé
      );

      this.svelteInstance = new SvelteComponent({
        target: this.svelteHost.nativeElement,
      });

      // 🟢 Synchronise Angular avec le router de Svelte
      window.addEventListener("svelte:navigate", (e: any) => {
        const path = e.detail?.to;
        if (path) {
          this.router.navigateByUrl(path);
        }
      });
    } catch (error) {
      console.error("Erreur de chargement du composant Svelte :", error);
    }
  }

  ngOnDestroy() {
    if (this.svelteInstance?.$destroy) {
      this.svelteInstance.$destroy();
    }
  }
}
