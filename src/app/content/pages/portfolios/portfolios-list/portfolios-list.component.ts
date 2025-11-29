import {Component, HostListener, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {Router} from '@angular/router';
import {Portfolio} from '../model/portfolio.entity';
import {EditPortfolioComponent} from '../edit-portfolio/edit-portfolio.component';
import {FormsModule} from '@angular/forms';
import {PortfolioService} from '../services/portfolio.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-portfolios-list',
  standalone: true,
  imports: [
    NgForOf,
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

  constructor(
    private router: Router, 
    private portfolioService: PortfolioService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadPortfolios();
  }

  private loadPortfolios(): void {
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
        setTimeout(() => {
          this.loadPortfolios();
        }, 500);
      },
      error: (err) => {
        console.error('Error creando categoría:', err);
        
        // Si el error es 202, tratarlo como éxito
        if (err.status === 202) {
          alert('Categoría creada exitosamente');
          this.closeCategoryModal();
          setTimeout(() => {
            this.loadPortfolios();
          }, 1000);
        } else {
          alert('Error al crear la categoría: ' + (err?.error || err?.message || 'Error desconocido'));
        }
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
    // Verificar si ya existe un portafolio
    if (this.portfolios.length > 0) {
      alert('Ya tienes un portafolio creado. Solo puedes tener un portafolio por cuenta.');
      return;
    }
    
    // Mostrar modal para crear portafolio
    this.showCreatePortfolioModal = true;
  }

  // Variables para el modal de crear portafolio
  showCreatePortfolioModal: boolean = false;
  newPortfolioTitle: string = '';
  newPortfolioDescription: string = '';
  newPortfolioImage: string = '';
  selectedImageFile: File | null = null;
  selectedImageFileName: string = '';
  isUploadingImage: boolean = false;

  closeCreatePortfolioModal(): void {
    this.showCreatePortfolioModal = false;
    this.newPortfolioTitle = '';
    this.newPortfolioDescription = '';
    this.newPortfolioImage = '';
    this.selectedImageFile = null;
    this.selectedImageFileName = '';
    this.isUploadingImage = false;
  }

  /**
   * Manejar selección de archivo de imagen para portafolio
   */
  onPortfolioImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file: File | null = input.files?.[0] || null;
    
    if (!file) return;
    
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }
    
    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('La imagen no debe superar los 10MB');
      return;
    }
    
    this.selectedImageFile = file;
    this.selectedImageFileName = file.name;
    
    // Subir la imagen al backend
    this.uploadPortfolioImage(file);
  }

  /**
   * Subir imagen al backend usando el endpoint de media
   */
  private uploadPortfolioImage(file: File): void {
    this.isUploadingImage = true;
    const formData = new FormData();
    formData.append('file', file);

    const uploadUrl = 'http://localhost:8080/api/v1/media/upload';
    
    this.http.post(uploadUrl, formData).subscribe({
      next: (response: any) => {
        console.log('✅ Imagen subida exitosamente:', response);
        
        // Guardar la URL completa
        const imageUrl = 'http://localhost:8080' + response.url;
        this.newPortfolioImage = imageUrl;
        this.isUploadingImage = false;
        
        console.log('📸 URL de imagen guardada:', imageUrl);
      },
      error: (error) => {
        console.error('❌ Error al subir imagen:', error);
        alert('Error al subir la imagen. Por favor, intenta nuevamente.');
        
        // Limpiar selección en caso de error
        this.selectedImageFile = null;
        this.selectedImageFileName = '';
        this.isUploadingImage = false;
      }
    });
  }

  saveNewPortfolio(): void {
    if (!this.newPortfolioTitle.trim()) {
      alert('El título del portafolio es obligatorio');
      return;
    }

    const newPortfolio = {
      titulo: this.newPortfolioTitle.trim(),
      descripcion: this.newPortfolioDescription.trim() || 'Mi portafolio de ilustraciones',
      urlImagen: this.newPortfolioImage.trim(),
      categorias: []
    };

    this.portfolioService.createPortfolio(newPortfolio as Portfolio).subscribe({
      next: (response) => {
        console.log('[PortfoliosList] Portafolio creado exitosamente:', response);
        alert('¡Portafolio creado exitosamente!');
        this.closeCreatePortfolioModal();
        
        // Recargar inmediatamente después de un pequeño delay para asegurar que el backend procesó
        setTimeout(() => {
          this.loadPortfolios();
        }, 500);
      },
      error: (err) => {
        console.error('[PortfoliosList] Error creando portafolio:', err);
        
        // Si el error es 200 o 202, tratarlo como éxito
        if (err.status === 200 || err.status === 202) {
          console.log('[PortfoliosList] Código 200/202 recibido, tratando como éxito');
          alert('¡Portafolio creado exitosamente!');
          this.closeCreatePortfolioModal();
          
          // Recargar después de un delay más largo para operaciones asíncronas
          setTimeout(() => {
            this.loadPortfolios();
          }, 1000);
        } else {
          const errorMsg = err?.error?.message || err?.message || 'Error desconocido';
          alert('Error al crear el portafolio: ' + errorMsg);
        }
      }
    });
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
        
        // Si el error es 202, tratarlo como éxito
        if (err.status === 202) {
          alert('Portafolio eliminado exitosamente');
          this.portfolios = this.portfolios.filter(p => p.id !== id);
          this.applyFilter();
        } else {
          alert('Error al eliminar el portafolio: ' + (err?.error || err?.message || 'Error desconocido'));
        }
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
        setTimeout(() => {
          this.loadPortfolios();
        }, 500);
      },
      error: (err) => {
        console.error('Error actualizando portafolio:', err);
        
        // Si el error es 202, tratarlo como éxito
        if (err.status === 202) {
          alert('Portafolio actualizado exitosamente');
          this.closeEdit();
          setTimeout(() => {
            this.loadPortfolios();
          }, 1000);
        } else {
          alert('Error al actualizar el portafolio: ' + (err?.error || err?.message || 'Error desconocido'));
        }
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
