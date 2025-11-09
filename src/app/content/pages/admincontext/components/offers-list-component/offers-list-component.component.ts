import { Component, OnInit} from '@angular/core';
import {Offer} from '../../interfaces/offer/offer';
import {AdminServiceService} from '../../services/admin-service.service';
import {SidebarComponentComponent} from '../../public/components/sidebar-component/sidebar-component.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-offers-list-component',
  imports: [
    SidebarComponentComponent,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSort
  ],
  templateUrl: './offers-list-component.component.html',
  styleUrl: './offers-list-component.component.css'
})
export class OffersListComponentComponent implements OnInit {
  displayedColumns: string[] = ['title', 'authorId', 'createdAt', 'status', 'actions'];

  allData: Offer[] = [];
  pagedData: Offer[] = [];
  loading = false;
  error = '';

  // estado de paginación/orden
  pageSize = 5;
  pageIndex = 0;
  sortActive = 'createdAt';
  sortDirection: 'asc' | 'desc' | '' = '';

  constructor(private svc: AdminServiceService) {}

  ngOnInit() {
    this.load();
  }

  private normalize(res: any): Offer[] {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.offers)) return res.offers;
    if (Array.isArray(res?.items)) return res.items;
    return [];
  }

  private applySortAndPage() {
    let data = [...this.allData];

    // orden simple
    if (this.sortActive && this.sortDirection) {
      data.sort((a: any, b: any) => {
        const va = a[this.sortActive];
        const vb = b[this.sortActive];

        if (va == null && vb == null) return 0;
        if (va == null) return 1;
        if (vb == null) return -1;

        if (typeof va === 'string' && typeof vb === 'string') {
          return this.sortDirection === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
        }

        return this.sortDirection === 'asc' ? (va > vb ? 1 : va < vb ? -1 : 0) : (vb > va ? 1 : vb < va ? -1 : 0);
      });
    }

    const start = this.pageIndex * this.pageSize;
    this.pagedData = data.slice(start, start + this.pageSize);
  }

  onPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applySortAndPage();
  }

  onSort(event: Sort) {
    this.sortActive = event.active || this.sortActive;
    this.sortDirection = (event.direction as any) || '';
    this.applySortAndPage();
  }

  load() {
    this.loading = true;
    this.error = '';

    const call = (this.svc as any).getOffers
      ? (this.svc as any).getOffers()
      : (this.svc as any).getOffersList
        ? (this.svc as any).getOffersList()
        : (this.svc as any).getAllOffers
          ? (this.svc as any).getAllOffers()
          : null;

    if (!call || !call.subscribe) {
      this.loading = false;
      this.allData = [];
      this.pagedData = [];
      this.error = 'Servicio de ofertas no disponible';
      return;
    }

    call.subscribe({
      next: (res: any) => {
        this.allData = this.normalize(res);
        this.pageIndex = 0;
        this.applySortAndPage();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error cargando ofertas', err);
        this.allData = [];
        this.pagedData = [];
        this.loading = false;
        this.error = 'No se pudieron cargar las ofertas';
      }
    });
  }

  flag(o: Offer) {
    if (!confirm('Marcar oferta como problemática?')) return;
    (this.svc as any).flagOffer?.(String(o.id))?.subscribe?.({
      next: () => this.load(),
      error: (err: any) => { console.error(err); alert('Error marcando oferta'); }
    });
  }

  remove(o: Offer) {
    if (!confirm('Eliminar oferta?')) return;
    (this.svc as any).removeOffer?.(String(o.id))?.subscribe?.({
      next: () => this.load(),
      error: (err: any) => { console.error(err); alert('Error eliminando oferta'); }
    });
  }
}
