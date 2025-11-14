import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobsService } from './services/jobs.service';
import { AuthenticationService } from '../login/services/authentication.service';
import { UserRoleUtils } from '../login/services/user-role.utils';
import { UserInfoResponse } from '../login/model/user-info.response';
import { ContratoProyecto, ContratoProyectoLabel, EspecialidadProyectoLabel, ModalidadProyectoLabel, EstadoProyectoLabel } from './model/proyecto.model';
import {
  EspecialidadProyecto,
  ModalidadProyecto,
  EstadoProyecto,
  ProyectoResource
} from './model/proyecto.model';

@Component({
  selector: 'app-jobs',
  imports: [CommonModule, FormsModule],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent implements OnInit {
  proyectos: ProyectoResource[] = [];
  filteredProyectos: ProyectoResource[] = [];
  
  currentUser: UserInfoResponse | null = null;
  userRole: 'ILLUSTRATOR' | 'WRITER' | 'GENERAL' = 'GENERAL';
  
  selectedEspecialidad: string = '';
  selectedModalidad: string = '';
  selectedEstado: string = '';
  searchTerm: string = '';
  
  loading: boolean = false;
  error: string = '';
  totalProyectos: number = 0;
  placeholderImage = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=400&fit=crop';
  
  especialidades = [
    { value: '', label: 'Todas las especialidades' },
    ...Object.values(EspecialidadProyecto).map(especialidad => ({
      value: especialidad,
      label: especialidad
    }))
  ];

  // Vista actual: 'list' o 'grid'
  viewMode: 'list' | 'grid' = 'list';

  setViewMode(mode: 'list' | 'grid') {
  this.viewMode = mode;
  }

  
  modalidades = [
    { value: '', label: 'Cualquier modalidad' },
    ...Object.values(ModalidadProyecto).map(modalidad => ({
      value: modalidad,
      label: modalidad
    }))
  ];
  
  estados = [
    { value: '', label: 'Estado del proyecto' },
    ...Object.values(EstadoProyecto).map(estado => ({
      value: estado,
      label: estado
    }))
  ];

  constructor(
    private jobsService: JobsService, 
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
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
  getEstadoLabel(value: EstadoProyecto) {
    return EstadoProyectoLabel[value] ?? value;
  }
  // Cargar información del usuario y determinar rol
  loadUserInfo(): void {
    this.authService.getUserInformation().then(userInfo => {
      this.currentUser = userInfo;
      if (userInfo) {
        this.userRole = UserRoleUtils.getUserRole(userInfo);
        this.loadJobs();
      } else {
        // Si no hay usuario, mostrar vista general
        this.loadJobs();
      }
    }).catch(() => {
      // Si hay error, cargar vista general
      this.loadJobs();
    });
  }

  // Cargar trabajos desde el backend
  loadJobs(): void {
    this.loadProyectos();
  }

  // Cargar proyectos disponibles (para Ilustradores)
  loadProyectos(): void {
    this.loading = true;
    this.error = '';
    this.jobsService.getProyectos().subscribe({
      next: (proyectos) => {
        this.proyectos = proyectos;
        this.totalProyectos = proyectos.length;
        this.applyFilters(false);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading proyectos:', error);
        this.error = 'Error al cargar los proyectos disponibles.';
        this.loading = false;
      }
    });
  }

  // Aplicar filtros
  applyFilters(reloadIfEmpty: boolean = true): void {
    if (reloadIfEmpty && this.proyectos.length === 0) {
      this.loadProyectos();
      return;
    }

    let filtered = [...this.proyectos];

    if (this.selectedEspecialidad) {
      filtered = filtered.filter(proyecto => proyecto.especialidadProyecto === this.selectedEspecialidad);
    }

    if (this.selectedModalidad) {
      filtered = filtered.filter(proyecto => proyecto.modalidadProyecto === this.selectedModalidad);
    }

    if (this.selectedEstado) {
      filtered = filtered.filter(proyecto => proyecto.estado === this.selectedEstado);
    }

    if (this.searchTerm) {
      const searchTerm = this.searchTerm.toLowerCase();
      filtered = filtered.filter(proyecto =>
        proyecto.titulo.toLowerCase().includes(searchTerm) ||
        proyecto.descripcion?.toLowerCase().includes(searchTerm) ||
        proyecto.requisitos?.toLowerCase().includes(searchTerm)
      );
    }

    this.filteredProyectos = filtered;
  }

  onFilterChange(): void {
    this.applyFilters(false);
  }

  // Método para ver detalles del trabajo
  viewJobDetails(jobId: number): void {
    this.router.navigate(['/jobs', jobId]);
  }

  // Navegar a la gestión de proyectos (para Escritores)
  goToMyProjects(): void {
    this.router.navigate(['/jobs/writer/my-projects']);
  }

  // Método para aplicar al trabajo (para Ilustradores)
  applyToJob(jobId: number): void {
    if (this.userRole !== 'ILLUSTRATOR') {
      alert('Solo los ilustradores pueden postularse a proyectos.');
      return;
    }

    if (!this.currentUser) {
      alert('Debes iniciar sesión para postularte.');
      this.router.navigate(['/login']);
      return;
    }

    // Crear postulación
    const postulacion = {
      fecha: new Date().toISOString()
    };

    this.jobsService.postularseAProyecto(jobId, postulacion).subscribe({
      next: (response) => {
        alert('¡Postulación enviada exitosamente!');
        // Recargar proyectos para actualizar contadores
        this.loadProyectos();
      },
      error: (error) => {
        console.error('Error al postularse:', error);
        const errorMessage = error.error?.message || error.message || 'Error al enviar la postulación.';
        alert(errorMessage);
      }
    });
  }

  getRequirementsList(requisitos?: string): string[] {
    if (!requisitos) {
      return [];
    }
    return requisitos
      .split(/[\n,•]/g)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  formatCurrency(value?: number): string {
    if (value === undefined || value === null) {
      return '';
    }
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  }

  formatDate(dateString?: string): string {
    if (!dateString) {
      return 'Sin definir';
    }
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getEstadoBadgeClass(estado: EstadoProyecto): string {
    switch (estado) {
      case EstadoProyecto.ABIERTO:
        return 'badge featured';
      case EstadoProyecto.CERRADO:
        return 'badge urgent';
      case EstadoProyecto.EN_PROGRESO:
        return 'badge in-progress';
      case EstadoProyecto.FINALIZADO:
        return 'badge completed';
      default:
        return 'badge';
    }
  }

  getOpenProjects(): number {
    return this.proyectos.filter(p => p.estado === EstadoProyecto.ABIERTO).length;
  }
}
