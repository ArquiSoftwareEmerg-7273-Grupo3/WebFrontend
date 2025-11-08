import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Ilustrador} from '../../profile/model/ilustrador.entity';
import {Observable} from 'rxjs';
import {Escritor} from '../../profile/model/escritor.entity';

@Injectable({
  providedIn: 'root'
})
export class ProfileRegistrationService {

  constructor(private router: Router, private http: HttpClient) { }

  basePath: string = `${environment.baseUrlAuth}`;
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  registerIlustrador(ilustrador: Ilustrador): Observable<any> {
    return this.http.post(`${this.basePath}/api/v1/ilustradores`, ilustrador, this.httpOptions);
  }

  registerEscritor(escritor: Escritor): Observable<any> {
    return this.http.post(`${this.basePath}/api/v1/escritores`, escritor, this.httpOptions);
  }

}
