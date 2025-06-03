import {
  Component,
  EventEmitter,
  input,
  Input,
  output,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypographyOption } from '../../data';

@Component({
  selector: 'app-typography-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './typography-selection.html',
  styleUrl: './typography-selection.css',
})
export class TypographySelectionComponent {
  readonly typographyOptions = input.required<TypographyOption[]>();
  readonly selectedTypography = input.required<string>();

  readonly typographySelected = output<string>();

  protected selectTypography(typographyId: string): void {
    this.typographySelected.emit(typographyId);
  }
}
