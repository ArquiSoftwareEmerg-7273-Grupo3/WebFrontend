import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobsService, Job, JobFilters } from './services/jobs.service';

@Component({
  selector: 'app-jobs',
  imports: [CommonModule, FormsModule],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css'
})
export class JobsComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  
  // Filtros
  selectedCategory: string = '';
  selectedType: string = '';
  selectedLocation: string = '';
  searchTerm: string = '';
  
  // Estados de carga y error
  loading: boolean = false;
  error: string = '';
  totalJobs: number = 0;
  currentPage: number = 1;
  jobsPerPage: number = 12;
  
  categories = [
    { value: '', label: 'Todas las categorías' },
    { value: 'illustration', label: 'Ilustración' },
    { value: 'writing', label: 'Escritura' },
    { value: 'design', label: 'Diseño' },
    { value: 'marketing', label: 'Marketing' }
  ];
  
  jobTypes = [
    { value: '', label: 'Todos los tipos' },
    { value: 'full-time', label: 'Tiempo completo' },
    { value: 'part-time', label: 'Medio tiempo' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'remote', label: 'Remoto' }
  ];
  
  locations = [
    { value: '', label: 'Todas las ubicaciones' },
    { value: 'Lima', label: 'Lima' },
    { value: 'Arequipa', label: 'Arequipa' },
    { value: 'Cusco', label: 'Cusco' },
    { value: 'Remoto', label: 'Remoto' }
  ];

  constructor(private jobsService: JobsService, private router: Router) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  // Cargar trabajos desde el backend
  loadJobs(): void {
    this.loading = true;
    this.error = '';

    const filters: JobFilters = {
      category: this.selectedCategory || undefined,
      type: this.selectedType || undefined,
      location: this.selectedLocation || undefined,
      search: this.searchTerm || undefined,
      page: this.currentPage,
      limit: this.jobsPerPage
    };

    this.jobsService.getJobs(filters).subscribe({
      next: (response) => {
        this.jobs = response.jobs;
        this.filteredJobs = response.jobs;
        this.totalJobs = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.error = 'Error al cargar los trabajos. Mostrando datos de ejemplo.';
        this.loading = false;
        // Fallback a datos de ejemplo
        this.loadExampleJobs();
      }
    });
  }

  // Datos de ejemplo como fallback
  loadExampleJobs(): void {
    // Datos de ejemplo - en producción vendría del backend
    this.jobs = [
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
        postedDate: new Date('2025-10-28'),
        deadline: new Date('2025-11-15'),
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
        postedDate: new Date('2025-10-27'),
        deadline: new Date('2025-11-10'),
        applicants: 8,
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop'
      },
      {
        id: 3,
        title: 'Diseñador gráfico para campaña publicitaria',
        company: 'CreativeStudio',
        location: 'Remoto',
        type: 'full-time',
        category: 'design',
        description: 'Únete a nuestro equipo para crear campañas visuales impactantes. Trabajarás en proyectos variados para marcas reconocidas.',
        requirements: ['3+ años de experiencia', 'Dominio de Adobe Creative Suite', 'Portfolio sólido'],
        salary: 'S/. 3,000 - S/. 4,500',
        postedDate: new Date('2025-10-26'),
        deadline: new Date('2025-11-20'),
        applicants: 25,
        image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=200&fit=crop',
        urgent: true
      },
      {
        id: 4,
        title: 'Ilustrador de personajes para videojuego',
        company: 'GameDev Studio',
        location: 'Cusco',
        type: 'remote',
        category: 'illustration',
        description: 'Buscamos ilustrador especializado en personajes para nuestro próximo videojuego de aventuras. Estilo cartoon/anime.',
        requirements: ['Experiencia en concept art', 'Estilo cartoon/anime', 'Trabajo en equipo'],
        salary: 'S/. 2,500 - S/. 4,000',
        postedDate: new Date('2025-10-25'),
        deadline: new Date('2025-11-12'),
        applicants: 18,
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop'
      },
      {
        id: 5,
        title: 'Redactor de novelas románticas',
        company: 'Editorial Romance',
        location: 'Lima',
        type: 'freelance',
        category: 'writing',
        description: 'Editorial especializada en romance busca escritores para desarrollar nuevas historias. Oportunidad de publicación garantizada.',
        requirements: ['Experiencia en narrativa romántica', 'Capacidad de escritura ágil', 'Creatividad'],
        salary: 'Por proyecto: S/. 1,800 - S/. 3,200',
        postedDate: new Date('2025-10-24'),
        deadline: new Date('2025-11-08'),
        applicants: 15,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
        featured: true
      }
    ];
  }

  // Aplicar filtros (ahora utiliza el servicio backend)
  applyFilters(): void {
    this.currentPage = 1; // Resetear a página 1 cuando se aplican filtros
    this.loadJobs();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  // Método para ver detalles del trabajo
  viewJobDetails(jobId: number): void {
    this.router.navigate(['/jobs', jobId]);
  }

  // Método para aplicar al trabajo
  applyToJob(jobId: number): void {
    // Aquí implementarías la lógica para aplicar al trabajo
    console.log('Aplicando al trabajo con ID:', jobId);
    // Ejemplo: navegar a una página de aplicación o abrir un modal
  }

  // Método para guardar trabajo como favorito
  saveJob(jobId: number): void {
    this.jobsService.saveJob(jobId).subscribe({
      next: () => {
        console.log('Trabajo guardado como favorito');
        // Aquí podrías mostrar un mensaje de éxito
      },
      error: (error) => {
        console.error('Error al guardar trabajo:', error);
        // Aquí podrías mostrar un mensaje de error
      }
    });
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
