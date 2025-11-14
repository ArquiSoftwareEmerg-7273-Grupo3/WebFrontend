import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  ProyectoResource,
  CreatePostulacionResource,
  PostulacionResource,
  AprobarPostulacionResource,
  RechazarPostulacionResource,
} from '../model/proyecto.model';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private basePath: string = `${environment.baseUrlAuth}/api/v1`;
  private httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) {}

  // Obtener todos los proyectos (para Ilustradores)
  getProyectos(): Observable<ProyectoResource[]> {
    return this.http.get<ProyectoResource[]>(`${this.basePath}/proyectos`).pipe(
      catchError(error => {
        console.error('Error al obtener proyectos:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener proyecto por ID
  getProyectoById(id: number): Observable<ProyectoResource> {
    return this.http.get<ProyectoResource>(`${this.basePath}/proyectos/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener proyecto:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener mis proyectos (para Escritores)
  getMisProyectos(): Observable<ProyectoResource[]> {
    return this.http.get<ProyectoResource[]>(`${this.basePath}/proyectos/mis-proyectos`).pipe(
      catchError(error => {
        console.error('Error al obtener mis proyectos:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener postulaciones por proyecto
  getPostulacionesByProyectoId(proyectoId: number): Observable<PostulacionResource[]> {
    return this.http.get<PostulacionResource[]>(`${this.basePath}/postulaciones/proyectoId/${proyectoId}`).pipe(
      catchError(error => {
        console.error('Error al obtener postulaciones:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener mis postulaciones (para Ilustradores)
  getMisPostulaciones(): Observable<PostulacionResource[]> {
    return this.http.get<PostulacionResource[]>(`${this.basePath}/postulaciones/mis-postulaciones`).pipe(
      catchError(error => {
        console.error('Error al obtener mis postulaciones:', error);
        return throwError(() => error);
      })
    );
  }

  // Postularse a un proyecto
  postularseAProyecto(proyectoId: number, resource: CreatePostulacionResource): Observable<any> {
    return this.http.post(`${this.basePath}/postulaciones/postular/proyecto/${proyectoId}`, resource, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error al postularse:', error);
        return throwError(() => error);
      })
    );
  }

  // Aprobar postulación (para Escritores)
  aprobarPostulacion(postulacionId: number, resource: AprobarPostulacionResource): Observable<any> {
    return this.http.patch(`${this.basePath}/postulaciones/${postulacionId}/aprobar`, resource, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error al aprobar postulación:', error);
        return throwError(() => error);
      })
    );
  }

  // Rechazar postulación (para Escritores)
  rechazarPostulacion(postulacionId: number, resource: RechazarPostulacionResource): Observable<any> {
    return this.http.patch(`${this.basePath}/postulaciones/${postulacionId}/rechazar`, resource, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error al rechazar postulación:', error);
        return throwError(() => error);
      })
    );
  }

  // Cancelar postulación (para Ilustradores)
  cancelarPostulacion(postulacionId: number): Observable<any> {
    return this.http.patch(`${this.basePath}/postulaciones/${postulacionId}/cancelar`, {}, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error al cancelar postulación:', error);
        return throwError(() => error);
      })
    );
  }

  // Cerrar proyecto (para Escritores)
  cerrarProyecto(proyectoId: number): Observable<any> {
    return this.http.patch(`${this.basePath}/proyectos/${proyectoId}/cerrar`, {}, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error al cerrar proyecto:', error);
        return throwError(() => error);
      })
    );
  }

  // Finalizar proyecto (para Escritores)
  finalizarProyecto(proyectoId: number): Observable<any> {
    return this.http.patch(`${this.basePath}/proyectos/${proyectoId}/finalizar`, {}, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error al finalizar proyecto:', error);
        return throwError(() => error);
      })
    );
  }
}