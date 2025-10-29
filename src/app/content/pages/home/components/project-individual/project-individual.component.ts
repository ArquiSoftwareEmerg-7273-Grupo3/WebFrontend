import {Component, OnInit} from '@angular/core';
import {Location, NgForOf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {WriterCardComponent} from "../writer-card/writer-card.component";
import {ActivatedRoute, RouterLink} from '@angular/router';

@Component({
  selector: 'app-project-individual',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './project-individual.component.html',
  standalone: true,
  styleUrl: './project-individual.component.css'
})
export class ProjectIndividualComponent implements OnInit {

  title = '';
  imageSrc = '';
  description = '';
  author = '';
  publishDate = '';
  authorPhoto = '';
  authorId: number = 0;

  projects = [
    {
      id: 1,
      title: 'Proyecto de Animales Fantásticos',
      author: 'María López',
      writer_id: 1,
      authorPhoto: 'https://randomuser.me/api/portraits/women/1.jpg',
      date: '10/05/2025',
      imageSrc: 'https://s1.1zoom.me/b5050/281/Fantastic_world_Tigers_Magical_animals_518194_1920x1080.jpg',
      description: 'Este proyecto consiste en la creación de un libro ilustrado para niños de entre 4 y 8 años, que combina narrativa sencilla, valores formativos y un universo visual encantador. El objetivo es fomentar la lectura temprana, la imaginación y la enseñanza de valores como la amistad, la empatía y el respeto por la naturaleza.\n' +
        '\n' +
        'La historia sigue a Luma, una pequeña zorra curiosa, y sus amigos del bosque, quienes descubren que los colores del bosque están desapareciendo misteriosamente. Juntos, emprenden una aventura para encontrar la causa y devolverle la alegría al lugar donde viven. A lo largo de su viaje, los personajes enfrentan desafíos que les enseñan a trabajar en equipo, expresar sus emociones y valorar sus diferencias.\n' +
        '\n' +
        'El libro tendrá aproximadamente 32 páginas, con ilustraciones a todo color, estilo acuarela y texto en letra grande y clara para facilitar la lectura o el acompañamiento de un adulto. Incluirá también actividades al final para reforzar el mensaje de la historia. El proyecto busca conectar con niños de distintas realidades, promoviendo un mensaje universal de inclusión, esperanza y amor por el entorno natural.'
    },
    {
      id: 2,
      title: 'Cuentos sobre la Amistad',
      author: 'Carlos Pérez',
      writer_id: 1,
      authorPhoto: 'https://randomuser.me/api/portraits/men/1.jpg',
      date: '11/05/2025',
      imageSrc: 'https://img.freepik.com/vector-gratis/fondo-degradado-celebracion-dia-internacional-amistad_23-2150515715.jpg',
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
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    const project = this.projects.find(p => p.id === projectId);

    if (project) {
      this.title = project.title;
      this.imageSrc = project.imageSrc;
      this.description = project.description;
      this.author = project.author;
      this.publishDate = project.date;
      this.authorPhoto = project.authorPhoto;
      this.authorId = project.writer_id;
    }
  }

  goBack() {
    this.location.back();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

