import {Component, OnInit, OnDestroy} from '@angular/core';
import {NgClass, NgForOf, NgIf, DatePipe} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {JobsService} from '../jobs/services/jobs.service';
import {PostulacionResource, ProyectoResource, EstadoPostulacion} from '../jobs/model/proyecto.model';
import {Subscription, forkJoin} from 'rxjs';

interface PostulacionWithProject {
  postulacion: PostulacionResource;
  proyecto: ProyectoResource;
}

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    NgClass,
    RouterLink,
    FormsModule,
    CommonModule,
    DatePipe
  ],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  error: string = '';
  postulaciones: PostulacionWithProject[] = [];
  filteredPostulaciones: PostulacionWithProject[] = [];
  postulacionSeleccionada: PostulacionWithProject | null = null;
  selectedFilter: string = 'all';
  
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private jobsService: JobsService
  ) {}

  ngOnInit() {
    this.loadPostulaciones();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadPostulaciones(): void {
    this.loading = true;
    this.error = '';
    
    const sub = this.jobsService.getMisPostulaciones().subscribe({
      next: (postulaciones) => {
        // Cargar detalles de cada proyecto
        const proyectoRequests = postulaciones.map(postulacion =>
          this.jobsService.getProyectoById(postulacion.proyectoId)
        );

        if (proyectoRequests.length === 0) {
          this.postulaciones = [];
          this.filteredPostulaciones = [];
          this.loading = false;
          return;
        }

        forkJoin(proyectoRequests).subscribe({
          next: (proyectos) => {
            this.postulaciones = postulaciones.map((postulacion, index) => ({
              postulacion,
              proyecto: proyectos[index]
            }));
            this.filteredPostulaciones = this.postulaciones;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al cargar proyectos:', error);
            this.error = 'Error al cargar los detalles de los proyectos';
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar postulaciones:', error);
        this.error = 'Error al cargar tus postulaciones';
        this.loading = false;
      }
    });

    this.subscriptions.add(sub);
  }

  verDetalles(postulacion: PostulacionWithProject): void {
    this.postulacionSeleccionada = postulacion;
  }

  filterByState(state: string): void {
    this.selectedFilter = state;
    if (state === 'all') {
      this.filteredPostulaciones = this.postulaciones;
    } else {
      this.filteredPostulaciones = this.postulaciones.filter(p => {
        const estadoPostulacion = p.postulacion.estado;
        if (state === 'pending') return estadoPostulacion === EstadoPostulacion.PENDIENTE;
        if (state === 'approved') return estadoPostulacion === EstadoPostulacion.APROBADA;
        if (state === 'rejected') return estadoPostulacion === EstadoPostulacion.RECHAZADA;
        return true;
      });
    }
  }

  getPendingCount(): number {
    return this.postulaciones.filter(p => p.postulacion.estado === EstadoPostulacion.PENDIENTE).length;
  }

  getApprovedCount(): number {
    return this.postulaciones.filter(p => p.postulacion.estado === EstadoPostulacion.APROBADA).length;
  }

  getRejectedCount(): number {
    return this.postulaciones.filter(p => p.postulacion.estado === EstadoPostulacion.RECHAZADA).length;
  }

  getEstadoClass(estado: EstadoPostulacion): string {
    switch (estado) {
      case EstadoPostulacion.PENDIENTE:
        return 'estado-pendiente';
      case EstadoPostulacion.APROBADA:
        return 'estado-aprobada';
      case EstadoPostulacion.RECHAZADA:
        return 'estado-rechazada';
      case EstadoPostulacion.CANCELADA:
        return 'estado-cancelada';
      default:
        return '';
    }
  }

  getEstadoLabel(estado: EstadoPostulacion): string {
    switch (estado) {
      case EstadoPostulacion.PENDIENTE:
        return 'Pendiente';
      case EstadoPostulacion.APROBADA:
        return 'Aprobada';
      case EstadoPostulacion.RECHAZADA:
        return 'Rechazada';
      case EstadoPostulacion.CANCELADA:
        return 'Cancelada';
      default:
        return estado;
    }
  }

  goToProject(projectId: number): void {
    this.router.navigate(['/jobs', projectId]);
  }

  cancelarPostulacion(postulacion: PostulacionWithProject): void {
    if (!confirm('¿Estás seguro de que deseas cancelar esta postulación?')) {
      return;
    }

    const sub = this.jobsService.cancelarPostulacion(postulacion.postulacion.id).subscribe({
      next: () => {
        // Recargar postulaciones
        this.loadPostulaciones();
      },
      error: (error) => {
        console.error('Error al cancelar postulación:', error);
        alert('Error al cancelar la postulación');
      }
    });

    this.subscriptions.add(sub);
  }

  trackByPostulacionId(index: number, item: PostulacionWithProject): number {
    return item.postulacion.id;
  }
}
