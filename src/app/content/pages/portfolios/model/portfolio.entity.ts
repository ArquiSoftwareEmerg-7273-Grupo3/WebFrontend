import {Ilustration} from './ilustration.entity';

export class Portfolio {
  constructor(
    public titulo: string,
    public descripcion: string,
    public urlImagen: string,
    public showMenu?: boolean,
    public ilustrations?: Ilustration[],
    public id?: number,
  ) {
  }
}
