import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})
export class CreateProjectComponent {
  title = '';
  description = '';
  image = '';

  constructor(private location: Location) {}

  createProject() {
    alert('Proyecto creado con éxito');
    this.location.back(); // redirige a la página anterior
  }

  goBack() {
    this.location.back();
  }

}
