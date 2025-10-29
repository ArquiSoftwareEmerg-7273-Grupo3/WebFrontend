import {Component, OnInit} from '@angular/core';
import {IllustrationProfileComponent} from "../../../profile/illustration-profile/illustration-profile.component";
import {NgForOf} from "@angular/common";
import {PortfolioProfileComponent} from "../../../profile/portfolio-profile/portfolio-profile.component";
import {BookProfileComponent} from '../../../profile/book-profile/book-profile.component';
import {ProjectProfileComponent} from '../../../profile/project-profile/project-profile.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-writer-individual',
  imports: [
    NgForOf,
    BookProfileComponent,
    ProjectProfileComponent
  ],
  templateUrl: './writer-individual.component.html',
  standalone: true,
  styleUrl: './writer-individual.component.css'
})
export class WriterIndividualComponent implements OnInit {
  writerId!: number;
  profile: any;
  books: any[] = [];
  projects: any[] = [];

  allWriters = [
    {
      id: 1,
      name: 'Diego Criollo',
      photo: 'https://media.printler.com/media/photo/178547.jpg?rmode=crop&width=638&height=900',
      subscription: 2
    },
    {
      id: 2,
      name: 'Lucía Fernández',
      photo: 'https://example.com/photo2.jpg',
      subscription: 1
    }
  ];

  allBooks = [
    {
      id: 1,
      writer_id: 1,
      title: 'El Señor de Los Anillos',
      author: 'Diego Criollo',
      image: 'https://media.printler.com/media/photo/178547.jpg?rmode=crop&width=638&height=900',
      rating: 4.5
    },
    {
      id: 2,
      writer_id: 2,
      title: 'Harry Potter',
      author: 'J.K. Rowling',
      image: 'https://media.printler.com/media/photo/178547.jpg?rmode=crop&width=638&height=900',
      rating: 4
    }
  ];

  allProjects = [
    {
      id: 1,
      writer_id: 1,
      title: 'Proyecto de Animales Fantásticos',
      author: 'María López',
      date: '10/05/2025',
      applicationDate: '12/05/2025',
      imageSrc: 'https://s1.1zoom.me/b5050/281/Fantastic_world_Tigers_Magical_animals_518194_1920x1080.jpg',
      description: 'Este proyecto trata sobre crear cuentos ilustrados con animales fantásticos...'
    },
    {
      id: 2,
      writer_id: 2,
      title: 'Cuentos sobre la Amistad',
      author: 'Carlos Pérez',
      date: '11/05/2025',
      applicationDate: '12/05/2025',
      imageSrc: 'https://img.freepik.com/vector-gratis/fondo-degradado-celebracion-dia-internacional-amistad_23-2150515715.jpg',
      description: 'En este proyecto exploraremos historias sobre la amistad...'
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.writerId = +params['id'];
      this.loadWriterData();
    });
  }

  loadWriterData() {
    this.profile = this.allWriters.find(writer => writer.id === this.writerId) || {};
    this.books = this.allBooks.filter(book => book.writer_id === this.writerId);
    this.projects = this.allProjects.filter(project => project.writer_id === this.writerId);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack() {
    history.back();
  }

  getSubscriptionLabel(subscription: number): string {
    return subscription === 1 ? 'Usuario Premium' : 'Usuario Estándar';
  }
}
