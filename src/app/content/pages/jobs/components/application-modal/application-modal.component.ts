import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectoResource } from '../../model/proyecto.model';

export interface ApplicationData {
  coverLetter: string;
  estimatedTime: string;
  proposedBudget?: number;
  portfolioLinks: string[];
  answers: { question: string; answer: string }[];
}

@Component({
  selector: 'app-application-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './application-modal.component.html',
  styleUrl: './application-modal.component.css'
})
export class ApplicationModalComponent {
  @Input() project!: ProyectoResource;
  @Input() isPremium: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<ApplicationData>();

  currentStep: number = 1;
  totalSteps: number = 4;

  // Datos del formulario
  coverLetter: string = '';
  estimatedTime: string = '';
  proposedBudget?: number;
  portfolioLinks: string[] = [''];
  
  // Preguntas predefinidas
  questions = [
    { question: '¿Cuál es tu experiencia en proyectos similares?', answer: '' },
    { question: '¿Qué herramientas y técnicas utilizarías?', answer: '' },
    { question: '¿Tienes disponibilidad para reuniones de seguimiento?', answer: '' }
  ];

  closeModal(): void {
    this.close.emit();
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  canProceed(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.coverLetter.trim().length >= 50;
      case 2:
        return this.estimatedTime.trim().length > 0;
      case 3:
        return this.questions.every(q => q.answer.trim().length > 0);
      case 4:
        return true;
      default:
        return false;
    }
  }

  addPortfolioLink(): void {
    this.portfolioLinks.push('');
  }

  removePortfolioLink(index: number): void {
    this.portfolioLinks.splice(index, 1);
  }

  submitApplication(): void {
    const applicationData: ApplicationData = {
      coverLetter: this.coverLetter,
      estimatedTime: this.estimatedTime,
      proposedBudget: this.proposedBudget,
      portfolioLinks: this.portfolioLinks.filter(link => link.trim().length > 0),
      answers: this.questions.map(q => ({ question: q.question, answer: q.answer }))
    };
    
    this.submit.emit(applicationData);
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }
}
