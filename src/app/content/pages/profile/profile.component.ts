import {Component, Input, OnInit} from '@angular/core';
import {AsyncPipe, KeyValuePipe, NgClass, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../login/services/authentication.service';
import {Usuario} from './model/usuario.entity';
import {PopupRegistroIlustradorService} from './services/popup-registro-ilustrador.service';
import {UserInfoResponse} from '../login/model/user-info.response';
import {UserRoleUtils} from '../login/services/user-role.utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  perfil: Usuario = {
    usuario: '',
    nombre: '',
    apellido: '',
    ubicacion: '',
    descripcion: '',
    foto: '',
    redesSociales: {
      additionalProp1: '',
      additionalProp2: '',
      additionalProp3: ''
    },
    rol: '',
  }

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

  constructor(
    private popupService: PopupRegistroIlustradorService,
    private router: Router,
    private authService: AuthenticationService
  ) {
  }

  async ngOnInit() {
    try {
      const user: UserInfoResponse | null = await this.authService.getUserInformation();

      const role = user ? UserRoleUtils.getUserRole(user) : 'GENERAL';
      if (role === 'GENERAL') {
        this.popupService.openPopup();
      }

      if (!user) return;

        this.perfil.usuario = user.username;
        this.perfil.nombre = user.nombres;
        this.perfil.apellido = user.apellidos;
        this.perfil.ubicacion = user.ubicacion;
        this.perfil.descripcion = user.descripcion;
        this.perfil.foto = user.foto ?? 'https://i.pinimg.com/736x/e5/91/dc/e591dc82326cc4c86578e3eeecced792.jpg';
        this.perfil.redesSociales.additionalProp1 = user.redesSociales.additionalProp1 ?? '';
        this.perfil.redesSociales.additionalProp2 = user.redesSociales.additionalProp2 ?? '';
        this.perfil.redesSociales.additionalProp3 = user.redesSociales.additionalProp3 ?? '';
        this.perfil.rol = user.roleName;

        if (role === 'ILLUSTRATOR') {
          this.perfil.rol = 'Ilustrador';
        } else if (role === 'WRITER') {
          this.perfil.rol = 'Escritor';
        } else {
          this.perfil.rol = 'Usuario';
        }

      } catch(err) {
        console.warn('No se pudo cargar la información del usuario en el perfil:', err);
      }
  }

  goToIlustradorForm() {
    this.router.navigate(['register/illustrator']);
  }

}
