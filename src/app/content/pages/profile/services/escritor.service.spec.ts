import { TestBed } from '@angular/core/testing';

import { EscritorService } from './escritor.service';

describe('EscritorService', () => {
  let service: EscritorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EscritorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
