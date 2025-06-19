import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatMessage } from '../../../../../models/deployment.model';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ai-assistant.html',
  styleUrl: './ai-assistant.css',
})
export class AiAssistant {
  readonly deploymentForm = input.required<FormGroup>();
  readonly chatMessages = input<ChatMessage[]>([]);
  readonly aiPrompt = input<string>('');
  readonly aiIsThinking = input<boolean>(false);
  readonly isFormValid = input<boolean>(false);

  readonly onPromptChange = output<string>();
  readonly onSendAiPrompt = output<void>();
  readonly onCreateDeployment = output<void>();
  readonly onResetView = output<void>();

  protected readonly currentPrompt = signal<string>('');

  protected updatePrompt(prompt: string): void {
    this.currentPrompt.set(prompt);
    this.onPromptChange.emit(prompt);
  }

  protected sendAiPrompt(): void {
    this.onSendAiPrompt.emit();
  }

  protected createDeployment(): void {
    this.onCreateDeployment.emit();
  }
}
