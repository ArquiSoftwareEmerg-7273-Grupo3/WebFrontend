import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {Ilustration} from '../model/ilustration.entity';

@Injectable({
  providedIn: 'root'
})
export class IlustrationService {

  basePath: string = `${environment.baseUrlAuth}`;
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  constructor(private http: HttpClient) {
  }

  publicIlustration(ilustration: Ilustration, ilustradorId: number | null): Observable<any> {
    const url = `${this.basePath}/api/v1/ilustraciones/publicar/${ilustradorId}`;
    const body = { ...ilustration, publicada: true };
    return this.http.post(url, body, { headers: this.httpOptions.headers, responseType: 'text' }).pipe(
      map((res: string) => {
        if (!res) return null;
        try {
          return JSON.parse(res);
        } catch {
          return res;
        }
      }),
      catchError(err => {
        console.error('[IlustrationService.publicIlustration] error', err);
        return throwError(() => err);
      })
    );
  }

  updateIllustration(illustrationId: number, illustrationData: any): Observable<any> {
    const url = `${this.basePath}/api/v1/ilustraciones/${illustrationId}`;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }) : this.httpOptions.headers;
    return this.http.put(url, illustrationData, { headers }).pipe(
      catchError(err => {
        console.error('[IlustrationService.updateIllustration] error', err);
        return throwError(() => err);
      })
    );
  }

  deleteIllustration(illustrationId: number): Observable<any> {
    const url = `${this.basePath}/api/v1/ilustraciones/${illustrationId}`;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.delete(url, { headers }).pipe(
      catchError(err => {
        console.error('[IlustrationService.deleteIllustration] error', err);
        return throwError(() => err);
      })
    );
  }

  getIllustrationSummary(illustrationId: number): Observable<any> {
    const url = `${this.basePath}/api/v1/ilustraciones/${illustrationId}/resumen`;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.get(url, { headers }).pipe(
      catchError(err => {
        console.error('[IlustrationService.getIllustrationSummary] error', err);
        return throwError(() => err);
      })
    );
  }

  getPublishedIllustrations(ilustradorId: number): Observable<any[]> {
    const url = `${this.basePath}/api/v1/ilustraciones/ilustrador/${ilustradorId}/publicadas`;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.get<any[]>(url, { headers }).pipe(
      catchError(err => {
        console.error('[IlustrationService.getPublishedIllustrations] error', err);
        return throwError(() => err);
      })
    );
  }

  // Calificaciones
  rateIllustration(illustrationId: number, rating: number, comment?: string): Observable<any> {
    const url = `${this.basePath}/api/v1/calificaciones/${illustrationId}`;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }) : this.httpOptions.headers;
    const body = { puntuacion: rating, comentario: comment || '' };
    return this.http.post(url, body, { headers }).pipe(
      catchError(err => {
        console.error('[IlustrationService.rateIllustration] error', err);
        return throwError(() => err);
      })
    );
  }

  getRatings(illustrationId: number): Observable<any[]> {
    const url = `${this.basePath}/api/v1/calificaciones/${illustrationId}`;
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.get<any[]>(url, { headers }).pipe(
      catchError(err => {
        console.error('[IlustrationService.getRatings] error', err);
        return throwError(() => err);
      })
    );
  }
}
