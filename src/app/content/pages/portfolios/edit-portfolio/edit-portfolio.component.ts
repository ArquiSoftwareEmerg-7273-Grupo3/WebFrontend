import {booleanAttribute, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {Portfolio} from '../model/portfolio.entity';


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
  /** Datos iniciales (opcional) */
  @Input() title = 'Retratos';
  @Input() description =
    'Retratos hechos en mis tiempos libres. Me gusta variar siempre los estilos que uso para darle un detalle único a cada obra.';
  @Input() category = 'Retratos';

  /** Categorías de ejemplo */
  @Input() categories: string[] = ['Retratos', 'Paisajes', 'Ilustración', 'Concept Art'];

  previewCoverUrl?: string;
  @Input() portfolio!: Portfolio;

  @Output() save = new EventEmitter<Portfolio>();
  @Output() cancel = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['portfolio'] && this.portfolio) {
      this.title = this.portfolio.title ?? this.title;
      this.description = this.portfolio.description ?? this.description;
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

  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => (this.previewCoverUrl = reader.result as string);
    reader.readAsDataURL(file);
  }

  // Emitir los datos actualizados al padre y luego cerrar (emit cancel)
  guardarVisual(): void {
    const updated: Portfolio = {
      id: this.portfolio?.id ?? Date.now(),
      title: this.title,
      description: this.description,
      category: this.category,
      imageSrc: this.previewCoverUrl,
      showMenu: this.portfolio?.showMenu
    } as Portfolio;

    this.save.emit(updated);
    this.cancel.emit();
  }
}
