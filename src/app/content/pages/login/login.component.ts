import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthenticationService} from './services/authentication.service';
import {SignInRequest} from './model/sign-in.request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private router: Router, private authService: AuthenticationService) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (!this.username.trim() || !this.password.trim()) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const signInRequest: SignInRequest = {
      username: this.username,
      password: this.password
    };

    this.authService.signIn(signInRequest)
      .then(() => {
      })
      .catch(error => {
        console.error('Error en el login:', error);
        alert('Error al iniciar sesión. Verifica tus credenciales.');
      });
  }
}
