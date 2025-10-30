import { TestBed } from '@angular/core/testing';

import { PopupRegistroIlustradorService } from './popup-registro-ilustrador.service';

describe('PopupRegistroIlustradorService', () => {
  let service: PopupRegistroIlustradorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupRegistroIlustradorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
