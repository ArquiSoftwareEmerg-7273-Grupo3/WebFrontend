import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-portfolio-card-writer',
  standalone: true,
  imports: [
    NgOptimizedImage

  ],
  templateUrl: './portfolio-card-writer.component.html',
  styleUrl: './portfolio-card-writer.component.css'
})
export class PortfolioCardWriterComponent {
  @Input() id?: number;
  @Input() urlImagen: string = '';
  @Input() titulo: string = '';

  @Output() viewMoreClicked = new EventEmitter<number | undefined>();

  viewMore() {
    this.viewMoreClicked.emit(this.id);
  }
}
