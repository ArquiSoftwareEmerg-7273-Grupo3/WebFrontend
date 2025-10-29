import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-project-profile',
  imports: [],
  templateUrl: './project-profile.component.html',
  standalone: true,
  styleUrl: './project-profile.component.css'
})
export class ProjectProfileComponent {
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
