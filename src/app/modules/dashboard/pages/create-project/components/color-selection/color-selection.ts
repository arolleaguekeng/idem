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
  readonly colorPalettes = input.required<ColorPalette[]>();
  readonly selectedColor = input.required<string>();

  readonly colorSelected = output<string>();

  protected selectColor(colorId: string): void {
    this.colorSelected.emit(colorId);
  }
}
