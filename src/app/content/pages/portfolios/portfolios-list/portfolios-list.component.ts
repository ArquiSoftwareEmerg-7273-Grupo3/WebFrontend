import {Component, HostListener, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {Router} from '@angular/router';
import {PortfolioCardComponent} from '../../home/components/portfolio-card/portfolio-card.component';
import {
  PortfolioCardWriterComponent
} from './components/portfolio-card-writer/portfolio-card-writer.component';
import {Portfolio} from '../model/portfolio.entity';
import {EditPortfolioComponent} from '../edit-portfolio/edit-portfolio.component';
import {FormsModule} from '@angular/forms';
import {PortfolioService} from '../services/portfolio.service';

@Component({
  selector: 'app-portfolios-list',
  standalone: true,
  imports: [
    NgForOf,
    PortfolioCardWriterComponent,
    NgIf,
    EditPortfolioComponent,
    FormsModule
  ],
  templateUrl: './portfolios-list.component.html',
  styleUrl: './portfolios-list.component.css'
})
export class PortfoliosListComponent implements OnInit {
  portfolios: Portfolio[] = [];
  editVisible: boolean | undefined;
  selectedPortfolio: Portfolio | undefined;
  categories: string[] | undefined | undefined;

  filteredPortfolios: Portfolio[] = [];
  filterCategories: string[] = ['Retratos', 'Acuarelas', 'Ilustración', 'Concept Art'];
  selectedFilter: string = '';

  constructor(private router: Router, private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.portfolioService.getPortafolio().subscribe({
      next: (list: Portfolio[]) => {
        console.log('[PortfoliosList] portafolios recibidos ->', list);
        this.portfolios = list || [];
        // comprobar que cada portfolio tiene id
        this.portfolios.forEach(p => {
          if (p.id === undefined || p.id === null) {
            console.warn('[PortfoliosList] portfolio sin id detectado', p);
          }
        });
        this.applyFilter();
      },
      error: (err: any) => {
        console.error('Error cargando portafolios:', err);
        this.portfolios = [];
        this.applyFilter();
      }
    });
  }

  toggleMenu(p: Portfolio, event?: MouseEvent) {
    event?.stopPropagation();
    this.portfolios.forEach(x => {
      if (x !== p) x.showMenu = false;
    });
    p.showMenu = !p.showMenu;
  }

  createCategory(): void {
    alert('Crear categoría — implementar lógica aquí');
  }

  @HostListener('document:click')
  closeAllMenus() {
    this.portfolios.forEach(p => (p.showMenu = false));
  }

  goToPortfolio(id?: number) {
    console.log('[goToPortfolio] id recibido ->', id);
    if (id === undefined || id === null) {
      console.warn('[goToPortfolio] id indefinido. Revisar que [id] se esté pasando desde la plantilla y que la API devuelva campo id.');
      return;
    }
    this.router.navigate(['/portfolios/information', id]);
  }

  goToCreatePortfolio() {
    this.router.navigate(['/portfolios/create-new-portfolio']);
  }


  deletePortfolio(id: number) {
    alert('Portafolio eliminado');
  }

  goToEditPortolio() {
    this.router.navigate(['/portfolios/edit']);
  }

  closeEdit() {
    //
  }

  savePortfolio($event: Portfolio) {

  }

  applyFilter(): void {
    if (!this.selectedFilter) {
      this.filteredPortfolios = [...this.portfolios];
    } else {
      this.filteredPortfolios = this.portfolios.filter(p => p.titulo === this.selectedFilter);
    }
  }
}
