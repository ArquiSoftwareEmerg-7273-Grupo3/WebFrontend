import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService, Job } from '../services/jobs.service';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-detail.component.html',
  styleUrl: './job-detail.component.css'
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  loading: boolean = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobsService: JobsService
  ) {}

  ngOnInit() {
    const jobId = this.route.snapshot.params['id'];
    if (jobId) {
      this.loadJob(parseInt(jobId));
    }
  }

  loadJob(jobId: number) {
    this.loading = true;
    this.error = '';

    this.jobsService.getJobById(jobId).subscribe({
      next: (job) => {
        this.job = job;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading job:', error);
        this.error = 'Error al cargar el trabajo';
        this.loading = false;
      }
    });
  }

  applyToJob() {
    if (this.job) {
      // Implementar lógica de aplicación
      console.log('Aplicando al trabajo:', this.job.id);
    }
  }

  saveJob() {
    if (this.job) {
      this.jobsService.saveJob(this.job.id).subscribe({
        next: () => {
          console.log('Trabajo guardado');
        },
        error: (error) => {
          console.error('Error al guardar:', error);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/jobs']);
  }

  getDaysAgo(date: Date): number {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysRemaining(date: Date): number {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getTypeLabel(type: string): string {
    const typeMap: { [key: string]: string } = {
      'full-time': 'Tiempo completo',
      'part-time': 'Medio tiempo',
      'freelance': 'Freelance',
      'remote': 'Remoto'
    };
    return typeMap[type] || type;
  }

  getCategoryLabel(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'illustration': 'Ilustración',
      'writing': 'Escritura',
      'design': 'Diseño',
      'marketing': 'Marketing'
    };
    return categoryMap[category] || category;
  }
}