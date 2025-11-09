import {Component, OnInit} from '@angular/core';
import {Portfolio} from '../../interfaces/portfolio/portfolio';
import {AdminServiceService} from '../../services/admin-service.service';
import {SidebarComponentComponent} from '../../public/components/sidebar-component/sidebar-component.component';
import {
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage, MatCardModule,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {NgForOf, NgIf, SlicePipe} from '@angular/common';
@Component({
  selector: 'app-portfolio-review-component',
  imports: [
    SidebarComponentComponent,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatCardImage,
    MatButton,
    MatCardTitle,
    MatCardSubtitle,
    NgIf,
    NgForOf,
    MatCardModule
  ],
  templateUrl: './portfolio-review-component.component.html',
  styleUrl: './portfolio-review-component.component.css'
})
export class PortfolioReviewComponentComponent implements OnInit {
  portfolios: Portfolio[] = [];
  loading = false;
  error = '';

  constructor(private svc: AdminServiceService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';

    // Preferir getPortfolios si existe (tu JSON tiene "portfolios").
    // Si no existe, intentar getPortfolio('list-flagged') como fallback.
    const call = (this.svc as any).getPortfolios
      ? (this.svc as any).getPortfolios()
      : (this.svc as any).getPortfolio
        ? (this.svc as any).getPortfolio('list-flagged')
        : null;

    if (!call || !call.subscribe) {
      this.loading = false;
      this.portfolios = [];
      this.error = 'Servicio de portfolios no disponible';
      return;
    }

    call.subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.portfolios = res;
        } else if (Array.isArray(res?.portfolios)) {
          this.portfolios = res.portfolios;
        } else if (Array.isArray(res?.items)) {
          this.portfolios = res.items;
        } else {
          this.portfolios = [];
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error cargando portfolios', err);
        this.portfolios = [];
        this.loading = false;
        this.error = 'No se pudieron cargar los portafolios';
      }
    });
  }

  flag(p: Portfolio) {
    if (!confirm('Marcar portfolio como problemático?')) return;
    (this.svc as any).flagPortfolio?.(String(p.id))?.subscribe?.({
      next: () => this.load(),
      error: (err: any) => { console.error(err); alert('Error marcando portfolio'); }
    });
  }

  remove(p: Portfolio) {
    if (!confirm('Eliminar portfolio?')) return;
    (this.svc as any).removePortfolio?.(String(p.id))?.subscribe?.({
      next: () => this.load(),
      error: (err: any) => { console.error(err); alert('Error eliminando portfolio'); }
    });
  }
}
