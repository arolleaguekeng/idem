import {
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorModel } from '../../../../models/brand-identity.model';

@Component({
  selector: 'app-color-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-selection.html',
  styleUrl: './color-selection.css',
})
export class ColorSelectionComponent {
  readonly colorPalettes = input.required<ColorModel[]>();
  readonly selectedColor = input.required<string>();

  readonly colorSelected = output<string>();

  protected selectColor(colorId: string): void {
    this.colorSelected.emit(colorId);
  }
}
