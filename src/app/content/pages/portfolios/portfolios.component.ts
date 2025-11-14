import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule, Location} from '@angular/common';
import {Portfolio} from './model/portfolio.entity';
import {PortfolioService} from './services/portfolio.service';

@Component({
  selector: 'app-portfolios',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './portfolios.component.html',
  styleUrl: './portfolios.component.css'
})
export class PortfoliosComponent {
  id!: number;
  portfolio: any = {
    titulo: '',
    descripcion: '',
    urlImagen: '',
    galleryItems: []
  };
  galleryItem: any;
  portfolios: Portfolio[] = [];
  categories: any[] = [];
  selectedCategory: any = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private portfolioService: PortfolioService) {}

  ngOnInit() {
    // Forzar scroll al inicio
    window.scrollTo(0, 0);

    this.portfolioService.getPortafolio().subscribe({
      next: (p: any) => {
        console.log('Datos recibidos del servicio:', p);
        const item = Array.isArray(p) ? p[0] : p;
        
        if (item) {
          this.portfolio = {
            titulo: item.titulo || '',
            descripcion: item.descripcion || '',
            urlImagen: item.urlImagen || '',
            galleryItems: item.galleryItems || item.gallery || item.ilustraciones || []
          };
          this.id = item.id;

          // Cargar categorías si tenemos el ID del portafolio
          if (this.id) {
            this.loadCategories();
          }
        } else {
          console.warn('No se recibieron datos del portafolio');
          this.portfolio = {
            titulo: 'Sin título',
            descripcion: 'Sin descripción',
            urlImagen: '',
            galleryItems: []
          };
        }
      },
      error: (err: any) => {
        console.error('Error obteniendo portafolio', err);
        this.portfolio = {
          titulo: 'Error al cargar',
          descripcion: 'No se pudo cargar el portafolio',
          urlImagen: '',
          galleryItems: []
        };
      }
    });
  }

  loadCategories() {
    this.portfolioService.getCategoriesByPortfolio(this.id).subscribe({
      next: (categories: any[]) => {
        this.categories = categories || [];
        console.log('Categorías cargadas:', this.categories);
      },
      error: (err: any) => {
        console.error('Error cargando categorías', err);
        this.categories = [];
      }
    });
  }

  selectCategory(category: any) {
    this.selectedCategory = category;
  }

  clearCategoryFilter() {
    this.selectedCategory = null;
  }

  getFilteredIllustrations() {
    if (!this.selectedCategory) {
      return this.portfolio?.galleryItems || [];
    }
    return this.selectedCategory?.ilustraciones || [];
  }

  goBack() {
    this.location.back();
  }

  goToCreateIllustration() {
    this.router.navigate(['/portfolios/information', this.id, 'create-new-illustration']);
  }
}
