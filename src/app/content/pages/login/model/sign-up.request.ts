export class SignUpRequest {
  constructor(public username: string, public password: string,public nombre: String,public apellido: String,public ubicacion: String,public fechaNacimiento:Date,public telefono:String,public redesSociales: { [key: string]: string }, public descripcion: string) {}
}
