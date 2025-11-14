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
}
