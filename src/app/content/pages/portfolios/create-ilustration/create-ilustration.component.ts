import {Component, OnInit} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {PortfolioService} from '../services/portfolio.service';
import {AuthenticationService} from '../../login/services/authentication.service';
import {firstValueFrom, switchMap} from 'rxjs';
import {IlustrationService} from '../services/ilustration.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-create-ilustration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

  ],
  templateUrl: './create-ilustration.component.html',
  styleUrl: './create-ilustration.component.css'
})
export class CreateIlustrationComponent implements OnInit {
  title = '';
  description = '';
  image = '';
  selectedCategory: number | null = null;
  categories: any[] = [];
  isLoading = false;
  imagePreview: string = '';
  selectedFile: File | null = null;
  selectedFileName: string = '';

  private portfolioId: string | null = null;
  protected portfolioIdNum: number | null = null;
  private ilustradorId: number | null = null;

  constructor(private location: Location,
              private route: ActivatedRoute,
              private portfolioService: PortfolioService,
              private authService: AuthenticationService,
              private ilustrationService: IlustrationService,
              private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.portfolioId = this.route.snapshot.paramMap.get('id') ?? this.route.snapshot.paramMap.get('portfolioId');
    this.portfolioIdNum = this.portfolioId ? Number(this.portfolioId) : null;
    
    this.authService.getIlustradorId$().subscribe((id: number | null) => {
      this.ilustradorId = id;
    });

    // Cargar categorías del portafolio
    if (this.portfolioIdNum) {
      this.loadCategories();
    }

  }

  OnFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file: File | null = input.files?.[0] || null;
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, GIF)');
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('La imagen no debe superar los 10MB');
      return;
    }
    
    this.selectedFile = file;
    this.selectedFileName = file.name;

    // Crear vista previa local
    this.createImagePreview(file);
    this.uploadImage(file);
    // Convertir a base64 para enviar al backend
  }

  private createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

 

  private uploadImage(file: File): void {
    const formData = new FormData();
    formData.append('file', file);


    this.http.post('http://localhost:8080/api/v1/media/upload', formData).subscribe({
      next: (response: any) => {
        
        const imageUrl = 'http://localhost:8080' + response.url;
        this.image = imageUrl;
        
      },
      error: (error) => {
        console.error('❌ Error al subir imagen:', error);
        
        this.selectedFile = null;
        this.selectedFileName = '';      }
    });
  }

  loadCategories(): void {
    if (!this.portfolioIdNum) return;
    
    this.portfolioService.getCategoriesByPortfolio(this.portfolioIdNum).subscribe({
      next: (categories) => {
        this.categories = categories || [];
      },
      error: (err) => {
        this.categories = [];
      }
    });
  }

  onImageUrlChange(): void {
    if (this.image && this.image.trim()) {
      this.imagePreview = this.image.trim();
    } else {
      this.imagePreview = '';
    }
  }

  // Asegura que tengamos el ilustradorId: usa cache o fuerza carga desde el servicio
  private async ensureIlustradorId(): Promise<number | null> {
    if (this.ilustradorId) return this.ilustradorId;
    try {
      const id = await firstValueFrom(this.authService.getIlustradorId$());
      this.ilustradorId = id;
      console.log('ensureIlustradorIdNum ->', this.ilustradorId);
      return this.ilustradorId;
    } catch (e) {
      console.error('Error obteniendo ilustradorId numérico', e);
      return null;
    }
  }

  async createIllustration() {
    if (!this.portfolioIdNum || isNaN(this.portfolioIdNum)) {
      alert('ID de portafolio inválido. No se puede crear la ilustración.');
      return;
    }

    const id = await this.ensureIlustradorId();
    if (id == null) {
      alert('No se encontró el ID del ilustrador.');
      return;
    }

    const titulo = (this.title || '').trim();
    const descripcion = (this.description || '').trim();
    const urlImagen = (this.image || '').trim();

    if (!titulo) { 
      alert('El título es obligatorio'); 
      return; 
    }
    if (!urlImagen) { 
      alert('La URL de la imagen es obligatoria'); 
      return; 
    }

    this.isLoading = true;

    // Si se seleccionó una categoría, agregar a la categoría
    if (this.selectedCategory) {
      const ilustrationData = { titulo, descripcion, urlImagen };
      
      this.portfolioService.addIllustrationToCategory(this.selectedCategory, ilustrationData).subscribe({
        next: () => {
          this.isLoading = false;
          alert('Ilustración agregada a la categoría exitosamente');
          this.location.back();
        },
        error: (err: any) => {
          this.isLoading = false;
          console.error(err);
        }
      });
    } else {
      // Si no hay categoría, usar el flujo original
      const ilustrationPayload = { titulo, descripcion, urlImagen };

      this.ilustrationService.publicIlustration(ilustrationPayload as any, id).pipe(
        switchMap((created: any) => {
          let createdObj: any = created;
          if (typeof created === 'string') {
            try {
              createdObj = JSON.parse(created);
            } catch {
              createdObj = { urlImagen: created };
            }
          }
          if (!createdObj) createdObj = {};
          
          const createdId = Number(createdObj?.id ?? createdObj?.ilustracionId ?? NaN);
          const payloadForPortfolio = {
            ilustracionId: isFinite(createdId) ? createdId : 0,
            titulo: createdObj?.titulo ?? titulo,
            descripcion: createdObj?.descripcion ?? descripcion,
            urlImagen: createdObj?.urlImagen ?? urlImagen
          };

          return this.portfolioService.createIlustration(this.portfolioIdNum!, id, payloadForPortfolio);
        })
      ).subscribe({
        next: () => {
          this.isLoading = false;
          alert('Ilustración creada y asignada al portafolio con éxito');
          this.location.back();
        },
        error: (err: any) => {
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.nombre : 'Sin categoría';
  }

  goBack() {
    this.location.back();
  }
}
