import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AuthenticationService} from '../login/services/authentication.service';
import {SignUpRequest} from '../login/model/sign-up.request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  // Campos básicos
  username = '';
  password = '';
  ubicacion = '';
  nombres = '';
  apellidos = '';
  telefono = '';
  foto = '';
  descripcion = '';
  fechaNacimiento = '';
  
  // Redes sociales
  redesSociales = {
    additionalProp1: '',
    additionalProp2: '',
    additionalProp3: ''
  };
  
  showPassword = false;
  selectedRole: number | null = null;

  constructor(private router: Router, private authService: AuthenticationService) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onRegister() {
    // Validación simple
    if (
      !this.username.trim() ||
      !this.ubicacion.trim() ||
      !this.nombres.trim() ||
      !this.apellidos.trim() ||
      !this.password.trim() ||
      !this.telefono.trim() ||
      !this.fechaNacimiento.trim()
    ) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Crear el objeto de registro
    const signUpRequest: SignUpRequest = {
      username: this.username,
      password: this.password,
      ubicacion: this.ubicacion,
      nombres: this.nombres,
      apellidos: this.apellidos,
      telefono: this.telefono,
      foto: this.foto || undefined,
      descripcion: this.descripcion,
      fechaNacimiento: this.fechaNacimiento,
      redesSociales: {
        additionalProp1: this.redesSociales.additionalProp1 || undefined,
        additionalProp2: this.redesSociales.additionalProp2 || undefined,
        additionalProp3: this.redesSociales.additionalProp3 || undefined
      }
    };

    // Registrar usuario
    this.authService.signUp(signUpRequest)
      .then(() => {
        console.log('Registro exitoso');
      })
      .catch(error => {
        console.error('Error en el registro:', error);
      });
  }
}
