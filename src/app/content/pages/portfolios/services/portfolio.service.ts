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
          const cantidadCategorias = item?.cantidadCategorias ?? categorias.length;
          let cantidadTotalIlustraciones = item?.cantidadTotalIlustraciones ?? 0;
          return new Portfolio(titulo, descripcion, urlImagen, false, categorias, id, cantidadCategorias, cantidadTotalIlustraciones);
        });
      }),
      catchError(err => {
        console.error('[PortfolioService.getPortafolio] error', err);
        return throwError(() => err);
      })
    );
  }

  updatePortfolio(portfolioId: number, portfolio: Partial<Portfolio>): Observable<any> {
    const url = `${this.basePath}/api/v1/portafolios/${portfolioId}`;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }) : this.httpOptions.headers;
    return this.http.put(url, portfolio, { headers }).pipe(
      catchError(err => {
        console.error('[PortfolioService.updatePortfolio] error', err);
        return throwError(() => err);
      })
    );
  }

  deletePortfolio(portfolioId: number): Observable<any> {
    const url = `${this.basePath}/api/v1/portafolios/${portfolioId}`;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.delete(url, { headers }).pipe(
      catchError(err => {
        console.error('[PortfolioService.deletePortfolio] error', err);
        return throwError(() => err);
      })
    );
  }

  // Categorías
  createCategory(portfolioId: number, categoryData: any): Observable<any> {
    const url = `${this.basePath}/api/v1/categorias/portafolio/${portfolioId}`;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }) : this.httpOptions.headers;
    return this.http.post(url, categoryData, { headers }).pipe(
      catchError(err => {
        console.error('[PortfolioService.createCategory] error', err);
        return throwError(() => err);
      })
    );
  }

  getCategoriesByPortfolio(portfolioId: number): Observable<any[]> {
    const url = `${this.basePath}/api/v1/categorias/portafolio/${portfolioId}`;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.get<any[]>(url, { headers }).pipe(
      catchError(err => {
        console.error('[PortfolioService.getCategoriesByPortfolio] error', err);
        return throwError(() => err);
      })
    );
  }

  updateCategory(categoryId: number, categoryData: any): Observable<any> {
    const url = `${this.basePath}/api/v1/categorias/${categoryId}`;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }) : this.httpOptions.headers;
    return this.http.put(url, categoryData, { headers }).pipe(
      catchError(err => {
        console.error('[PortfolioService.updateCategory] error', err);
        return throwError(() => err);
      })
    );
  }

  deleteCategory(categoryId: number): Observable<any> {
    const url = `${this.basePath}/api/v1/categorias/${categoryId}`;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.delete(url, { headers }).pipe(
      catchError(err => {
        console.error('[PortfolioService.deleteCategory] error', err);
        return throwError(() => err);
      })
    );
  }

  addIllustrationToCategory(categoryId: number, illustrationData: any): Observable<any> {
    const url = `${this.basePath}/api/v1/categorias/${categoryId}/ilustraciones`;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }) : this.httpOptions.headers;
    return this.http.post(url, illustrationData, { headers }).pipe(
      catchError(err => {
        console.error('[PortfolioService.addIllustrationToCategory] error', err);
        return throwError(() => err);
      })
    );
  }
}
