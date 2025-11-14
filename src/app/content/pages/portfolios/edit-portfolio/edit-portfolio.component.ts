import {booleanAttribute, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {Portfolio} from '../model/portfolio.entity';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-edit-portfolio',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    FormsModule
  ],
  templateUrl: './edit-portfolio.component.html',
  styleUrl: './edit-portfolio.component.css'
})
export class EditPortfolioComponent implements OnChanges{
  constructor(private http: HttpClient) {}
  /** Datos iniciales (opcional) */
  @Input() title = 'Retratos';
  @Input() description =
    'Retratos hechos en mis tiempos libres. Me gusta variar siempre los estilos que uso para darle un detalle único a cada obra.';
  @Input() category = 'Retratos';
  selectedFile: File | null = null;
  selectedFileName: string = '';
  image: string = '';
  /** Categorías de ejemplo */
  @Input() categories: string[] = ['Retratos', 'Paisajes', 'Ilustración', 'Concept Art'];

  previewCoverUrl?: string;
  @Input() portfolio!: Portfolio;

  @Output() save = new EventEmitter<Portfolio>();
  @Output() cancel = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['portfolio'] && this.portfolio) {
      this.title = this.portfolio.titulo ?? this.title;
      this.description = this.portfolio.descripcion ?? this.description;
      this.category = (this.portfolio as any).category ?? this.category;
      (this.portfolio as any).imageSrc && (this.previewCoverUrl = (this.portfolio as any).imageSrc);
    }
  }

  // Avisar al padre que se cerró
  close(): void {
    this.cancel.emit();
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onChangeCoverClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  OnFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
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
    console.log('Archivo seleccionado:', file);
        console.log('Archivo seleccionado:', file.name);
    // Crear vista previa local
    this.uploadImage(file);
    // Convertir a base64 para enviar al backend
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

  onCoverSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files && input.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Selecciona un archivo de imagen válido');
    return;
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    alert('La imagen no debe superar los 10MB');
    return;
  }

  this.selectedFile = file;
  this.selectedFileName = file.name;

  // 1) Mostrar preview local
  const reader = new FileReader();
  reader.onload = () => (this.previewCoverUrl = reader.result as string);
  reader.readAsDataURL(file);

  // 2) SUBIR AL BACKEND (lo más importante)
  this.uploadImage(file);
}


  // Emitir los datos actualizados al padre y luego cerrar (emit cancel)
  guardarVisual(): void {
    const updated: Portfolio = {
      id: this.portfolio?.id,
      titulo: this.title,
      descripcion: this.description,
      category: this.category,
      urlImagen: this.image,
      showMenu: this.portfolio?.showMenu
    } as unknown as Portfolio;

    this.save.emit(updated);
    this.cancel.emit();
  }
}
