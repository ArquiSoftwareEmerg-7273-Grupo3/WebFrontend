import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobsService } from '../services/jobs.service';
import { AuthenticationService } from '../../login/services/authentication.service';
import { UserRoleUtils } from '../../login/services/user-role.utils';
import { UserInfoResponse } from '../../login/model/user-info.response';
import {
  ProyectoResource,
  PostulacionResource,
  EstadoPostulacion,
  AprobarPostulacionResource,
  RechazarPostulacionResource,
  EspecialidadProyecto,
  EspecialidadProyectoLabel,
  ModalidadProyecto,
  ModalidadProyectoLabel,
  ContratoProyecto,
  ContratoProyectoLabel
} from '../model/proyecto.model';

@Component({
  selector: 'app-writer-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './writer-projects.component.html',
  styleUrl: './writer-projects.component.css'
})
export class WriterProjectsComponent implements OnInit {
  proyectos: ProyectoResource[] = [];
  proyectoSeleccionado: ProyectoResource | null = null;
  postulaciones: PostulacionResource[] = [];
  
  // Información del usuario
  currentUser: UserInfoResponse | null = null;
  
  // Estados
  loading: boolean = false;
  error: string = '';
  loadingPostulaciones: boolean = false;
  
  // Modales
  showAprobarModal: boolean = false;
  showRechazarModal: boolean = false;
  postulacionSeleccionada: PostulacionResource | null = null;
  
  // Formularios
  respuestaAprobacion: string = '';
  razonRechazo: string = '';

  constructor(
    private jobsService: JobsService,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.authService.ensureUserInformation().then(userInfo => {
      this.handleUserAccess(userInfo);
    }).catch((error) => {
      console.error('Error validando la sesión', error);
      this.error = 'No pudimos validar tu sesión. Inicia sesión nuevamente.';
      this.router.navigate(['/login']);
    });
  }

  private handleUserAccess(userInfo: UserInfoResponse | null): void {
    this.currentUser = userInfo;
    if (userInfo && UserRoleUtils.isWriter(userInfo)) {
      this.loadMisProyectos();
    } else {
      this.error = 'Solo los escritores pueden acceder a esta sección.';
      this.router.navigate(['/jobs']);
    }
  }

  loadMisProyectos(): void {
    this.loading = true;
    this.error = '';
    
    this.jobsService.getMisProyectos().subscribe({
      next: (proyectos) => {
        this.proyectos = proyectos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar proyectos:', error);
        this.error = 'Error al cargar tus proyectos.';
        this.loading = false;
      }
    });
  }

  verPostulaciones(proyecto: ProyectoResource): void {
    this.proyectoSeleccionado = proyecto;
    this.loadingPostulaciones = true;
    this.postulaciones = [];
    
    this.jobsService.getPostulacionesByProyectoId(proyecto.id).subscribe({
      next: (postulaciones) => {
        this.postulaciones = postulaciones;
        this.loadingPostulaciones = false;
      },
      error: (error) => {
        console.error('Error al cargar postulaciones:', error);
        this.error = 'Error al cargar las postulaciones.';
        this.loadingPostulaciones = false;
      }
    });
  }

  abrirModalAprobar(postulacion: PostulacionResource): void {
    this.postulacionSeleccionada = postulacion;
    this.respuestaAprobacion = '';
    this.showAprobarModal = true;
  }

  abrirModalRechazar(postulacion: PostulacionResource): void {
    this.postulacionSeleccionada = postulacion;
    this.razonRechazo = '';
    this.showRechazarModal = true;
  }

  cerrarModales(): void {
    this.showAprobarModal = false;
    this.showRechazarModal = false;
    this.postulacionSeleccionada = null;
    this.respuestaAprobacion = '';
    this.razonRechazo = '';
  }

  aprobarPostulacion(): void {
    if (!this.postulacionSeleccionada || !this.respuestaAprobacion.trim()) {
      alert('Por favor, ingresa una respuesta.');
      return;
    }

    const resource: AprobarPostulacionResource = {
      respuesta: this.respuestaAprobacion
    };

    this.jobsService.aprobarPostulacion(this.postulacionSeleccionada.id, resource).subscribe({
      next: () => {
        alert('Postulación aprobada exitosamente.');
        this.cerrarModales();
        if (this.proyectoSeleccionado) {
          this.verPostulaciones(this.proyectoSeleccionado);
        }
      },
      error: (error) => {
        console.error('Error al aprobar postulación:', error);
        const errorMessage = error.error?.message || error.message || 'Error al aprobar la postulación.';
        alert(errorMessage);
      }
    });
  }

  rechazarPostulacion(): void {
    if (!this.postulacionSeleccionada || !this.razonRechazo.trim()) {
      alert('Por favor, ingresa una razón para el rechazo.');
      return;
    }

    const resource: RechazarPostulacionResource = {
      razon: this.razonRechazo
    };

    this.jobsService.rechazarPostulacion(this.postulacionSeleccionada.id, resource).subscribe({
      next: () => {
        alert('Postulación rechazada.');
        this.cerrarModales();
        if (this.proyectoSeleccionado) {
          this.verPostulaciones(this.proyectoSeleccionado);
        }
      },
      error: (error) => {
        console.error('Error al rechazar postulación:', error);
        const errorMessage = error.error?.message || error.message || 'Error al rechazar la postulación.';
        alert(errorMessage);
      }
    });
  }

  cerrarProyecto(proyecto: ProyectoResource): void {
    if (!confirm('¿Estás seguro de que deseas cerrar este proyecto?')) {
      return;
    }

    this.jobsService.cerrarProyecto(proyecto.id).subscribe({
      next: () => {
        alert('Proyecto cerrado exitosamente.');
        this.loadMisProyectos();
        if (this.proyectoSeleccionado?.id === proyecto.id) {
          this.proyectoSeleccionado = null;
          this.postulaciones = [];
        }
      },
      error: (error) => {
        console.error('Error al cerrar proyecto:', error);
        const errorMessage = error.error?.message || error.message || 'Error al cerrar el proyecto.';
        alert(errorMessage);
      }
    });
  }

  finalizarProyecto(proyecto: ProyectoResource): void {
    if (!confirm('¿Estás seguro de que deseas finalizar este proyecto?')) {
      return;
    }

    this.jobsService.finalizarProyecto(proyecto.id).subscribe({
      next: () => {
        alert('Proyecto finalizado exitosamente.');
        this.loadMisProyectos();
        if (this.proyectoSeleccionado?.id === proyecto.id) {
          this.proyectoSeleccionado = null;
          this.postulaciones = [];
        }
      },
      error: (error) => {
        console.error('Error al finalizar proyecto:', error);
        const errorMessage = error.error?.message || error.message || 'Error al finalizar el proyecto.';
        alert(errorMessage);
      }
    });
  }

  getEstadoLabel(estado: EstadoPostulacion): string {
    const estados: { [key: string]: string } = {
      'PENDIENTE': 'Pendiente',
      'APROBADA': 'Aprobada',
      'RECHAZADA': 'Rechazada',
      'CANCELADA': 'Cancelada'
    };
    return estados[estado] || estado;
  }

  getEstadoClass(estado: EstadoPostulacion): string {
    const clases: { [key: string]: string } = {
      'PENDIENTE': 'estado-pendiente',
      'APROBADA': 'estado-aprobada',
      'RECHAZADA': 'estado-rechazada',
      'CANCELADA': 'estado-cancelada'
    };
    return clases[estado] || '';
  }

  getEspecialidadLabel(value: EspecialidadProyecto) {
    return EspecialidadProyectoLabel[value] ?? value;
  }

  getModalidadLabel(value: ModalidadProyecto) {
    return ModalidadProyectoLabel[value] ?? value;
  }

  getContratoLabel(value: ContratoProyecto) {
    return ContratoProyectoLabel[value] ?? value;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(value?: number): string {
    if (value === undefined || value === null) {
      return '';
    }
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0
    }).format(value);
  }

  goToCreateProject(): void {
    this.router.navigate(['/projects/create-new-project']);
  }
}

