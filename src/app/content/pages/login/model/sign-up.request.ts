export interface SignUpRequest {
  username: string;
  password: string;
  ubicacion: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  foto?: string;
  descripcion: string;
  fechaNacimiento: string; // formato "2025-10-29"
  redesSociales: {
    additionalProp1?: string;
    additionalProp2?: string;
    additionalProp3?: string;
  };
}
