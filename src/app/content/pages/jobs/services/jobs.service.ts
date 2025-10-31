import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface JobFilters {
  category?: string;
  type?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'freelance' | 'remote';
  category: 'illustration' | 'writing' | 'design' | 'marketing';
  description: string;
  requirements: string[];
  salary?: string;
  postedDate: Date;
  deadline: Date;
  applicants: number;
  image: string;
  urgent?: boolean;
  featured?: boolean;
}

export interface JobApplication {
  jobId: number;
  message: string;
  attachments?: File[];
}

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private basePath: string = `${environment.baseUrlAuth}`;
  private httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) {}

  // Obtener lista de trabajos con filtros
  getJobs(filters: JobFilters = {}): Observable<{jobs: Job[], total: number}> {
    let params = new HttpParams();
    
    if (filters.category) params = params.set('category', filters.category);
    if (filters.type) params = params.set('type', filters.type);
    if (filters.location) params = params.set('location', filters.location);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<{jobs: Job[], total: number}>(`${this.basePath}/proyectos`, { params });
  }

  // Obtener trabajo por ID
  getJobById(jobId: number): Observable<Job> {
    return this.http.get<Job>(`${this.basePath}/proyectos/${jobId}`);
  }

  // Aplicar a un trabajo
  applyToJob(application: JobApplication): Observable<any> {
    return this.http.post(`${this.basePath}/postulaciones`, application, this.httpOptions);
  }

  // Guardar trabajo (marcarlo como favorito)
  saveJob(jobId: number): Observable<any> {
    return this.http.post(`${this.basePath}/users/saved-jobs`, { jobId }, this.httpOptions);
  }

  // Remover trabajo guardado
  unsaveJob(jobId: number): Observable<any> {
    return this.http.delete(`${this.basePath}/users/saved-jobs/${jobId}`);
  }

  // Obtener trabajos guardados del usuario
  getSavedJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.basePath}/users/saved-jobs`);
  }

  // Obtener aplicaciones del usuario
  getUserApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.basePath}/users/applications`);
  }

  // Obtener estadísticas de trabajos
  getJobStats(): Observable<any> {
    return this.http.get<any>(`${this.basePath}/proyectos/stats`);
  }
}