import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Portfolio} from '../model/portfolio.entity';
import {catchError, map, Observable, throwError} from 'rxjs';
import {Ilustration} from '../model/ilustration.entity';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  basePath: string = `${environment.baseUrlAuth}`;
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};


  constructor(private http: HttpClient) { }

  createPortfolio(portfolio: Portfolio): Observable<any> {
    return this.http.post(`${this.basePath}/api/v1/portafolios`, portfolio, this.httpOptions);
  }

  createIlustration(portfolioId: number, ilustradorId: number | null, payload: any): Observable<any> {
    const url = `${this.basePath}/api/v1/portafolios/${portfolioId}/ilustraciones`;
    const params = ilustradorId != null ? new HttpParams().set('ilustradorId', String(ilustradorId)) : undefined;
    return this.http.post(url, payload, { headers: this.httpOptions.headers, params }).pipe(
      catchError(err => {
        console.error('[PortfolioService.createIlustration] error', err);
        return throwError(() => err);
      })
    );
  }

  getPortafolio(): Observable<Portfolio[]> {
    const url = `${this.basePath}/api/v1/portafolios/mi-portafolio`;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    return this.http.get<any>(url, { headers }).pipe(
      map(res => {
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        return (list as any[]).map(item => {
          const id = item?.id;
          const titulo = item?.titulo ?? item?.title ?? '';
          const descripcion = item?.descripcion ?? item?.description ?? '';
          const urlImagen = item?.urlImagen ?? item?.image ?? item?.urlImage ?? '';
          const categorias = item?.categorias ?? item?.galleryItems ?? [];
          return new Portfolio(titulo, descripcion, urlImagen, false, categorias, id);
        });
      }),
      catchError(err => {
        console.error('[PortfolioService.getPortafolio] error', err);
        return throwError(() => err);
      })
    );
  }
}
