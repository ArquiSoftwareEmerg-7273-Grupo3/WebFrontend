import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IlustrationService } from '../../services/ilustration.service';

@Component({
  selector: 'app-illustration-rating',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './illustration-rating.component.html',
  styleUrl: './illustration-rating.component.css'
})
export class IllustrationRatingComponent implements OnInit {
  @Input() illustrationId!: number;
  
  ratings: any[] = [];
  averageRating: number = 0;
  userRating: number = 0;
  userComment: string = '';
  showRatingForm: boolean = false;
  hoveredStar: number = 0;

  constructor(private illustrationService: IlustrationService) {}

  ngOnInit() {
    if (this.illustrationId) {
      this.loadRatings();
    }
  }

  loadRatings() {
    this.illustrationService.getRatings(this.illustrationId).subscribe({
      next: (ratings) => {
        this.ratings = ratings || [];
        this.calculateAverage();
      },
      error: (err) => {
        console.error('Error cargando calificaciones:', err);
        this.ratings = [];
      }
    });
  }

  calculateAverage() {
    if (this.ratings.length === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.ratings.reduce((acc, r) => acc + (r.puntuacion || 0), 0);
    this.averageRating = sum / this.ratings.length;
  }

  setRating(rating: number) {
    this.userRating = rating;
  }

  setHoveredStar(star: number) {
    this.hoveredStar = star;
  }

  clearHover() {
    this.hoveredStar = 0;
  }

  submitRating() {
    if (this.userRating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }

    this.illustrationService.rateIllustration(
      this.illustrationId,
      this.userRating,
      this.userComment
    ).subscribe({
      next: () => {
        alert('Calificación enviada exitosamente');
        this.userRating = 0;
        this.userComment = '';
        this.showRatingForm = false;
        this.loadRatings();
      },
      error: (err) => {
        console.error('Error enviando calificación:', err);
        alert('Error al enviar la calificación: ' + (err?.error || err?.message || 'Error desconocido'));
      }
    });
  }

  toggleRatingForm() {
    this.showRatingForm = !this.showRatingForm;
  }

  getStarClass(index: number): string {
    const displayRating = this.hoveredStar || this.userRating;
    return index <= displayRating ? 'star filled' : 'star';
  }
}
