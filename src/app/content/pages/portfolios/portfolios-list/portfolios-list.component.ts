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
  showCategoryModal: boolean = false;
  newCategoryName: string = '';
  newCategoryDescription: string = '';

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
    this.showCategoryModal = true;
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.newCategoryName = '';
    this.newCategoryDescription = '';
  }

  saveCategoryModal(): void {
    if (!this.newCategoryName.trim()) {
      alert('El nombre de la categoría es obligatorio');
      return;
    }

    if (this.portfolios.length === 0) {
      alert('Primero debes crear un portafolio');
      return;
    }

    const portfolioId = this.portfolios[0].id;
    if (!portfolioId) {
      alert('No se encontró el ID del portafolio');
      return;
    }

    const categoryData = {
      nombre: this.newCategoryName.trim(),
      descripcion: this.newCategoryDescription.trim()
    };

    this.portfolioService.createCategory(portfolioId, categoryData).subscribe({
      next: (response) => {
        alert('Categoría creada exitosamente');
        this.closeCategoryModal();
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error creando categoría:', err);
        alert('Error al crear la categoría: ' + (err?.error || err?.message || 'Error desconocido'));
      }
    });
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
    if (!confirm('¿Estás seguro de que deseas eliminar este portafolio?')) {
      return;
    }

    this.portfolioService.deletePortfolio(id).subscribe({
      next: () => {
        alert('Portafolio eliminado exitosamente');
        this.portfolios = this.portfolios.filter(p => p.id !== id);
        this.applyFilter();
      },
      error: (err) => {
        console.error('Error eliminando portafolio:', err);
        alert('Error al eliminar el portafolio: ' + (err?.error || err?.message || 'Error desconocido'));
      }
    });
  }

  goToEditPortolio() {
    this.router.navigate(['/portfolios/edit']);
  }

  closeEdit() {
    this.editVisible = false;
    this.selectedPortfolio = undefined;
  }

  savePortfolio($event: Portfolio) {
    if (!$event.id) {
      alert('No se puede actualizar un portafolio sin ID');
      return;
    }

    const updateData = {
      titulo: $event.titulo,
      descripcion: $event.descripcion,
      urlImagen: $event.urlImagen
    };

    this.portfolioService.updatePortfolio($event.id, updateData).subscribe({
      next: () => {
        alert('Portafolio actualizado exitosamente');
        this.closeEdit();
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error actualizando portafolio:', err);
        alert('Error al actualizar el portafolio: ' + (err?.error || err?.message || 'Error desconocido'));
      }
    });
  }

  editPortfolio(portfolio: Portfolio, event?: MouseEvent) {
    event?.stopPropagation();
    this.selectedPortfolio = portfolio;
    this.editVisible = true;
    portfolio.showMenu = false;
  }

  applyFilter(): void {
    if (!this.selectedFilter) {
      this.filteredPortfolios = [...this.portfolios];
    } else {
      this.filteredPortfolios = this.portfolios.filter(p => p.titulo === this.selectedFilter);
    }
  }

  getTotalIllustrations(): number {
    return this.portfolios.reduce((total, portfolio) => {
      return total + (portfolio.ilustrations?.length || 0);
    }, 0);
  }
}
