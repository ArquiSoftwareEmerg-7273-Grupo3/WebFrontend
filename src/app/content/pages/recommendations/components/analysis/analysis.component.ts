import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor, *ngIf en Standalone
import { RecommendationService } from '../../../../../public/services/recommendation.service';
import { RecommendationResult } from '../../../../../models/recommentation.model';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.css'
})
export class AnalysisComponent implements OnInit {
  projects: RecommendationResult[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private recService: RecommendationService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.isLoading = true;
    this.recService.getAllAnalysis().subscribe({
      next: (data) => {
        this.projects = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error conectando con Python backend:', err);
        this.errorMessage = 'No se pudo cargar el análisis. Asegúrate de que el servidor Python esté corriendo.';
        this.isLoading = false;
      }
    });
  }
}
