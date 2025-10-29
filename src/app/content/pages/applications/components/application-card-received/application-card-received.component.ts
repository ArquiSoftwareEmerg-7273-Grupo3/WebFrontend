import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-application-card-received',
  standalone: true,
  imports: [],
  templateUrl: './application-card-received.component.html',
  styleUrl: './application-card-received.component.css'
})
export class ApplicationCardReceivedComponent {
  @Input() title!: string;
  @Input() author!: string;
  @Input() dateApplication!: string;
  @Input() imageSrc!: string;
  @Input() id!: number;

  constructor() {}

  acceptApplication(): void {
    alert(`La postulación de ${this.author} ha sido aceptada.`);
  }

  rejectApplication(): void {
    alert(`La postulación de ${this.author} ha sido rechazada.`);
  }
}
