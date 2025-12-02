// Modelos que coinciden con los recursos del backend project-service

export interface ProyectoResource {
  id: number;
  escritorId: number;
  titulo: string;
  descripcion: string;
  estado: EstadoProyecto;
  modalidadProyecto: ModalidadProyecto;
  contratoProyecto: ContratoProyecto;
  especialidadProyecto: EspecialidadProyecto;
  requisitos: string;
  fechaFin: string; 
  fechaInicio: string; 
  presupuesto: number;
  maxPostulaciones: number;
}

export interface CreateProyectoResource {
  titulo: string;
  descripcion: string;
  presupuesto: number;
  fechaInicio: string; 
  fechaFin: string; 
  maxPostulaciones: number;
}

export interface PostulacionResource {
  id: number;
  proyectoId: number;
  ilustradorId: number;
  estado: EstadoPostulacion;
  fechaPostulacion: string;
  mensaje?: string;
  respuesta?: string;
  fechaRespuesta?: string;
}

export enum EstadoPostulacion {
  PENDIENTE = 'PENDIENTE',
  APROBADA = 'APROBADA',
  RECHAZADA = 'RECHAZADA',
  CANCELADA = 'CANCELADA'
}

export enum EstadoProyecto {
    ABIERTO='ABIERTO',
    CERRADO='CERRADO',
    EN_PROGRESO='EN_PROGRESO',
    FINALIZADO='FINALIZADO'
}

export enum ModalidadProyecto {
    REMOTO='REMOTO',
    PRESENCIAL='PRESENCIAL',
    MIXTA='MIXTA'
}

export enum ContratoProyecto {
    TIEMPO_COMPLETO='TIEMPO_COMPLETO',
    MEDIO_TIEMPO='MEDIO_TIEMPO',
    FREELANCE='FREELANCE',
    TEMPORAL='TEMPORAL',
    PRACTICAS='PRACTICAS',
    CONTRATO='CONTRATO',
    VOLUNTARIADO='VOLUNTARIADO'
}

export enum EspecialidadProyecto {
    ILUSTRACION_DIGITAL='ILUSTRACION_DIGITAL',
    ILUSTRACION_TRADICIONAL='ILUSTRACION_TRADICIONAL',
    CONCEPT_ART='CONCEPT_ART',
    COMIC_MANGA='COMIC_MANGA',
    ANIMACION='ANIMACION',
    ARTE_3D='ARTE_3D',
    ARTE_VECTORIAL='ARTE_VECTORIAL'
}

export interface CreatePostulacionResource {
  fecha: string;
  coverLetter?: string;
  estimatedTime?: string;
  proposedBudget?: number;
  portfolioLinks?: string[];
  answers?: { [key: string]: string };
  isPriority?: boolean;
}

export interface AprobarPostulacionResource {
  respuesta: string;
}

export interface RechazarPostulacionResource {
  razon: string;
}

export interface ProyectoWithDetails extends ProyectoResource {
  postulaciones?: PostulacionResource[];
  postulacionesCount?: number;
  escritorNombre?: string;
}

export const EspecialidadProyectoLabel: Record<EspecialidadProyecto, string> = {
    ILUSTRACION_DIGITAL: 'Ilustración Digital',
    ILUSTRACION_TRADICIONAL: 'Ilustración Tradicional',
    CONCEPT_ART: 'Concept Art',
    COMIC_MANGA: 'Cómic/Manga',
    ANIMACION: 'Animación',
    ARTE_3D: 'Arte 3D',
    ARTE_VECTORIAL: 'Arte Vectorial'
  };
  export const ModalidadProyectoLabel: Record<ModalidadProyecto, string> = {
    REMOTO: 'Remoto',
    PRESENCIAL: 'Presencial',
    MIXTA: 'Mixta'
  };
  export const ContratoProyectoLabel: Record<ContratoProyecto, string> = {
    TIEMPO_COMPLETO: 'Tiempo Completo',
    MEDIO_TIEMPO: 'Medio Tiempo',
    FREELANCE: 'Freelance',
    TEMPORAL: 'Temporal',
    PRACTICAS: 'Prácticas',
    CONTRATO: 'Por Contrato',
    VOLUNTARIADO: 'Voluntariado'
  };
  export const EstadoProyectoLabel: Record<EstadoProyecto, string> = {
    ABIERTO: 'Abierto para postulaciones',
    CERRADO: 'Cerrado, no acepta postulaciones',
    EN_PROGRESO: 'En progreso con ilustrador asignado',
    FINALIZADO: 'Proyecto finalizado'
  };

