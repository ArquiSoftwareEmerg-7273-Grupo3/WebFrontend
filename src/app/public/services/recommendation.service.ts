// src/app/services/recommendation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {BatchResponse, RecommendationResult} from '../../models/recommentation.model';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = environment.recommendationApiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los proyectos analizados y sus recomendaciones.
   * Consume: GET /recommendations/process_all
   */
  getAllAnalysis(): Observable<RecommendationResult[]> {
    return this.http.get<BatchResponse>(`${this.apiUrl}/recommendations/process_all`)
      .pipe(
        map(response => response.batch_results)
      );
  }

  /**
   * Obtiene los resultados de un proyecto específico por ID.
   * (Simulado filtrando la lista completa, idealmente sería un endpoint dedicado)
   */
  getAnalysisById(id: number): Observable<RecommendationResult | undefined> {
    return this.getAllAnalysis().pipe(
      map(results => results.find(r => r.project_id === id))
    );
  }
}
