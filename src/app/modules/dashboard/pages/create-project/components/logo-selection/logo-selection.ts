import { Component, EventEmitter, input, Input, output, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogoOption } from '../../data';
import { SafeHtmlPipe } from '../../../projects-list/safehtml.pipe';

@Component({
  selector: 'app-logo-selection',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SafeHtmlPipe
  ],
  templateUrl: './logo-selection.html',
  styleUrl: './logo-selection.css',
})
export class LogoSelectionComponent {
  protected readonly logos = input<LogoOption[]>();
  protected readonly selectedLogo = input<string>();

  protected readonly logoSelected = output<string>();

  protected selectLogo(logoId: string): void {
    this.logoSelected.emit(logoId);
  }
}
