import {
  Component,
  EventEmitter,
  input,
  Input,
  output,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPalette } from '../../data';

@Component({
  selector: 'app-color-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-selection.html',
  styleUrl: './color-selection.css',
})
export class ColorSelectionComponent {
  protected readonly colorPalettes = input<ColorPalette[]>();
  protected readonly selectedColor = input<string>();

  protected readonly colorSelected = output<string>();

  protected selectColor(colorId: string): void {
    this.colorSelected.emit(colorId);
  }
}
