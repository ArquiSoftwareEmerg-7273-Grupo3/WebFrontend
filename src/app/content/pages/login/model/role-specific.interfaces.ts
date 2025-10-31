export interface IlustradorInfo {
  id: number;
  nombreArtistico?: string;
  suscripcion: boolean;
}

export interface EscritorInfo {
  id: number;
  razonSocial?: string;
  ruc?: string;
  nombreComercial?: string;
  sitioWeb?: boolean;
  logo?: string;
  ubicacionEmpresa?: string;
  tipoEmpresa?: string;
}