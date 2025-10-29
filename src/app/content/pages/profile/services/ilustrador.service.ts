import { Injectable } from '@angular/core';
import {BaseService} from '../../shared/services/base.service';
import {Ilustrador} from '../model/ilustrador.entity';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IlustradorService extends BaseService<Ilustrador>{

  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/ilustradores';
  }
}
