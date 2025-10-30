import {Component, Input, OnInit} from '@angular/core';
import {IllustrationProfileComponent} from './illustration-profile/illustration-profile.component';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ProjectCardComponent} from '../home/components/project-card/project-card.component';
import {PortfolioCardComponent} from '../home/components/portfolio-card/portfolio-card.component';
import {PortfolioProfileComponent} from './portfolio-profile/portfolio-profile.component';
import {BookProfileComponent} from './book-profile/book-profile.component';
import {ProjectProfileComponent} from './project-profile/project-profile.component';
import {ActivatedRoute, Router} from '@angular/router';
import {UsuarioService} from './services/usuario.service';
import {AuthenticationService} from '../login/services/authentication.service';
import {Usuario} from './model/usuario.entity';
import {map, Observable, shareReplay, switchMap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {PopupRegistroIlustradorService} from './services/popup-registro-ilustrador.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    NgForOf,
  ],
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  //perfil$!: Observable<Usuario>;

  // Datos temporales
  perfil: Usuario = {
    usuario: 'romeosantos',
    nombre: 'Romeo',
    apellido: 'Santos',
    ubicacion: 'Lima, Perú',
    descripcion:
      'Ilustrador y diseñador de arte digital. Me enfoco en piezas monocromáticas con trazos finos y textura.',
    foto: 'https://i.pinimg.com/736x/e5/91/dc/e591dc82326cc4c86578e3eeecced792.jpg',
  };

  // publicaciones simuladas
  publicaciones = [
    {
      id: 1,
      titulo: 'Ojo nocturno',
      imagenUrl: 'assets/post-1.jpg',
      descripcion: 'Exploración del subconsciente urbano a través del claroscuro.',
      likes: 48,
      comentarios: 4
    },
    {
      id: 2,
      titulo: 'Raíces del viento',
      imagenUrl: 'assets/post-2.jpg',
      descripcion: 'Trazos generativos que capturan el movimiento del aire y la forma natural.',
      likes: 46,
      comentarios: 5
    },
    {
      id: 3,
      titulo: 'Retrato en tinta',
      imagenUrl: 'assets/post-3.jpg',
      descripcion: 'Estudio de expresiones humanas mediante textura y profundidad.',
      likes: 49,
      comentarios: 6
    }
  ];

  constructor(private popupService: PopupRegistroIlustradorService) {}

  ngOnInit() {
    this.popupService.openPopup();
  }

  /**
  constructor(private http: HttpClient, private route: ActivatedRoute) {
    // Se obtiene el id de la URL y se carga el perfil desde el backend
    this.perfil$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.http.get<Usuario>(`http://localhost:8000/api/usuarios/1/`);
      }),
      // Valores de respaldo para evitar errores
      map(perfil => ({
        fotoUrl: '/assets/avatar-placeholder.png',
        ...perfil,
      })),
      shareReplay(1)
    );
  }
    **/
}
