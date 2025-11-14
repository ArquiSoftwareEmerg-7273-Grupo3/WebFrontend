import { TestBed } from '@angular/core/testing';
import { JobDetailComponent } from './job-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../services/jobs.service';
import { of } from 'rxjs';

describe('JobDetailComponent', () => {
  let component: JobDetailComponent;
  let fixture: any;
  let mockJobsService: jasmine.SpyObj<JobsService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    const jobsServiceSpy = jasmine.createSpyObj('JobsService', ['getProyectoById', 'postularseAProyecto']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    mockActivatedRoute = {
      snapshot: {
        params: { id: '1' }
      }
    };

    await TestBed.configureTestingModule({
      imports: [JobDetailComponent],
      providers: [
        { provide: JobsService, useValue: jobsServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(JobDetailComponent);
    component = fixture.componentInstance;
    mockJobsService = TestBed.inject(JobsService) as jasmine.SpyObj<JobsService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load proyecto on init', () => {
    const mockProyecto = {
      id: 1,
      escritorId: 10,
      titulo: 'Proyecto de prueba',
      descripcion: 'Descripción',
      estado: 'Abierto para postulaciones',
      modalidad: 'Remoto',
      contrato: 'Freelance',
      especialidad: 'Ilustración Digital',
      requisitos: 'Portafolio',
      fechaFin: '2025-01-01T00:00:00',
      fechaInicio: '2024-12-01T00:00:00',
      presupuesto: 2000,
      maxPostulaciones: 5
    };

    mockJobsService.getProyectoById.and.returnValue(of(mockProyecto));

    component.ngOnInit();

    expect(mockJobsService.getProyectoById).toHaveBeenCalledWith(1);
    expect(component.proyecto).toEqual(mockProyecto as any);
    expect(component.loading).toBeFalse();
  });

  it('should navigate back to jobs', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/jobs']);
  });
});