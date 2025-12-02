import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../services/jobs.service';
import { ContratoProyectoLabel, EspecialidadProyecto,ContratoProyecto, EspecialidadProyectoLabel, ModalidadProyecto, ModalidadProyectoLabel, ProyectoResource, EstadoProyectoLabel, EstadoProyecto } from '../model/proyecto.model';
import { AuthenticationService } from '../../login/services/authentication.service';
import { UserRoleUtils } from '../../login/services/user-role.utils';
import { UserInfoResponse } from '../../login/model/user-info.response';
import { ApplicationModalComponent, ApplicationData } from '../components/application-modal/application-modal.component';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, ApplicationModalComponent],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.css'
})
export class JobDetailComponent implements OnInit {
  proyecto: ProyectoResource | null = null;
  loading: boolean = false;
  error: string = '';
  currentUser: UserInfoResponse | null = null;
  userRole: 'ILLUSTRATOR' | 'WRITER' | 'GENERAL' = 'GENERAL';
  placeholderImage = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=800&fit=crop';
  showApplicationModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobsService: JobsService,
    private authService: AuthenticationService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    const jobId = this.route.snapshot.params['id'];
    if (jobId) {
      this.loadJob(parseInt(jobId, 10));
    }
  }

  loadUserInfo(): void {
    this.authService.getUserInformation().then(userInfo => {
      this.currentUser = userInfo;
      if (userInfo) {
        this.userRole = UserRoleUtils.getUserRole(userInfo);
      }
    }).catch(() => {
      // Si hay error, continuar sin información de usuario
    });
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

  loadJob(jobId: number) {
    this.loading = true;
    this.error = '';

    this.jobsService.getProyectoById(jobId).subscribe({
      next: (proyecto) => {
        this.proyecto = proyecto;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.error = 'Error al cargar el proyecto.';
        this.loading = false;
      }
    });
  }

  applyToJob() {
    if (!this.proyecto) return;

    if (this.userRole !== 'ILLUSTRATOR') {
      alert('Solo los ilustradores pueden postularse a proyectos.');
      return;
    }

    if (!this.currentUser) {
      alert('Debes iniciar sesión para postularte.');
      this.router.navigate(['/login']);
      return;
    }

    this.showApplicationModal = true;
  }

  closeApplicationModal(): void {
    this.showApplicationModal = false;
  }

  submitApplication(applicationData: ApplicationData): void {
    if (!this.proyecto) return;

    // Convertir answers de array a objeto
    const answersObject: { [key: string]: string } = {};
    applicationData.answers.forEach(item => {
      answersObject[item.question] = item.answer;
    });

    const postulacion = {
      fecha: new Date().toISOString(),
      coverLetter: applicationData.coverLetter,
      estimatedTime: applicationData.estimatedTime,
      proposedBudget: applicationData.proposedBudget,
      portfolioLinks: applicationData.portfolioLinks,
      answers: answersObject,
      isPriority: this.isPremiumUser()
    };

    this.jobsService.postularseAProyecto(this.proyecto.id, postulacion).subscribe({
      next: () => {
        this.toastService.success(
          '¡Felicidades!',
          'Tu postulación ha sido enviada exitosamente. El escritor la revisará pronto y recibirás una notificación con su respuesta.'
        );
        this.closeApplicationModal();
        this.router.navigate(['/jobs']);
      },
      error: (error) => {
        console.error('Error al postularse:', error);
        const errorMessage = error.error?.message || error.message || 'Error al enviar la postulación.';
        this.toastService.error('Error', errorMessage);
      }
    });
  }

  isPremiumUser(): boolean {
    return this.currentUser?.ilustrador?.suscripcion === true;
  }

  goBack() {
    this.router.navigate(['/jobs']);
  }

  getRequirementList(requisitos?: string): string[] {
    if (!requisitos) {
      return [];
    }
    return requisitos
      .split(/[\n,•]/g)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  formatDate(dateString?: string): string {
    if (!dateString) {
      return 'Sin definir';
    }
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  canApply(): boolean {
    return this.userRole === 'ILLUSTRATOR';
  }
}