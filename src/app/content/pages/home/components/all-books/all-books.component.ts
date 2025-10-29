import { Component } from '@angular/core';
import {Location, NgForOf} from '@angular/common';
import {ProjectCardComponent} from '../project-card/project-card.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BookCardComponent} from '../book-card/book-card.component';

@Component({
  selector: 'app-all-books',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    BookCardComponent,
    FormsModule
  ],
  templateUrl: './all-books.component.html',
  standalone: true,
  styleUrl: './all-books.component.css'
})
export class AllBooksComponent {
  books = [
    {
      id: 1,
      title: 'El Señor de Los Anillos',
      author: 'Diego Criollo',
      image: 'https://es.web.img2.acsta.net/c_310_420/medias/nmedia/18/89/67/45/20061512.jpg'
    },
    {
      id: 2,
      title: 'El Señor de Los Anillos',
      author: 'Diego Criollo',
      image: 'https://es.web.img2.acsta.net/c_310_420/medias/nmedia/18/89/67/45/20061512.jpg'
    },
    {
      id: 3,
      title: 'El Señor de Los Anillos',
      author: 'Diego Criollo',
      image: 'https://es.web.img2.acsta.net/c_310_420/medias/nmedia/18/89/67/45/20061512.jpg'
    },
    {
      id: 4,
      title: 'El Señor de Los Anillos',
      author: 'Diego Criollo',
      image: 'https://es.web.img2.acsta.net/c_310_420/medias/nmedia/18/89/67/45/20061512.jpg'
    },
    {
      id: 5,
      title: 'El Señor de Los Anillos',
      author: 'Diego Criollo',
      image: 'https://es.web.img2.acsta.net/c_310_420/medias/nmedia/18/89/67/45/20061512.jpg'
    },
    {
      id: 6,
      title: 'El Señor de Los Anillos',
      author: 'Diego Criollo',
      image: 'https://es.web.img2.acsta.net/c_310_420/medias/nmedia/18/89/67/45/20061512.jpg'
    },
    {
      id: 7,
      title: 'El Señor de Los Anillos',
      author: 'Diego Criollo',
      image: 'https://es.web.img2.acsta.net/c_310_420/medias/nmedia/18/89/67/45/20061512.jpg'
    },
    {
      id: 8,
      title: 'El Señor de Los Anillos',
      author: 'Diego Criollo',
      image: 'https://es.web.img2.acsta.net/c_310_420/medias/nmedia/18/89/67/45/20061512.jpg'
    },
  ];
  searchQuery: string = '';
  filteredBooks = [...this.books];

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  filterProjects() {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetSearch() {
    this.searchQuery = '';
    this.filteredBooks = [...this.books];
  }
}
