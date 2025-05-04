import { AfterContentInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  template: '<div #vc></div>',
})
export class WrapperComponent implements AfterContentInit {
  @ViewChild('vc', { read: ElementRef, static: true }) vc!: ElementRef;

  constructor(private route: ActivatedRoute) { }

  async ngAfterContentInit(): Promise<void> {
    const elementName = this.route.snapshot.data['elementName'];
    const loader = this.route.snapshot.data['loadChildren'];

    await loader();
    const element = document.createElement(elementName);
    this.vc.nativeElement.appendChild(element);
  }
}
