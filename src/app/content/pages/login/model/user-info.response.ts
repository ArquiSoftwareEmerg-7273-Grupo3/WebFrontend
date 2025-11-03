import { IlustradorInfo, EscritorInfo } from './role-specific.interfaces';

export interface UserInfoResponse {
  id: number;
  username: string;
  ubicacion: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  foto?: string;
  descripcion: string;
  fechaNacimiento: string; // formato "2025-10-30"
  redesSociales: {
    additionalProp1?: string;
    additionalProp2?: string;
    additionalProp3?: string;
  };
  roleName: string;

  // Información específica de Ilustrador (puede ser null si es escritor)
  ilustrador?: IlustradorInfo | null;

  // Información específica de Escritor (puede ser null si es ilustrador)
  escritor?: EscritorInfo | null;
}
