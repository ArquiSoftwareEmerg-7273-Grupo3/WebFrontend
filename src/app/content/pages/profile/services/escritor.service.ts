import { Injectable } from '@angular/core';
import {BaseService} from '../../shared/services/base.service';
import {Escritor} from '../model/escritor.entity';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EscritorService extends BaseService<Escritor> {

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/escritores';
  }
}
