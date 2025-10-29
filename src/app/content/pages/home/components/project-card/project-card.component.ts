import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() id!: number;
  @Input() imageSrc: string = '';
  @Input() author: string = '';
  @Input() title: string = '';

  constructor(private router: Router) {}

  goToProject() {
    this.router.navigate(['/information/project', this.id]);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
