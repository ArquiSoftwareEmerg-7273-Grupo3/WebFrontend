import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgStyle, NgIf } from '@angular/common';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  @Input() id!: number;
  @Input() title: string = '';
  @Input() author: string = '';
  @Input() image: string = '';

  constructor(private router: Router) {}

  goToBook() {
    this.router.navigate(['/information/book', this.id]);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
