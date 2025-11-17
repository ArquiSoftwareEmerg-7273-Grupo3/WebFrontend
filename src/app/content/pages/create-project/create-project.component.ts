import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobsService } from '../jobs/services/jobs.service';
import {
  EspecialidadProyecto,
  EspecialidadProyectoLabel,
  ModalidadProyecto,
  ModalidadProyectoLabel,
  ContratoProyecto,
  ContratoProyectoLabel
} from '../jobs/model/proyecto.model';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})
export class CreateProjectComponent implements OnInit {
  // Campos del formulario
  titulo = '';
  descripcion = '';
  requisitos = '';
  presupuesto: number | null = null;
  fechaInicio = '';
  fechaFin = '';
  maxPostulaciones: number = 10;
  especialidadProyecto: EspecialidadProyecto | null = null;
  modalidadProyecto: ModalidadProyecto | null = null;
  contratoProyecto: ContratoProyecto | null = null;

  // Estados
  isLoading = false;
  error = '';

  // Enums para los selects
  especialidades = Object.values(EspecialidadProyecto);
  modalidades = Object.values(ModalidadProyecto);
  contratos = Object.values(ContratoProyecto);

  // Labels
  especialidadLabels = EspecialidadProyectoLabel;
  modalidadLabels = ModalidadProyectoLabel;
  contratoLabels = ContratoProyectoLabel;

  constructor(
    private location: Location,
    private router: Router,
    private jobsService: JobsService
  ) {}

  ngOnInit(): void {
    // Establecer fecha mínima como hoy
    const today = new Date().toISOString().split('T')[0];
    this.fechaInicio = today;
  }

  createProject() {
    // Validaciones
    if (!this.titulo.trim()) {
      alert('El título es requerido');
      return;
    }

    if (!this.descripcion.trim()) {
      alert('La descripción es requerida');
      return;
    }

    if (!this.presupuesto || this.presupuesto <= 0) {
      alert('El presupuesto debe ser mayor a 0');
      return;
    }

    if (!this.fechaInicio) {
      alert('La fecha de inicio es requerida');
      return;
    }

    if (!this.fechaFin) {
      alert('La fecha de fin es requerida');
      return;
    }

    if (new Date(this.fechaFin) <= new Date(this.fechaInicio)) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    if (!this.especialidadProyecto) {
      alert('La especialidad es requerida');
      return;
    }

    if (!this.modalidadProyecto) {
      alert('La modalidad es requerida');
      return;
    }

    if (!this.contratoProyecto) {
      alert('El tipo de contrato es requerido');
      return;
    }

    if (this.maxPostulaciones < 1) {
      alert('El número máximo de postulaciones debe ser al menos 1');
      return;
    }

    // Convertir fechas al formato LocalDateTime esperado por el backend
    const fechaInicioDateTime = `${this.fechaInicio}T00:00:00`;
    const fechaFinDateTime = `${this.fechaFin}T23:59:59`;

    // Crear el proyecto
    const proyectoData = {
      titulo: this.titulo.trim(),
      descripcion: this.descripcion.trim(),
      requisitos: this.requisitos.trim(),
      presupuesto: this.presupuesto,
      fechaInicio: fechaInicioDateTime,
      fechaFin: fechaFinDateTime,
      maxPostulaciones: this.maxPostulaciones,
      especialidadProyecto: this.especialidadProyecto,
      modalidadProyecto: this.modalidadProyecto,
      contratoProyecto: this.contratoProyecto
    };

    this.isLoading = true;
    this.error = '';

    console.log('Datos del proyecto a crear:', proyectoData);
    
    this.jobsService.createProyecto(proyectoData).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Proyecto creado exitosamente');
        this.router.navigate(['/writer-projects']);
      },
      error: (error) => {
        console.error('Error al crear proyecto:', error);
        this.isLoading = false;
        this.error = error.error?.message || error.message || 'Error al crear el proyecto';
      }
    });
  }

  goBack() {
    this.location.back();
  }

  // Método para obtener la fecha mínima para fecha de fin
  getMinEndDate(): string {
    if (this.fechaInicio) {
      const startDate = new Date(this.fechaInicio);
      startDate.setDate(startDate.getDate() + 1);
      return startDate.toISOString().split('T')[0];
    }
    return '';
  }
}
