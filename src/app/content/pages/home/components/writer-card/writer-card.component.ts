import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-writer-card',
  imports: [
    NgStyle,
    NgIf
  ],
  templateUrl: './writer-card.component.html',
  standalone: true,
  styleUrl: './writer-card.component.css'
})
export class WriterCardComponent {
  @Input() id!: number;
  @Input() author: string = '';
  @Input() photo: string = '';
  @Input() suscription: number = 0;

  backgroundColor: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const blues = ['#a0d8ef', '#91c9e8', '#7abbe6', '#60aee0', '#429fbc', '#429f95'];
    this.backgroundColor = blues[Math.floor(Math.random() * blues.length)];
  }

  goToWriter() {
    this.router.navigate(['/information/writer', this.id]);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
