import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-portfolio-profile',
  imports: [],
  templateUrl: './portfolio-profile.component.html',
  standalone: true,
  styleUrl: './portfolio-profile.component.css'
})
export class PortfolioProfileComponent {
  @Input() id!: number;
  @Input() imageSrc: string = '';
  @Input() author: string = '';
  @Input() title: string = '';

  constructor(private router: Router) {}

  goToPortfolio() {
    this.router.navigate(['/information/portfolio', this.id]);
  }
}
