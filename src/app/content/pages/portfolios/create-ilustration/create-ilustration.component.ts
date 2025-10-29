import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-create-ilustration',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './create-ilustration.component.html',
  styleUrl: './create-ilustration.component.css'
})
export class CreateIlustrationComponent {
  title = '';
  description = '';
  image = '';

  constructor(private location: Location) {}

  createIllustration() {
    alert('Ilustración creada con éxito');
    this.location.back(); // redirige a la página anterior
  }

  goBack() {
    this.location.back();
  }
}
