import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {NgForOf, NgStyle, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';

@Component({
  selector: 'app-illustration-profile',
  imports: [
    NgStyle,
    NgForOf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault
  ],
  templateUrl: './illustration-profile.component.html',
  standalone: true,
  styleUrl: './illustration-profile.component.css'
})
export class IllustrationProfileComponent {
  @Input() id!: number;
  @Input() title: string = '';
  @Input() author: string = '';
  @Input() image: string = '';
  @Input() rating: number = 0;

  constructor(private router: Router) {}

  goToIllustration() {
    this.router.navigate(['/information/illustration', this.id]);
  }

  getStarArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }

  getStarType(index: number): 'full' | 'half' | 'empty' {
    const diff = this.rating - index;
    if (diff >= 1) return 'full';
    else if (diff >= 0.25 && diff < 0.75) return 'half';
    else if (diff > 0) return 'half';
    else return 'empty';
  }
}
