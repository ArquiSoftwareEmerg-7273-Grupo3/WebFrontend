import { Component } from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {PopupRegistroIlustradorService} from '../services/popup-registro-ilustrador.service';
import {Ilustrador} from '../model/ilustrador.entity';

@Component({
  selector: 'app-popup-registro-ilustrador',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './popup-registro-ilustrador.component.html',
  styleUrl: './popup-registro-ilustrador.component.css'
})
export class PopupRegistroIlustradorComponent {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<PopupRegistroIlustradorComponent>,
    private formBuilder: FormBuilder,
    private popupService: PopupRegistroIlustradorService
    ) {
    this.form = this.formBuilder.group({
      nombreArtistico: ['', Validators.required],
    });
  }

  closeDialog() {
    this.dialogRef.close();
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

    this.popupService.registerIllustrator(ilustrador).subscribe({
      next: () => {
        alert('Registro de ilustrador exitoso');
        this.dialogRef.close();

      },
      error: (err) => {
        console.error('Error al registrar ilustrador', err);
        alert(`Error al registrar ilustrador: ${err?.message || err}`);
      }
    });
  }
}
