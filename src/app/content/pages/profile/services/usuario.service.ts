import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Usuario} from '../model/usuario.entity';
import {BaseService} from '../../shared/services/base.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends BaseService<Usuario>{

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/users';

  }

  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.basePath}${this.resourceEndpoint}/${id}`);
  }
}
