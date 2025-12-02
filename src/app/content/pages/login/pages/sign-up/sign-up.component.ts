
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {AuthenticationService} from '../../services/authentication.service';
import {SignUpRequest} from '../../model/sign-up.request';
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {trigger, transition, style, animate} from '@angular/animations';

@Component({
  selector: 'app-sign-up',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(-20px)' }))
      ])
    ])
  ]
})
export class SignUpComponent implements OnInit {
  form!: FormGroup;
  showPassword = false;
  submitted = false;
  step: number = 1; // <-- Etapa del registro
  selectedFileName: string = ''; // Nombre del archivo seleccionado
  selectedFile: File | null = null; // Archivo seleccionado

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
    private router: Router,
    private http: HttpClient
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

  /**
   * Manejar selección de archivo de imagen
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file: File | null = input.files?.[0] || null;
    
    if (!file) return;
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }
    
    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('La imagen no debe superar los 10MB');
      return;
    }
    
    this.selectedFile = file;
    this.selectedFileName = file.name;
    

    // Subir la imagen al backend
    this.uploadImage(file);
  }

  /**
   * Subir imagen al backend usando el endpoint de media
   */
  private uploadImage(file: File): void {
    const formData = new FormData();
    formData.append('file', file);


    this.http.post('http://localhost:8080/api/v1/media/upload', formData).subscribe({
      next: (response: any) => {
        
        // Guardar la URL completa en el formulario
        const imageUrl = 'http://localhost:8080' + response.url;
        this.form.patchValue({ foto: imageUrl });
        
       
      },
      error: (error) => {
        console.error('❌ Error al subir imagen:', error);
        
        // Limpiar selección en caso de error
        this.selectedFile = null;
        this.selectedFileName = '';
      }
    });
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

  goToPreviousStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  getStepTitle(): string {
    switch (this.step) {
      case 1:
        return 'Crea tu cuenta';
      case 2:
        return '¿Dónde te encuentras?';
      case 3:
        return 'Información de contacto';
      case 4:
        return 'Completa tu perfil';
      default:
        return 'Registro';
    }
  }

  getStepDescription(): string {
    switch (this.step) {
      case 1:
        return 'Completa tus datos básicos para comenzar';
      case 2:
        return 'Cuéntanos tu ubicación';
      case 3:
        return 'Agrega tu información de contacto';
      case 4:
        return 'Personaliza tu perfil (opcional)';
      default:
        return '';
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
      })
      .catch(error => {
        console.error('Error en el registro:', error);
      });
  }
}
