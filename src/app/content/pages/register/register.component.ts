import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

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
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  showPassword = false;
  selectedRole: number | null = null;

  constructor(private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onRegister() {
    // Validación simple (puedes mejorarla según necesidades)
    if (
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.email.trim() ||
      !this.password.trim() ||
      this.selectedRole === null
    ) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Aquí iría la lógica real para registrar con el backend
    console.log({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      role: this.selectedRole,
    });

    // Redirigir al login y prevenir regreso con el botón "atrás"
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
