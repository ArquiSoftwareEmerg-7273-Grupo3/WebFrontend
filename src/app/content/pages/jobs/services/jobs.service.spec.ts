import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JobsService } from './jobs.service';
import { environment } from '../../../../../environments/environment';
import { ProyectoResource } from '../model/proyecto.model';

describe('JobsService', () => {
  let service: JobsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JobsService]
    });
    service = TestBed.inject(JobsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch proyectos', () => {
    const mockResponse: ProyectoResource[] = [
      {
        id: 1,
        escritorId: 10,
        titulo: 'Proyecto de prueba',
        descripcion: 'Descripción',
        estado: 'Abierto para postulaciones' as any,
        modalidad: 'Remoto' as any,
        contrato: 'Freelance' as any,
        especialidad: 'Ilustración Digital' as any,
        requisitos: 'Portafolio actualizado',
        fechaFin: '2025-01-01T00:00:00',
        fechaInicio: '2024-12-01T00:00:00',
        presupuesto: 2000,
        maxPostulaciones: 5
      }
    ];

    service.getProyectos().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.baseUrlProject}/api/v1/proyectos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch proyecto by id', () => {
    const mockProyecto: ProyectoResource = {
      id: 1,
      escritorId: 10,
      titulo: 'Proyecto de prueba',
      descripcion: 'Descripción',
      estado: 'Abierto para postulaciones' as any,
      modalidad: 'Remoto' as any,
      contrato: 'Freelance' as any,
      especialidad: 'Ilustración Digital' as any,
      requisitos: 'Portafolio actualizado',
      fechaFin: '2025-01-01T00:00:00',
      fechaInicio: '2024-12-01T00:00:00',
      presupuesto: 2000,
      maxPostulaciones: 5
    };

    service.getProyectoById(1).subscribe(response => {
      expect(response).toEqual(mockProyecto);
    });

    const req = httpMock.expectOne(`${environment.baseUrlProject}/api/v1/proyectos/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProyecto);
  });

  it('should allow postulacion to proyecto', () => {
    const postulacion = { fecha: '2024-12-15T00:00:00' };

    service.postularseAProyecto(1, postulacion).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.baseUrlProject}/api/v1/postulaciones/postular/proyecto/1`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(postulacion);
    req.flush({ success: true });
  });
});