import {Component, Input} from '@angular/core';
import {IllustrationProfileComponent} from './illustration-profile/illustration-profile.component';
import {NgForOf} from '@angular/common';
import {ProjectCardComponent} from '../home/components/project-card/project-card.component';
import {PortfolioCardComponent} from '../home/components/portfolio-card/portfolio-card.component';
import {PortfolioProfileComponent} from './portfolio-profile/portfolio-profile.component';
import {BookProfileComponent} from './book-profile/book-profile.component';
import {ProjectProfileComponent} from './project-profile/project-profile.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [
    IllustrationProfileComponent,
    NgForOf,
    PortfolioProfileComponent,
  ],
  templateUrl: './profile.component.html',
  standalone: true,
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profile = {
    name: 'Diego Criollo',
    photo: 'https://media.printler.com/media/photo/178547.jpg?rmode=crop&width=638&height=900',
    subscription: 2 // 1 for Premium, 2 for Standard
  }

  illustrations = [
    {
      id: 1,
      title: 'El Señor de Los Anillos',
      author: 'Diego Criollo',
      image: 'https://media.printler.com/media/photo/178547.jpg?rmode=crop&width=638&height=900',
      rating: 4.5
    },
    {
      id: 2,
      title: 'Harry Potter',
      author: 'J.K. Rowling',
      image: 'https://media.printler.com/media/photo/178547.jpg?rmode=crop&width=638&height=900',
      rating: 4
    },
    {
      id: 3,
      title: 'El Señor de Los Anillos',
      author: 'Diego Criollo',
      image: 'https://media.printler.com/media/photo/178547.jpg?rmode=crop&width=638&height=900',
      rating: 4.5
    },
    {
      id: 4,
      title: 'Harry Potter',
      author: 'J.K. Rowling',
      image: 'https://media.printler.com/media/photo/178547.jpg?rmode=crop&width=638&height=900',
      rating: 4
    },
  ];

  projects2 = [
    {
      id: 1,
      title: 'Proyecto de Animales Fantásticos',
      author: 'María López',
      date: '10/05/2025',
      applicationDate: '12/05/2025',
      imageSrc: 'https://s1.1zoom.me/b5050/281/Fantastic_world_Tigers_Magical_animals_518194_1920x1080.jpg',
      description: 'Este proyecto trata sobre crear cuentos ilustrados con animales fantásticos que enseñen valores a los niños. A través de personajes mágicos y situaciones sorprendentes, se busca estimular la creatividad y la imaginación infantil. Además, se abordarán temas como la empatía, el respeto por la diversidad y la importancia de la amistad en un formato lúdico y educativo que permitirá a los niños aprender mientras se divierten.'
    },
    {
      id: 2,
      title: 'Cuentos sobre la Amistad',
      author: 'Carlos Pérez',
      date: '11/05/2025',
      applicationDate: '12/05/2025',
      imageSrc: 'https://img.freepik.com/vector-gratis/fondo-degradado-celebracion-dia-internacional-amistad_23-2150515715.jpg',
      description: 'En este proyecto exploraremos historias sobre la amistad para fomentar la empatía y la solidaridad en la infancia. A través de narraciones emotivas y personajes entrañables, los niños descubrirán el valor del compañerismo, el trabajo en equipo y la importancia de apoyarse mutuamente. Cada cuento estará diseñado para provocar reflexión y diálogo tanto en casa como en el aula.'
    },
    {
      id: 3,
      title: 'Historias de Inclusión y Diversidad',
      author: 'Lucía Fernández',
      date: '12/05/2025',
      applicationDate: '12/05/2025',
      imageSrc: 'https://static.vecteezy.com/system/resources/previews/023/967/493/large_2x/world-day-for-cultural-diversity-for-dialogue-and-development-abstract-illustration-generative-ai-photo.jpg',
      description: 'Este proyecto tiene como objetivo desarrollar cuentos ilustrados que promuevan la inclusión y el respeto por las diferencias. A través de relatos protagonizados por niños y niñas de diferentes culturas, capacidades y contextos, se busca construir una visión más abierta y comprensiva del mundo. El enfoque será pedagógico y emocional, incorporando actividades complementarias para padres y educadores.'
    },
    {
      id: 4,
      title: 'Historias de Inclusión y Diversidad',
      author: 'Lucía Fernández',
      date: '12/05/2025',
      applicationDate: '12/05/2025',
      imageSrc: 'https://static.vecteezy.com/system/resources/previews/023/967/493/large_2x/world-day-for-cultural-diversity-for-dialogue-and-development-abstract-illustration-generative-ai-photo.jpg',
      description: 'Este proyecto tiene como objetivo desarrollar cuentos ilustrados que promuevan la inclusión y el respeto por las diferencias. A través de relatos protagonizados por niños y niñas de diferentes culturas, capacidades y contextos, se busca construir una visión más abierta y comprensiva del mundo. El enfoque será pedagógico y emocional, incorporando actividades complementarias para padres y educadores.'
    },
    {
      id: 5,
      title: 'Historias de Inclusión y Diversidad',
      author: 'Lucía Fernández',
      date: '12/05/2025',
      applicationDate: '12/05/2025',
      imageSrc: 'https://static.vecteezy.com/system/resources/previews/023/967/493/large_2x/world-day-for-cultural-diversity-for-dialogue-and-development-abstract-illustration-generative-ai-photo.jpg',
      description: 'Este proyecto tiene como objetivo desarrollar cuentos ilustrados que promuevan la inclusión y el respeto por las diferencias. A través de relatos protagonizados por niños y niñas de diferentes culturas, capacidades y contextos, se busca construir una visión más abierta y comprensiva del mundo. El enfoque será pedagógico y emocional, incorporando actividades complementarias para padres y educadores.'
    },
    {
      id: 6,
      title: 'Historias de Inclusión y Diversidad',
      author: 'Lucía Fernández',
      date: '12/05/2025',
      applicationDate: '12/05/2025',
      imageSrc: 'https://static.vecteezy.com/system/resources/previews/023/967/493/large_2x/world-day-for-cultural-diversity-for-dialogue-and-development-abstract-illustration-generative-ai-photo.jpg',
      description: 'Este proyecto tiene como objetivo desarrollar cuentos ilustrados que promuevan la inclusión y el respeto por las diferencias. A través de relatos protagonizados por niños y niñas de diferentes culturas, capacidades y contextos, se busca construir una visión más abierta y comprensiva del mundo. El enfoque será pedagógico y emocional, incorporando actividades complementarias para padres y educadores.'
    },
    {
      id: 7,
      title: 'Historias de Inclusión y Diversidad',
      author: 'Lucía Fernández',
      date: '12/05/2025',
      applicationDate: '12/05/2025',
      imageSrc: 'https://static.vecteezy.com/system/resources/previews/023/967/493/large_2x/world-day-for-cultural-diversity-for-dialogue-and-development-abstract-illustration-generative-ai-photo.jpg',
      description: 'Este proyecto tiene como objetivo desarrollar cuentos ilustrados que promuevan la inclusión y el respeto por las diferencias. A través de relatos protagonizados por niños y niñas de diferentes culturas, capacidades y contextos, se busca construir una visión más abierta y comprensiva del mundo. El enfoque será pedagógico y emocional, incorporando actividades complementarias para padres y educadores.'
    },
    {
      id: 8,
      title: 'Historias de Inclusión y Diversidad',
      author: 'Lucía Fernández',
      date: '12/05/2025',
      applicationDate: '12/05/2025',
      imageSrc: 'https://static.vecteezy.com/system/resources/previews/023/967/493/large_2x/world-day-for-cultural-diversity-for-dialogue-and-development-abstract-illustration-generative-ai-photo.jpg',
      description: 'Este proyecto tiene como objetivo desarrollar cuentos ilustrados que promuevan la inclusión y el respeto por las diferencias. A través de relatos protagonizados por niños y niñas de diferentes culturas, capacidades y contextos, se busca construir una visión más abierta y comprensiva del mundo. El enfoque será pedagógico y emocional, incorporando actividades complementarias para padres y educadores.'
    },
    {
      id: 9,
      title: 'Historias de Inclusión y Diversidad',
      author: 'Lucía Fernández',
      date: '12/05/2025',
      applicationDate: '12/05/2025',
      imageSrc: 'https://static.vecteezy.com/system/resources/previews/023/967/493/large_2x/world-day-for-cultural-diversity-for-dialogue-and-development-abstract-illustration-generative-ai-photo.jpg',
      description: 'Este proyecto tiene como objetivo desarrollar cuentos ilustrados que promuevan la inclusión y el respeto por las diferencias. A través de relatos protagonizados por niños y niñas de diferentes culturas, capacidades y contextos, se busca construir una visión más abierta y comprensiva del mundo. El enfoque será pedagógico y emocional, incorporando actividades complementarias para padres y educadores.'
    }
  ];

  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/login']);
  }

  @Input() name: string = '';
  @Input() photo: string = '';
  @Input() subscription: number = 0;

  getSubscriptionLabel(subscription: number): string {
    return subscription === 1 || subscription === 2
      ? 'Usuario Premium'
      : 'Usuario Estándar';
  }

}
