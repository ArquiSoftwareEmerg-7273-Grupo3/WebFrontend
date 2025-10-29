
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthenticationService} from '../../services/authentication.service';
import {SignUpRequest} from '../../model/sign-up.request';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
  form!: FormGroup;
  showPassword = false;
  submitted = false;
  step: number = 1; // <-- Etapa del registro

  // Campos básicos
  username = '';
  password = '';
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

  availableSocialNetworks = [
    { 
      id: 'additionalProp1',
      name: 'Instagram',
      icon: 'fab fa-instagram'
    },
    {
      id: 'additionalProp2',
      name: 'Twitter',
      icon: 'fab fa-x-twitter'
    },
    {
      id: 'additionalProp3',
      name: 'LinkedIn',
      icon: 'fab fa-linkedin'
    }
  ];

  constructor(
    private builder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}


  ngOnInit(): void {
    this.form = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      ubicacion: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      foto: [''],
      descripcion: [''],
      additionalProp1: [''],
      additionalProp2: [''],
      additionalProp3: ['']
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToNextStep() {
    // Paso 1: datos básicos
    if (this.step === 1) {
      if (!this.form.get('username')?.value || !this.form.get('nombres')?.value || 
          !this.form.get('apellidos')?.value || !this.form.get('password')?.value) {
        alert("Completa todos los campos obligatorios.");
        return;
      }
      this.step = 2;
      return;
    }
    // Paso 2: información adicional
    if (this.step === 2) {
      if (!this.form.get('ubicacion')?.value) {
        alert("Completa la ubicación.");
        return;
      }
      this.step = 3;
      return;
    }
    // Paso 3: contacto
    if (this.step === 3) {
      if (!this.form.get('telefono')?.value || !this.form.get('fechaNacimiento')?.value) {
        alert("Completa el teléfono y fecha de nacimiento.");
        return;
      }
      this.step = 4;
      return;
    }
  }

  onSubmitFinal() {
    const formData = this.form.value;

    // Crear el objeto de registro siguiendo la interfaz SignUpRequest
    const signUpRequest: SignUpRequest = {
      username: formData.username,
      password: formData.password,
      ubicacion: formData.ubicacion,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      telefono: formData.telefono,
      foto: formData.foto || undefined,
      descripcion: formData.descripcion,
      fechaNacimiento: formData.fechaNacimiento,
      redesSociales: {
        additionalProp1: formData.additionalProp1 || undefined,
        additionalProp2: formData.additionalProp2 || undefined,
        additionalProp3: formData.additionalProp3 || undefined
      }
    };

    this.authenticationService.signUp(signUpRequest)
      .then(() => {
        console.log('Registro exitoso');
      })
      .catch(error => {
        console.error('Error en el registro:', error);
      });
  }
}
