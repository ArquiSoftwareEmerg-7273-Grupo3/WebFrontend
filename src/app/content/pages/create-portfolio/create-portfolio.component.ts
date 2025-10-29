import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-create-portfolio',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './create-portfolio.component.html',
  styleUrl: './create-portfolio.component.css'
})
export class CreatePortfolioComponent {
  title = '';
  description = '';
  image = '';

  constructor(private location: Location) {}

  createPorfolio() {
    alert('Portafolio creado con éxito');
    this.location.back(); // redirige a la página anterior
  }

  goBack() {
    this.location.back();
  }

}
