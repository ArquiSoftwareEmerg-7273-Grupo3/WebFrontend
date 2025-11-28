import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RecommendationService } from '../../../../../public/services/recommendation.service';
import { Artist } from '../../../../../models/recommentation.model';

@Component({
  selector: 'app-applicants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applicants.component.html',
  styleUrl: './applicants.component.css'
})
export class ApplicantsComponent implements OnInit {
  projectTitle: string = 'Cargando...';
  artists: Artist[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private recService: RecommendationService
  ) {}

  ngOnInit(): void {
    // Obtener ID de la URL (ej: /analysis/1/applicants)
    const projectId = Number(this.route.snapshot.paramMap.get('id'));

    if (projectId) {
      this.loadApplicants(projectId);
    }
  }

  loadApplicants(id: number) {
    this.recService.getAnalysisById(id).subscribe({
      next: (result) => {
        if (result) {
          this.projectTitle = result.project_titulo;
          this.artists = result.recommended_artists;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
}
