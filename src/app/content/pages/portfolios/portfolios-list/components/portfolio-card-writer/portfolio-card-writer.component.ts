import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-portfolio-card-writer',
  standalone: true,
  imports: [],
  templateUrl: './portfolio-card-writer.component.html',
  styleUrl: './portfolio-card-writer.component.css'
})
export class PortfolioCardWriterComponent {
  @Input() id!: number;
  @Input() imageSrc: string = '';
  @Input() date: string = '';
  @Input() title: string = '';

  @Output() viewMoreClicked = new EventEmitter<number>();

  viewMore() {
    this.viewMoreClicked.emit(this.id);
  }
}
