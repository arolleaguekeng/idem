import {
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from '../../../projects-list/safehtml.pipe';
import { LogoModel } from '../../../../models/logo.model';

@Component({
  selector: 'app-logo-selection',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  templateUrl: './logo-selection.html',
  styleUrl: './logo-selection.css',
})
export class LogoSelectionComponent {
  readonly logos = input<LogoModel[]>();
  readonly selectedLogo = input<string>();

  readonly logoSelected = output<string>();

  protected selectLogo(logoId: string): void {
    this.logoSelected.emit(logoId);
  }

  ngOnInit(): void {
    console.log(this.selectedLogo());
    console.log(this.logos());
  }
}
