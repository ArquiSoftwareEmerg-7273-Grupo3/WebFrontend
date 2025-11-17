import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProfileRegistrationService} from '../services/profile-registration.service';
import {Ilustrador} from '../../profile/model/ilustrador.entity';
import {Escritor} from '../../profile/model/escritor.entity';
import {NgIf} from '@angular/common';
import {AuthenticationService} from '../../login/services/authentication.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-escritor-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './escritor-form.component.html',
  styleUrl: './escritor-form.component.css'
})
export class EscritorFormComponent {
  form: FormGroup;
  image = '';
  selectedFile: File | null = null;
  selectedFileName: string = '';

  constructor(
    private fb: FormBuilder,
    private profileRegistrationService: ProfileRegistrationService,
    private http: HttpClient,
  ) {
    this.form = this.fb.group({
      razonSocial: [''],
      ruc: ['', [Validators.pattern(/^\d{8,11}$/)]],
      nombreComercial: [''],
      sitioWeb: ['', Validators.pattern(/^(ht1tps?:\/\/)?([\w\-]+\.)+[\w\-]+(\/.*)?$/i)],
      logo: [''],
      ubicacionEmpresa: [''],
      tipoEmpresa: ['']
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const e = this.form.value;
    const escritor = new Escritor(
      e.razonSocial,
      e.ruc,
      e.nombreComercial,
      e.sitioWeb,
      e.logo,
      e.ubicacionEmpresa,
      e.tipoEmpresa
    );

    this.profileRegistrationService.registerEscritor(escritor).subscribe({
      next: () => {
        alert('Registro de escritor exitoso');
      },
      error: (err) => {
        console.error('Error al registrar escritor', err);
        alert(`Error al registrar escritor: ${err?.message || err}`);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file: File | null = input.files?.[0] || null;
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('La imagen no debe superar los 10MB');
      return;
    }
    
    this.selectedFile = file;
    this.selectedFileName = file.name;
    

    this.uploadImage(file);
  }


  private uploadImage(file: File): void {
    const formData = new FormData();
    formData.append('file', file);


    this.http.post('http://localhost:8080/api/v1/media/upload', formData).subscribe({
      next: (response: any) => {
        
        const imageUrl = 'http://localhost:8080' + response.url;
        this.form.patchValue({ logo: imageUrl });
        
       
      },
      error: (error) => {
        console.error('Error al subir imagen:', error);
        
        this.selectedFile = null;
        this.selectedFileName = '';
      }
    });
  }
}
