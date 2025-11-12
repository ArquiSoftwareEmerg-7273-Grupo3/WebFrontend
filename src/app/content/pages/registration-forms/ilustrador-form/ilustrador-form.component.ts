import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Ilustrador} from '../../profile/model/ilustrador.entity';
import {ProfileRegistrationService} from '../services/profile-registration.service';
import {NgIf} from '@angular/common';
import {AuthenticationService} from '../../login/services/authentication.service';

@Component({
  selector: 'app-ilustrador-form',
  imports: [
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './ilustrador-form.component.html',
  styleUrl: './ilustrador-form.component.css'
})
export class IlustradorFormComponent {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private profileRegistrationService: ProfileRegistrationService
  ) {
    this.form = this.formBuilder.group({
      nombreArtistico: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const i = this.form.value;
    const ilustrador = new Ilustrador(
      i.nombreArtistico,
    );

    this.profileRegistrationService.registerIlustrador(ilustrador).subscribe({
      next: () => {
        alert('Registro de ilustrador exitoso');
      },
      error: (err) => {
        console.error('Error al registrar ilustrador', err);
        alert(`Error al registrar ilustrador: ${err?.message || err}`);
      }
    });
  }
}
