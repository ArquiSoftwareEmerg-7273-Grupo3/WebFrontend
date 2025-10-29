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

}
