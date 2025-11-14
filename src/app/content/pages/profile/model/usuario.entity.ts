export class Usuario {
  constructor(
      public id: number,
      public usuario: string,
      public nombre: string,
      public apellido: string,
      public ubicacion: string,
      public foto: string,
      public descripcion: string,
      public redesSociales: {
        additionalProp1: string;
        additionalProp2: string;
        additionalProp3: string;
      },
      public rol: string,
  ) {
  }
}
