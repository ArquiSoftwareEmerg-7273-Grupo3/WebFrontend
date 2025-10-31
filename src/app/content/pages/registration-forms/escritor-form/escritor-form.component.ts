import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProfileRegistrationService} from '../services/profile-registration.service';
import {Ilustrador} from '../../profile/model/ilustrador.entity';
import {Escritor} from '../../profile/model/escritor.entity';
import {NgIf} from '@angular/common';

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

  constructor(
    private fb: FormBuilder,
    private profileRegistrationService: ProfileRegistrationService
  ) {
    this.form = this.fb.group({
      razonSocial: [''],
      ruc: ['', [Validators.pattern(/^\d{8,11}$/)]],
      nombreComercial: [''],
      sitioWeb: ['', Validators.pattern(/^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/.*)?$/i)],
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
}
