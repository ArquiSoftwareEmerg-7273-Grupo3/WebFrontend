import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Location, NgForOf, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-book-individual',
  imports: [
    RouterLink,
    NgSwitch,
    NgForOf,
    NgSwitchDefault,
    NgSwitchCase,
    FormsModule
  ],
  templateUrl: './book-individual.component.html',
  standalone: true,
  styleUrl: './book-individual.component.css'
})
export class BookIndividualComponent implements OnInit {

  title = '';
  imageSrc = '';
  description = '';
  author = '';
  publishDate = '';
  authorPhoto = '';
  authorId: number = 0;
  averageRating: number = 0;
  selectedRating: number = 0;
  newComment: string = '';

  reviews = [
    { rating: 5, user: 'Diego Sandero', comment: 'Esta muy piola tu dibujo hijo mio' },
    { rating: 3.5, user: 'Diego Sandero', comment: 'Esta muy piola tu dibujo hijo mio' },
  ];

  books = [
    {
      id: 1,
      title: 'Proyecto de Animales Fantásticos',
      author: 'María López',
      writer_id: 1,
      authorPhoto: 'https://randomuser.me/api/portraits/women/1.jpg',
      date: '10/05/2025',
      imageSrc: 'https://s1.1zoom.me/b5050/281/Fantastic_world_Tigers_Magical_animals_518194_1920x1080.jpg',
      description: 'En este proyecto exploraremos historias sobre la amistad para fomentar la empatía...'
    },
    {
      id: 2,
      title: 'Cuentos sobre la Amistad',
      author: 'Carlos Pérez',
      writer_id: 1,
      authorPhoto: 'https://randomuser.me/api/portraits/men/1.jpg',
      date: '11/05/2025',
      imageSrc: 'https://img.freepik.com/vector-gratis/vector-ilustracion-vintage-collage-arte-tecnica-mixta-imprimible_53876-136402.jpg?semt=ais_hybrid&w=740',
      description: 'En este proyecto exploraremos historias sobre la amistad para fomentar la empatía...'
    },
    {
      id: 3,
      title: 'Historias de Inclusión y Diversidad',
      author: 'Lucía Fernández',
      writer_id: 1,
      authorPhoto: 'https://randomuser.me/api/portraits/women/2.jpg',
      date: '12/05/2025',
      imageSrc: 'https://static.vecteezy.com/system/resources/previews/023/967/493/large_2x/world-day-for-cultural-diversity-for-dialogue-and-development-abstract-illustration-generative-ai-photo.jpg',
      description: 'Este proyecto tiene como objetivo desarrollar cuentos ilustrados que promuevan la inclusión...'
    }
  ];

  constructor(private location: Location, private route: ActivatedRoute) {}

  ngOnInit() {
    const bookId = Number(this.route.snapshot.paramMap.get('id'));
    const book = this.books.find(p => p.id === bookId);

    if (book) {
      this.title = book.title;
      this.imageSrc = book.imageSrc;
      this.description = book.description;
      this.author = book.author;
      this.publishDate = book.date;
      this.authorPhoto = book.authorPhoto;
      this.authorId = book.writer_id;
    }

    // Calcular el promedio dinámicamente
    if (this.reviews.length > 0) {
      const total = this.reviews.reduce((acc, r) => acc + r.rating, 0);
      this.averageRating = parseFloat((total / this.reviews.length).toFixed(1));
    } else {
      this.averageRating = 0;
    }
  }


  goBack() {
    this.location.back();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getStarType(value: number): string {
    if (value % 1 >= 0.75) return 'full';
    if (value % 1 >= 0.25) return 'half';
    return 'empty';
  }

  getStarArray(rating: number): string[] {
    const result: string[] = [];
    let fullStars = Math.floor(rating);
    let hasHalf = rating % 1 >= 0.25 && rating % 1 < 0.75;
    for (let i = 0; i < fullStars; i++) result.push('full');
    if (hasHalf) result.push('half');
    while (result.length < 5) result.push('empty');
    return result;
  }

  selectRating(value: number) {
    this.selectedRating = value;
  }
}
