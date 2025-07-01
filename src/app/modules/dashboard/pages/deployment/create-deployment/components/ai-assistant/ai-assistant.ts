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
  readonly deploymentForm = signal<FormGroup>(new FormGroup({}));
  readonly chatMessages = signal<ChatMessage[]>([]);
  readonly aiPrompt = signal<string>('');
  readonly aiIsThinking = signal<boolean>(false);
  readonly isFormValid = signal<boolean>(false);

  protected readonly currentPrompt = signal<string>('');

  protected sendAiPrompt(): void {}

  protected createDeployment(): void {}
  protected updatePrompt(prompt: string): void {
    this.currentPrompt.set(prompt);
  }
}
