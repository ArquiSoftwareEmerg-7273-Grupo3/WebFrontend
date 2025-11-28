// src/app/models/recommendation.model.ts

export interface Artist {
  id: number;
  name: string;
  description: string;
  score?: number;
  image_path?: string; // Si el backend envía imagen del artista
}

export interface RecommendationResult {
  project_id: number;
  project_titulo: string;
  recommended_artists: Artist[];
  // Campos auxiliares para mapear datos completos del proyecto si es necesario
  project_data?: ProjectData;
}

export interface ProjectData {
  id: number;
  titulo: string;
  descripcion: string;
  modalidadProyecto: string;
  contratoProyecto: string;
  especialidadProyecto: string;
  requisitos: string;
  image_url?: string;
}

export interface BatchResponse {
  batch_results: RecommendationResult[];
}
