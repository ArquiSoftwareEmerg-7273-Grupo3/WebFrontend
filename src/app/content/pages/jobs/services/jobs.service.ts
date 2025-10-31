import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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

    // Por ahora retornamos datos de ejemplo
    return of(this.getExampleJobs(filters));
    
    // Descomenta cuando tengas el backend configurado:
    // return this.http.get<{jobs: Job[], total: number}>(`${this.basePath}/proyectos`, { params });
  }

  // Método para obtener datos de ejemplo
  private getExampleJobs(filters: JobFilters = {}): {jobs: Job[], total: number} {
    const exampleJobs: Job[] = [
      {
        id: 1,
        title: 'Ilustrador para libro infantil',
        company: 'Editorial Fantasía',
        location: 'Lima',
        type: 'freelance',
        category: 'illustration',
        description: 'Buscamos un ilustrador talentoso para crear ilustraciones para un libro infantil sobre aventuras mágicas. El proyecto incluye 20 ilustraciones a color.',
        requirements: ['Experiencia en ilustración infantil', 'Dominio de técnicas digitales', 'Portfolio con trabajos similares'],
        salary: 'S/. 2,000 - S/. 3,500',
        postedDate: new Date('2025-01-28'),
        deadline: new Date('2025-02-15'),
        applicants: 12,
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop',
        featured: true
      },
      {
        id: 2,
        title: 'Escritor de contenido creativo',
        company: 'Agencia Digital Pro',
        location: 'Arequipa',
        type: 'part-time',
        category: 'writing',
        description: 'Se necesita escritor creativo para desarrollar contenido para redes sociales y blogs. Trabajo remoto con horarios flexibles.',
        requirements: ['Experiencia en copywriting', 'Conocimiento de SEO', 'Creatividad y originalidad'],
        salary: 'S/. 1,200 - S/. 2,000',
        postedDate: new Date('2025-01-27'),
        deadline: new Date('2025-02-10'),
        applicants: 8,
        image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop'
      },
      {
        id: 3,
        title: 'Diseñador UX/UI para startup',
        company: 'TechStartup Inc.',
        location: 'Bogotá',
        type: 'full-time',
        category: 'design',
        description: 'Únete a nuestro equipo como diseñador UX/UI para crear experiencias increíbles en nuestra plataforma de e-commerce.',
        requirements: ['3+ años de experiencia', 'Figma, Sketch, Adobe XD', 'Portfolio sólido'],
        salary: '$1,500 - $2,500 USD',
        postedDate: new Date('2025-01-26'),
        deadline: new Date('2025-02-20'),
        applicants: 25,
        image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=300&h=200&fit=crop',
        urgent: true
      },
      {
        id: 4,
        title: 'Community Manager',
        company: 'Marca Global',
        location: 'México DF',
        type: 'remote',
        category: 'marketing',
        description: 'Gestiona nuestras redes sociales y crea estrategias de contenido que conecten con nuestra audiencia.',
        requirements: ['Experiencia en redes sociales', 'Conocimiento de herramientas de análisis', 'Creatividad'],
        salary: '$800 - $1,200 USD',
        postedDate: new Date('2025-01-25'),
        deadline: new Date('2025-02-05'),
        applicants: 18,
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop'
      },
      {
        id: 5,
        title: 'Ilustrador digital freelance',
        company: 'Agencia Creativa',
        location: 'Santiago',
        type: 'freelance',
        category: 'illustration',
        description: 'Proyecto de ilustraciones para campaña publicitaria. Se requieren 15 ilustraciones en estilo cartoon.',
        requirements: ['Portfolio de ilustración digital', 'Estilo cartoon/animado', 'Entrega rápida'],
        salary: '$1,000 - $1,800 USD',
        postedDate: new Date('2025-01-24'),
        deadline: new Date('2025-02-08'),
        applicants: 14,
        image: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=300&h=200&fit=crop',
        featured: true
      },
      {
        id: 6,
        title: 'Redactor técnico',
        company: 'Software Solutions',
        location: 'Buenos Aires',
        type: 'part-time',
        category: 'writing',
        description: 'Crear documentación técnica y manuales de usuario para software empresarial.',
        requirements: ['Experiencia en redacción técnica', 'Conocimiento de software', 'Atención al detalle'],
        salary: '$600 - $1,000 USD',
        postedDate: new Date('2025-01-23'),
        deadline: new Date('2025-02-12'),
        applicants: 7,
        image: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=300&h=200&fit=crop'
      }
    ];

    // Aplicar filtros a los datos de ejemplo
    let filteredJobs = exampleJobs;

    if (filters.category) {
      filteredJobs = filteredJobs.filter(job => job.category === filters.category);
    }
    if (filters.type) {
      filteredJobs = filteredJobs.filter(job => job.type === filters.type);
    }
    if (filters.location) {
      filteredJobs = filteredJobs.filter(job => job.location.includes(filters.location!));
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm)
      );
    }

    return { jobs: filteredJobs, total: filteredJobs.length };
  }

  // Obtener trabajo por ID
  getJobById(jobId: number): Observable<Job> {
    // Por ahora busca en los datos de ejemplo
    const exampleData = this.getExampleJobs();
    const job = exampleData.jobs.find(j => j.id === jobId);
    
    if (job) {
      return of(job);
    } else {
      throw new Error('Trabajo no encontrado');
    }
    
    // Descomenta cuando tengas el backend configurado:
    // return this.http.get<Job>(`${this.basePath}/proyectos/${jobId}`);
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