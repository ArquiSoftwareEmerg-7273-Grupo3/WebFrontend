import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PopupRegistroIlustradorComponent} from '../popup-registro-ilustrador/popup-registro-ilustrador.component';
import {environment} from '../../../../../environments/environment';
import {Ilustrador} from '../model/ilustrador.entity';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupRegistroIlustradorService {
  constructor(private dialog: MatDialog, private router: Router, private http: HttpClient) { }

  basePath: string = `${environment.baseUrlAuth}`;
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  openPopup(config: { width?: string; maxWidth?: string } = { width: '800px', maxWidth: 'calc(100vw - 32px)' }) {
    this.dialog.open(PopupRegistroIlustradorComponent, {
      width: config.width,
      maxWidth: config.maxWidth,
      disableClose: false,
      autoFocus: false
    });
  }

  registerIllustrator(ilustrador: Ilustrador): Observable<any> {
    return this.http.post(`${this.basePath}/api/v1/ilustradores`, ilustrador, this.httpOptions);
  }
}
