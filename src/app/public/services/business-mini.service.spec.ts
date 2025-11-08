import { TestBed } from '@angular/core/testing';

import { BusinessMiniService } from './business-mini.service';

describe('BusinessMiniService', () => {
  let service: BusinessMiniService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessMiniService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
