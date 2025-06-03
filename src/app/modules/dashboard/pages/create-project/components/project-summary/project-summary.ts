import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectModel } from '../../../../models/project.model';
import { ColorPalette, LogoOption, TypographyOption } from '../../data';
import { SafeHtmlPipe } from '../../../projects-list/safehtml.pipe';

@Component({
  selector: 'app-project-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  templateUrl: './project-summary.html',
  styleUrl: './project-summary.css',
})
export class ProjectSummaryComponent {
  // Angular inputs
  @Input() readonly project!: ProjectModel;
  @Input() readonly selectedLogo = '';
  @Input() readonly selectedColor = '';
  @Input() readonly selectedTypography = '';
  @Input() readonly logos: LogoOption[] = [];
  @Input() readonly colorPalettes: ColorPalette[] = [];
  @Input() readonly typographyOptions: TypographyOption[] = [];
  @Input() readonly privacyPolicyAccepted = false;
  @Input() readonly marketingConsentAccepted = false;

  // Angular outputs
  @Output() readonly privacyPolicyChange = new EventEmitter<boolean>();
  @Output() readonly marketingConsentChange = new EventEmitter<boolean>();
  @Output() readonly finalizeProject = new EventEmitter<void>();

  protected getSelectedLogo(): LogoOption | undefined {
    return this.logos.find((logo) => logo.id === this.selectedLogo);
  }

  protected getSelectedColor(): ColorPalette | undefined {
    return this.colorPalettes.find((color) => color.id === this.selectedColor);
  }

  protected getSelectedTypography(): TypographyOption | undefined {
    return this.typographyOptions.find(
      (typo) => typo.id === this.selectedTypography
    );
  }

  protected onPrivacyPolicyChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.privacyPolicyChange.emit(checkbox.checked);
  }

  protected onMarketingConsentChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.marketingConsentChange.emit(checkbox.checked);
  }

  protected submitProject(): void {
    this.finalizeProject.emit();
  }
}
