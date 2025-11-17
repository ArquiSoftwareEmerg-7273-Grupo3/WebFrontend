import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-application-card',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './application-card.component.html',
  styleUrl: './application-card.component.css'
})
export class ApplicationCardComponent {
  @Input() title!: string;
  @Input() author!: string;
  @Input() dateApplication!: string;
  @Input() imageSrc!: string;
  @Input() state!: string;
  @Input() id!: number;

  constructor(private router: Router) {}

  goToProject(): void {
    if (this.state === 'Rechazado') return;
    this.router.navigate(['/information/project', this.id]);
  }

  getStateClass(): string {
    const stateLower = this.state.toLowerCase();
    if (stateLower.includes('pendiente')) return 'state-pending';
    if (stateLower.includes('aprobado') || stateLower.includes('aceptado')) return 'state-approved';
    if (stateLower.includes('rechazado')) return 'state-rejected';
    return 'state-default';
  }

  getStateIcon(): string {
    const stateLower = this.state.toLowerCase();
    if (stateLower.includes('pendiente')) return 'schedule';
    if (stateLower.includes('aprobado') || stateLower.includes('aceptado')) return 'check_circle';
    if (stateLower.includes('rechazado')) return 'cancel';
    return 'help';
  }

}
