import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ProjectCardComponent} from "../home/components/project-card/project-card.component";
import {ApplicationCardComponent} from './components/application-card/application-card.component';
import {
  ApplicationCardReceivedComponent
} from './components/application-card-received/application-card-received.component';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [
    NgForOf,
    ApplicationCardComponent,
  ],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css'
})
export class ApplicationsComponent implements OnInit {

  role: string = '';


  projects = [
    {
      id: 1,
      title: 'Proyecto de Animales Fantásticos',
      author: 'María López',
      date: '10/05/2025',
      applicationDate: '12/05/2025',
      state: 'Pendiente',
      imageSrc: 'https://s1.1zoom.me/b5050/281/Fantastic_world_Tigers_Magical_animals_518194_1920x1080.jpg',
      description: 'Este proyecto trata sobre crear cuentos ilustrados con animales fantásticos que enseñen valores a los niños. A través de personajes mágicos y situaciones sorprendentes, se busca estimular la creatividad y la imaginación infantil. Además, se abordarán temas como la empatía, el respeto por la diversidad y la importancia de la amistad en un formato lúdico y educativo que permitirá a los niños aprender mientras se divierten.'
    },
    {
      id: 2,
      title: 'Cuentos sobre la Amistad',
      author: 'Carlos Pérez',
      date: '11/05/2025',
      applicationDate: '12/05/2025',
      state: 'Pendiente',
      imageSrc: 'https://img.freepik.com/vector-gratis/fondo-degradado-celebracion-dia-internacional-amistad_23-2150515715.jpg',
      description: 'En este proyecto exploraremos historias sobre la amistad para fomentar la empatía y la solidaridad en la infancia. A través de narraciones emotivas y personajes entrañables, los niños descubrirán el valor del compañerismo, el trabajo en equipo y la importancia de apoyarse mutuamente. Cada cuento estará diseñado para provocar reflexión y diálogo tanto en casa como en el aula.'
    },
    {
      id: 3,
      title: 'Historias de Inclusión y Diversidad',
      author: 'Lucía Fernández',
      date: '12/05/2025',
      applicationDate: '12/05/2025',
      state: 'Rechazado',
      imageSrc: 'https://static.vecteezy.com/system/resources/previews/023/967/493/large_2x/world-day-for-cultural-diversity-for-dialogue-and-development-abstract-illustration-generative-ai-photo.jpg',
      description: 'Este proyecto tiene como objetivo desarrollar cuentos ilustrados que promuevan la inclusión y el respeto por las diferencias. A través de relatos protagonizados por niños y niñas de diferentes culturas, capacidades y contextos, se busca construir una visión más abierta y comprensiva del mundo. El enfoque será pedagógico y emocional, incorporando actividades complementarias para padres y educadores.'
    }
  ];

  applications = [
    {
      id: 1,
      title: 'Proyecto de Animales Fantásticos',
      author: 'Diego Perez',
      date: '10/05/2025',
      applicationDate: '12/05/2025',
      state: 'Pendiente',
      imageSrc: 'https://fundacionjuanjotorrejon.org/wp-content/uploads/2020/06/cuentos-1080x675.jpg',
      description: 'Este proyecto trata sobre crear cuentos ilustrados con animales fantásticos que enseñen valores a los niños. A través de personajes mágicos y situaciones sorprendentes, se busca estimular la creatividad y la imaginación infantil. Además, se abordarán temas como la empatía, el respeto por la diversidad y la importancia de la amistad en un formato lúdico y educativo que permitirá a los niños aprender mientras se divierten.'
    },
    {
      id: 2,
      title: 'Cuentos sobre la Amistad',
      author: 'Ramiro Pérez',
      date: '11/05/2025',
      applicationDate: '12/05/2025',
      state: 'Pendiente',
      imageSrc: 'https://vocalialogopedia.com/wp-content/uploads/2022/11/3583238-scaled.jpg',
      description: 'En este proyecto exploraremos historias sobre la amistad para fomentar la empatía y la solidaridad en la infancia. A través de narraciones emotivas y personajes entrañables, los niños descubrirán el valor del compañerismo, el trabajo en equipo y la importancia de apoyarse mutuamente. Cada cuento estará diseñado para provocar reflexión y diálogo tanto en casa como en el aula.'
    },
    {
      id: 3,
      title: 'Historias de Inclusión y Diversidad',
      author: 'Cristian Fernández',
      date: '12/05/2025',
      applicationDate: '12/05/2025',
      state: 'Rechazado',
      imageSrc: 'https://www.magisnet.com/wp-content/uploads/2019/02/storytelling.jpg',
      description: 'Este proyecto tiene como objetivo desarrollar cuentos ilustrados que promuevan la inclusión y el respeto por las diferencias. A través de relatos protagonizados por niños y niñas de diferentes culturas, capacidades y contextos, se busca construir una visión más abierta y comprensiva del mundo. El enfoque será pedagógico y emocional, incorporando actividades complementarias para padres y educadores.'
    }
  ];
  ngOnInit() {
    const storedRole = localStorage.getItem('role');
    this.role = storedRole === '1' ? 'Ilustrador' : storedRole === '2' ? 'Escritor' : 'Invitado';
  }

}
