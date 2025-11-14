import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location, NgForOf, NgOptimizedImage} from '@angular/common';
import {Portfolio} from './model/portfolio.entity';
import {PortfolioService} from './services/portfolio.service';

@Component({
  selector: 'app-portfolios',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './portfolios.component.html',
  styleUrl: './portfolios.component.css'
})
export class PortfoliosComponent {
  id!: number;
  portfolio: any;
  galleryItem: any;
  portfolios: Portfolio[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.portfolioService.getPortafolio().subscribe({
      next: (p: any) => {
        const item = Array.isArray(p) ? p[0] : p;
        this.portfolio = item || {};
        this.id = item?.id ?? this.id;

        if (!this.portfolio.galleryItems && this.portfolio.gallery) {
          this.portfolio.galleryItems = this.portfolio.gallery;
        }
      },
      error: (err: any) => {
        console.error('Error obteniendo portafolio', err);
      }
    });

    // Forzar scroll al inicio
    window.scrollTo(0, 0);
  }

  goBack() {
    this.location.back();
  }

  goToCreateIllustration() {
    this.router.navigate(['/portfolios/information', this.id, 'create-new-illustration']);
  }
}
