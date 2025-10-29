import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";
import {ProjectCardComponent} from "../project-card/project-card.component";
import {FormsModule} from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-all-projects',
  imports: [
    NgForOf,
    ProjectCardComponent,
    FormsModule
  ],
  templateUrl: './all-projects.component.html',
  standalone: true,
  styleUrl: './all-projects.component.css'
})
export class AllProjectsComponent {

  projects = [
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

  searchQuery: string = '';
  filteredProjects = [...this.projects];

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  filterProjects() {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredProjects = this.projects.filter(project =>
      project.title.toLowerCase().includes(query) ||
      project.author.toLowerCase().includes(query)
    );
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetSearch() {
    this.searchQuery = '';
    this.filteredProjects = [...this.projects];
  }

}
