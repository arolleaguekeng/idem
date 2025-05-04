import {
  AfterContentInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  template: '<div #vc></div>',
})
export class WrapperComponent implements AfterContentInit {
  @ViewChild('vc', { read: ElementRef, static: true }) vc!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  async ngAfterContentInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      // En SSR, on ne touche pas au DOM
      console.log("this is ssr")
      return;
    }
    else{
      console.log("Not ssr")
    }

    const elementName: string = this.route.snapshot.data['elementName'];
    const loader: () => Promise<any> = this.route.snapshot.data['loadChildren'];

    if (!elementName || !loader) {
      console.error(
        'elementName ou loadChildren manquant dans la configuration de route'
      );
      return;
    }

    // Charge le remote (via Module Federation)
    await loader();

    // Crée dynamiquement le custom element exposé par le MFE (React ou autre)
    const element = document.createElement(elementName);
    console.log(element)
    this.vc.nativeElement.appendChild(element);
  }
}
